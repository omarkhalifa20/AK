'use client'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { BadgeCheck, BadgeX, X } from 'lucide-react'
import { clearUserCart, removeFromCart } from '@/Action/Cart'; 
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { useForm } from "react-hook-form"
import toast from 'react-hot-toast'
import { CartMod } from '@/Types/Cartmod'
import { AddOrders } from '@/Action/Orders'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation';
import Loader2 from '../Loader2/Loader2'
import { useAuth } from '@/app/(site)/(auth)/useAuth'; // ضفنا الـ Auth عشان نعرف هو يوزر ولا ضيف
import { useStore } from '@/useStore'; // ضفنا الستور عشان نحدث عداد الـ Navbar

export default function CartMain({cartdata} : {cartdata:CartMod[]}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter();
  const { user } = useAuth();
  const { setInitialCounts, wishlistCount } = useStore(); // لجلب وتحديث العداد
  
  type FormValues = {
    fullname: string
    number: string
    number2: string
    address: string
    details: string
  }
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()
  const [cart, setCart] = useState<CartMod[]>([]);
  const [itemSelections, setItemSelections] = useState<{ [key: string]: { color: string, size: string }[] }>({});

  // 1. جلب البيانات بناءً على حالة العميل
  useEffect(() => {
    if (user) {
      setCart(cartdata);
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      setCart(guestCart);
    }
  }, [user, cartdata]);

  // 2. تحديث الكميات وحفظها للضيوف
  const updateQuantity = (itemId: string, action: 'plus' | 'minus') => {
    setCart((prevCart) => {
      const newCart = prevCart.map((item) => {
        if (item.id === itemId) {
          if (action === 'plus') {
            return { ...item, quantity: item.quantity + 1 };
          }
          if (action === 'minus' && item.quantity > 1) {
            setItemSelections(prev => {
              const current = prev[itemId] || [];
              return { ...prev, [itemId]: current.slice(0, item.quantity - 1) };
            });
            return { ...item, quantity: item.quantity - 1 };
          }
        }
        return item;
      });

      // لو ضيف، احفظ التعديل في المتصفح عشان الكمية متضيعش مع الريفرش
      if (!user) {
        localStorage.setItem("guestCart", JSON.stringify(newCart));
      }

      return newCart;
    });
  };

  const handleSelectionChange = (itemId: string, index: number, field: 'color' | 'size', value: string) => {
    setItemSelections((prev) => {
      const currentItems = [...(prev[itemId] || [])];
      
      if (!currentItems[index]) {
        currentItems[index] = { color: '', size: '' };
      }
      
      if (field === 'color') {
         currentItems[index] = { color: value, size: '' };
      } else {
         currentItems[index] = { ...currentItems[index], [field]: value };
      }
      
      return { ...prev, [itemId]: currentItems };
    });
  };

  const getAvailableQuantity = (itemId: string, color: string, size: string, currentIndex: number) => {
    const item = cart.find(i => i.id === itemId);
    if (!item || !item.variants) return 0;

    const variant = item.variants.find(v => v.color === color && v.size === size);
    const totalInInventory = variant ? variant.quantity : 0;

    const currentSelections = itemSelections[itemId] || [];
    let usedQuantity = 0;
    
    currentSelections.forEach((sel, idx) => {
      if (idx !== currentIndex && sel && sel.color === color && sel.size === size) {
        usedQuantity += 1;
      }
    });

    return totalInInventory - usedQuantity;
  };

  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // 3. تأكيد الطلب (متاح للجميع دلوقتي)
  async function onSubmit(data:FormValues) {
    const orderItems = cart.map((item) => ({
      product_id: item.product_id || item.id, // item.id للضيوف، product_id للمسجلين
      product_name: item.name,
      quantity: item.quantity,
      price_per_unit: item.price,
      subtotal: item.price * item.quantity,
      details: itemSelections[item.id] || [], 
      image: item.images[0]
    }));

    const isSelectionComplete = orderItems.every(
      item => item.details.length === item.quantity && 
              item.details.every(d => d.color !== '' && d.size !== '')
    );

    if (!isSelectionComplete) {
      toast.error("برجاء اختيار اللون والمقاس لكل قطعة في المنتجات المطلوبة");
      return;
    }
    
    const finalOrder = {
      customer_info: {
        name: data.fullname,
        phone: Number(data.number),
        phone2: Number(data.number2),
        address: data.address,
        details: data.details
      },
      items: orderItems,
      total_amount: totalPrice, 
      order_date: new Date().toISOString()
    };

    try {
      setLoading(true);
      // لو العميل ضيف هنبعت user.id بـ null (تأكد إن دالة AddOrders عندك بتقبل ده)
      const userIdToPass = user ? user.id : null;
      const response = await AddOrders(finalOrder, userIdToPass, "Orders_Waiting");
      
      if (response.success) {
        toast.success("تم تأكيد طلبك بنجاح!");
        
        // تفريغ السلة بناءً على نوع العميل
        if (user) {
          await clearUserCart(); 
        } else {
          localStorage.removeItem("guestCart");
        }
        
        // تصفير عداد الناف بار
        setInitialCounts(0, wishlistCount); 
        router.push('/');
      } else {
        toast.error("حدث خطأ أثناء إرسال الطلب: " + response.error);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("حدث خطأ غير متوقع في الاتصال بالسيرفر.");
    } finally {
      setLoading(false);
    }
  }

  // 4. حذف منتج من السلة 
  const handleDelete = async (itemId: string) => {
    const previousCart = [...cart];
    const newCart = cart.filter(item => item.id !== itemId);
    
    setCart(newCart);

    if (user) {
      const result = await removeFromCart(itemId);
      if (!result.success) {
        setCart(previousCart);
        toast.error("حدث خطأ أثناء محاولة حذف المنتج");
        return;
      }
    } else {
      // لو ضيف، نحذفه من اللوكال ستورج
      localStorage.setItem("guestCart", JSON.stringify(newCart));
    }
    
    // تحديث العداد في الناف بار فوراً
    setInitialCounts(newCart.length, wishlistCount);
  };

  return (
    <>
      <div className='container w-[90%] mx-auto  '>
        <h3 className='text-center font-bold mb-8 text-[29px] Playpen '>Your Cart</h3>
        
        <div className=' border border-[#B8C2CC] rounded-2xl shadow-md overflow-hidden'>
          <Table className='bg-white Playpen text-[15px]'>
            <TableHeader className='bg-[#F0F3F6] '>
              <TableRow >
                <TableHead className="text-center"></TableHead>
                <TableHead className="text-center">السعر</TableHead>
                <TableHead colSpan={2} className="text-center ">الألوان والمقاسات (لكل قطعة)</TableHead>
                <TableHead className="text-center">الحاله</TableHead>
                <TableHead className="text-center">الكميه</TableHead>
                <TableHead className="text-center ">أسم المنتج</TableHead>
                <TableHead className="text-center">المنتج</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-5 font-bold text-black">
                    السلة فارغة 🛒 .. برجاء إضافة منتجات أولاً!
                  </TableCell>
                </TableRow>
              ) : (
                cart.map((item) => {
                   const uniqueColors = Array.from(new Set(item.variants?.map(v => v.color) || []));

                   return (
                  <TableRow key={item?.id} className='font-medium'>
                    <TableCell className="text-center">
                      <button onClick={() => handleDelete(item.id)} type='button' className='bg-red-500 p-2 rounded-full text-white cursor-pointer hover:bg-red-600 transition-all duration-300 '>
                        <X size={16} />
                      </button>
                    </TableCell>
                    
                    <TableCell className="text-center ">{item.price * item.quantity}</TableCell>
                    
                    <TableCell colSpan={2} className="text-center">
                      <div className='flex flex-col gap-2 px-1'>
                        {Array.from({ length: item.quantity }).map((_, index) => {
                          const currentColor = itemSelections[item.id]?.[index]?.color || "";
                          
                          const availableSizesForColor = item.variants
                             ?.filter(v => v.color === currentColor)
                             .map(v => v.size) || [];
                             
                          return (
                          <div key={index} className='flex items-center justify-between gap-2 bg-[#f8f9fa] p-2 rounded-md border border-[#e2e8f0]'>
                            <span className='text-[11px] font-bold text-gray-500 whitespace-nowrap'>قطعة {index + 1}</span>
                            
                            <select 
                              value={itemSelections[item.id]?.[index]?.size || ""}
                              onChange={(e) => handleSelectionChange(item.id, index, 'size', e.target.value)}
                              disabled={!currentColor} 
                              className="text-[12px] border rounded-md p-1 outline-none focus:ring-1 focus:ring-[#000000] w-[45%] text-center cursor-pointer disabled:opacity-50"
                            >
                              
                              <option value="" disabled>المقاس</option>
                              {availableSizesForColor.map(s => {
                                const remaining = getAvailableQuantity(item.id, currentColor, s as string, index);
                                const isDisabled = remaining <= 0;
                                
                                return (
                                  <option 
                                    key={s as string} 
                                    value={s as string} 
                                    disabled={isDisabled}
                                  >
                                    {s as string} {isDisabled ? '(نفدت الكمية)' : ''}
                                  </option>
                                );
                              })}
                            </select>
                            <select 
                              value={currentColor}
                              onChange={(e) => handleSelectionChange(item.id, index, 'color', e.target.value)}
                              className="text-[12px] border rounded-md p-1 outline-none focus:ring-1 focus:ring-[#000000] w-[45%] text-center cursor-pointer"
                            >
                              <option value="" disabled>اللون</option>
                              {uniqueColors.map(c => {
                                return <option key={c as string} value={c as string}>{c as string}</option>
                              })}
                            </select>
                          </div>
                        )})}
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      {item.Products?.status === 'متاح' || !user ? (
                        <span className='bg-green-100 flex w-fit py-1 px-2 text-green-600 rounded-3xl mx-auto items-center gap-2 justify-center'><BadgeCheck size={18}/>متاح</span>
                      ) : (
                        <span className='bg-red-100 flex w-fit py-1 px-2 text-red-600 rounded-3xl mx-auto items-center gap-2 justify-center'><BadgeX size={18}/>غير متاح</span>
                      )}
                    </TableCell> 
                    
                    <TableCell className="text-center">
                      <div className='flex items-center justify-center gap-2'>
                        <button 
                          onClick={() => updateQuantity(item.id, 'plus')}
                          className='bg-green-200 text-green-700 cursor-pointer font-bold text-[18px] w-[30px] h-[30px] rounded-md hover:bg-green-300 transition-all'
                        >+</button> 
                        <span className='w-[20px]'>{item?.quantity}</span> 
                        <button 
                          onClick={() => updateQuantity(item.id, 'minus')}
                          disabled={item.quantity <= 1}
                          className={`font-bold text-[18px] w-[30px] h-[30px] rounded-md transition-all 
                            ${item.quantity <= 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-red-200 text-red-700 cursor-pointer hover:bg-red-300'}`}
                        >-</button>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-center">{item?.name}</TableCell>
                    <TableCell className="text-center"><img src={item?.images[0]} className='w-[60px] h-[60px] object-cover rounded mx-auto shadow-sm' alt="" /></TableCell>
                    </TableRow>
                );
              })
            )}
            </TableBody>
            <TableFooter className='bg-[#F0F3F6] p-1 '>
              <TableRow>
                <TableCell className="text-center"> </TableCell>
                <TableCell className="text-center font-bold text-[18px] text-[#000000]">{totalPrice} EGP</TableCell>
                <TableCell colSpan={5}></TableCell>
                <TableCell className="text-center font-bold text-[16px] text-gray-700">: الإجمالي</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={cart.length === 0} className='bg-[#000] border-2 text-[15px] font-medium border-black Playpen cursor-pointer hover:bg-transparent hover:text-black duration-500 mt-9 w-[50%] mx-auto block text-white rounded-2xl disabled:opacity-50' variant="outline">أرسال الطلبات</Button>
          </AlertDialogTrigger>
          <AlertDialogContent className='Playpen max-h-[90vh] overflow-y-auto'>
            <AlertDialogTitle className='mb-3 text-center'>تأكيد الطلب</AlertDialogTitle>
            {loading ? <Loader2/> :
              <form onSubmit={handleSubmit(onSubmit)}>
                <Accordion type="single" collapsible defaultValue="shipping" className="max-w-lg ">
                  
                  <AccordionItem value="shipping">
                    <AccordionTrigger>بيانات التواصل</AccordionTrigger>
                    <AccordionContent className='flex flex-col gap-2'>
                      <Input {...register("fullname", { required: "من فضلك ادخل الاسم كامل" })} placeholder="ادخل اسمك" type="text" className='w-full focus-visible:border-2 focus-visible:border-black text-end border-[#6d6d6d]' />
                      {errors.fullname && <p className='text-red-500 text-sm mt-1 text-end'>{errors.fullname.message}</p>}
                      
                      <Input {...register("number", { required: "من فضلك ادخل رقم الهاتف" })} placeholder="ادخل رقم الهاتف" type="number" className='w-full focus-visible:border-2 focus-visible:border-black text-end border-[#6d6d6d]' />
                      {errors.number && <p className='text-red-500 text-sm mt-1 text-end'>{errors.number.message}</p>}

                      <Input {...register("number2")} placeholder="ادخل رقم هاتف اخر (ان وجد)" type="number" className='w-full focus-visible:border-2 focus-visible:border-black text-end border-[#6d6d6d]' />
                      
                      <Input {...register("address", { required: "من فضلك ادخل العنوان" })} placeholder="ادخل العنوان" type="text" className='w-full focus-visible:border-2 focus-visible:border-black text-end border-[#6d6d6d]' />
                      {errors.address && <p className='text-red-500 text-sm mt-1 text-end'>{errors.address.message}</p>}

                      <Textarea {...register("details")} placeholder="تفاصيل اضافيه (اختياري)" className='w-full focus-visible:border-2 focus-visible:border-black text-end border-[#6d6d6d]' />
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="returns">
                    <AccordionTrigger>مراجعة المنتجات المختارة</AccordionTrigger>
                    <AccordionContent>
                      <div className='flex flex-col gap-4 max-h-[300px] overflow-y-auto px-1'>
                        {cart.map((item) => {
                          const selections = itemSelections[item.id] || [];
                          
                          return (
                            <div key={item.id} className='bg-[#f8f9fa] border border-[#e2e8f0] rounded-lg p-3 flex flex-col gap-2'>
                              <div className='flex justify-between items-center border-b border-gray-200 pb-2'>
                                <span className='font-bold text-[15px] text-[#000000]'>{item.price * item.quantity} EGP</span>
                                <div className='flex items-center gap-3 text-right'>
                                  <div>
                                    <p className='font-bold text-[14px]'>{item.name}</p>
                                    <p className='text-[12px] text-gray-500'>الكمية: {item.quantity}</p>
                                  </div>
                                  <img src={item.images[0]} className='w-[45px] h-[45px] object-cover rounded shadow-sm' alt="" />
                                </div>
                              </div>
                              
                              <div className='flex flex-col gap-1.5 mt-1'>
                                {Array.from({ length: item.quantity }).map((_, index) => {
                                  const currentSelection = selections[index];
                                  return (
                                    <div key={index} className='flex justify-between items-center text-[12px] bg-white p-1.5 rounded border border-gray-100'>
                                      <span className='font-medium text-gray-700'>
                                        {currentSelection?.size ? currentSelection.size : "لم يحدد المقاس"} 
                                        {" - "} 
                                        {currentSelection?.color ? currentSelection.color : "لم يحدد اللون"}
                                      </span>
                                      <span className='text-gray-400 text-[10px] font-bold'>قطعة {index + 1}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className='mt-4 pt-3 border-t-2 border-black flex justify-between items-center px-1'>
                        <span className=' font-bold text-[18px] text-[#000000]'>{totalPrice} EGP</span>
                        <span className='font-bold text-[16px]'>: الإجمالي المطلوب</span>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <button type='submit' className='font-normal w-full mb-3 mt-3 p-[7px] rounded-md cursor-pointer border border-black hover:bg-white duration-400 hover:text-black bg-black text-white'>تأكيد الطلب</button>
                <AlertDialogCancel className='font-medium w-full cursor-pointer'>إلغاء</AlertDialogCancel>
              </form>
            }
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  )
}