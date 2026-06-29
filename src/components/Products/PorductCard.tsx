"use client"

import { AddCart, getCart } from '@/Action/Cart'
import { AddToWishlist, getWishlist } from '@/Action/Wishlist'
import { supabase } from '@/lib/supabaseClient'
import { CartMod } from '@/Types/Cartmod'
import { Productmod } from '@/Types/Productmod'
import { Heart, ShoppingBag, View } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';
import Loader3 from '../Loader3/Loader3'
import { useStore } from '@/useStore'

import { useForm } from "react-hook-form";
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function PorductCard({prod, initialIsFavorite = false} : {prod:Productmod, initialIsFavorite?: boolean}) {
  const { incrementCart, incrementWishlist } = useStore();
  const [loading, setLoading] = useState(false)
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  
  // States للكمية والاختيارات الخاصة بالشراء السريع
  const [quantity, setQuantity] = useState(1);
  const [selections, setSelections] = useState<{ color: string, size: string }[]>([{ color: '', size: '' }]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  type FormValues = {
    fullname: string;
    number: string;
    number2?: string;
    address: string;
    details?: string;
  };

  // استخراج الألوان المتاحة للمنتج
  const uniqueColors = Array.from(new Set(prod.variants?.map(v => v.color) || []));

  // تحديث الكمية وإضافة/حذف خانات الاختيار
  const updateQuantity = (action: 'plus' | 'minus') => {
    if (action === 'plus') {
      setQuantity(prev => prev + 1);
      setSelections(prev => [...prev, { color: '', size: '' }]);
    } else if (action === 'minus' && quantity > 1) {
      setQuantity(prev => prev - 1);
      setSelections(prev => prev.slice(0, prev.length - 1));
    }
  };

  // تحديث اللون أو المقاس للقطعة
  const handleSelectionChange = (index: number, field: 'color' | 'size', value: string) => {
    setSelections(prev => {
      const newSelections = [...prev];
      if (field === 'color') {
        newSelections[index] = { color: value, size: '' }; // تصفير المقاس عند تغيير اللون
      } else {
        newSelections[index] = { ...newSelections[index], [field]: value };
      }
      return newSelections;
    });
  };
 
  async function onDirectSubmit(data:FormValues) {
    // التحقق من اختيار اللون والمقاس لكل القطع
    const isSelectionComplete = selections.length === quantity && 
                                selections.every(s => s.color !== '' && s.size !== '');

    if (!isSelectionComplete) {
      toast.error("برجاء اختيار اللون والمقاس لكل قطعة في المنتج المطلوب");
      return;
    }

    try {
      setLoading(true);
      
      const finalOrder = {
        customer_info: {
          name: data.fullname,
          phone: Number(data.number),
          phone2: Number(data.number2),
          address: data.address,
          details: data.details
        },
        items: [{
          product_id: prod.id,
          product_name: prod.name,
          quantity: quantity, 
          price_per_unit: prod.price,
          subtotal: prod.price * quantity,
          details: selections, // إرسال الاختيارات هنا
          image: prod.images[0]
        }],
        total_amount: prod.price * quantity,
        order_date: new Date().toISOString()
      };

      // هنا يمكنك إرسال finalOrder للباك اند الخاص بك
      console.log("Order Data:", finalOrder);
      toast.success("تم تأكيد طلبك بنجاح!");
      
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("حدث خطأ غير متوقع في الاتصال بالسيرفر.");
    } finally {
      setLoading(false);
    }
  }

  // دوال الإضافة للسلة والمفضلة كما هي...
  async function handleAddToCart() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const currentCart = await getCart();
        const isItemInCart = currentCart.find((item: CartMod) => String(item.product_id) === String(prod.id));

        if (isItemInCart) {
          toast.error("المنتج موجود بالفعل في السلة");
          return; 
        }
        
        const response = await AddCart(prod, user.id);
        
        if (response.success) {
          toast.success("تمت إضافة المنتج للسلة بنجاح!");
          incrementCart();
        } else {
          toast.error("حصلت مشكلة: " + response.error);
        }
      } else {
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
       
        const isItemInCart = guestCart.find((item: Productmod) => String(item.id) === String(prod.id));

        if (isItemInCart) {
          toast.error("المنتج موجود بالفعل في السلة");
          return;
        }

        guestCart.push({ ...prod, quantity: 1 });
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        
        toast.success("تمت إضافة المنتج للسلة بنجاح!");
        incrementCart(); 
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); 
    }
  }

  async function handleAddToWishlist() {
    setLoading(true); 
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        if (isFavorite) {
          toast.error("المنتج موجود بالفعل في المفضلة");
          return; 
        }
        
        const response = await AddToWishlist(prod, user.id);
        
        if (response.success) {
          toast.success("تمت إضافة المنتج للمفضلة بنجاح!");
          setIsFavorite(true); 
          incrementWishlist();
        } else {
          toast.error("حصلت مشكلة: " + response.error);
        }
      } else {
        const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
        const isItemInWishlist = guestWishlist.find((item: Productmod) => String(item.id) === String(prod.id));

        if (isItemInWishlist || isFavorite) {
          toast.error("المنتج موجود بالفعل في المفضلة");
          return;
        }

        guestWishlist.push(prod);
        localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));
        
        toast.success("تمت إضافة المنتج للمفضلة بنجاح!");
        setIsFavorite(true); 
        incrementWishlist(); 
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); 
    }
  }
  
  return (
    <>
      <div className="w-full h-full flex flex-col">
        <div className="flex flex-col flex-grow h-full">
          <div 
            className="flex flex-col flex-grow cursor-pointer group"
            onClick={() => router.push(`/product/${prod.id}`)}
          >
            <div className="relative w-full aspect-square overflow-hidden rounded-xl z-10">
              <img 
                className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105' 
                src={prod.images[0]} 
                alt={prod.name} 
              />
            </div>
            <div className="flex justify-between mt-4 px-2">
              <p className='acme text-center text-[14px] md:text-[22px] mb-3'>
                {prod.price} EGP
              </p>
              <h3 className='text-center text-[14px] md:text-[20px] mb-2 Marhey truncate' title={prod.name}>
                {prod.name}
              </h3>
            </div>
          </div>

          <div className='grid grid-cols-12 gap-2 justify-center lg:mx-auto items-center mt-auto mb-2'>
            {loading ? (
              <Loader3 />
            ) : (
              <>
                <AlertDialog>
                  <AlertDialogTrigger className='col-span-12 lg:col-span-8' asChild>
                    <Button 
                      onClick={(e) => e.stopPropagation()} 
                      className='bg-[#000] border-2 text-[12px] lg:text-[15px] font-medium border-black Playpen cursor-pointer w-full hover:bg-transparent hover:text-black transition-colors duration-500 mx-auto block text-white rounded-2xl' 
                      variant="outline"
                    >
                      شراء الآن
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent 
                    onClick={(e) => e.stopPropagation()} 
                    className='Playpen max-h-[90vh] overflow-y-auto'
                  >
                    <AlertDialogTitle className='mb-3 text-center'>تأكيد الطلب السريع</AlertDialogTitle>
                    {loading ? <Loader2 className="mx-auto animate-spin my-4" /> :
                      <form onSubmit={handleSubmit(onDirectSubmit)}>
                        <Accordion type="single" collapsible defaultValue="shipping" className="max-w-lg ">
                          
                          <AccordionItem value="shipping">
                            <AccordionTrigger>بيانات التواصل</AccordionTrigger>
                            <AccordionContent className='flex flex-col gap-2'>
                              <Input {...register("fullname", { required: "من فضلك ادخل الاسم كامل" })} placeholder="ادخل اسمك" type="text" className='w-full focus-visible:border-2 focus-visible:border-black text-end border-[#6d6d6d]' />
                              {errors.fullname && <p className='text-red-500 text-sm mt-1 text-end'>{errors.fullname.message as string}</p>}
                              
                              <Input {...register("number", { required: "من فضلك ادخل رقم الهاتف" })} placeholder="ادخل رقم الهاتف" type="number" className='w-full focus-visible:border-2 focus-visible:border-black text-end border-[#6d6d6d]' />
                              {errors.number && <p className='text-red-500 text-sm mt-1 text-end'>{errors.number.message as string}</p>}

                              <Input {...register("number2")} placeholder="ادخل رقم هاتف اخر (ان وجد)" type="number" className='w-full focus-visible:border-2 focus-visible:border-black text-end border-[#6d6d6d]' />
                              
                              <Input {...register("address", { required: "من فضلك ادخل العنوان" })} placeholder="ادخل العنوان" type="text" className='w-full focus-visible:border-2 focus-visible:border-black text-end border-[#6d6d6d]' />
                              {errors.address && <p className='text-red-500 text-sm mt-1 text-end'>{errors.address.message as string}</p>}

                              <Textarea {...register("details")} placeholder="ملاحظات إضافية" className='w-full focus-visible:border-2 focus-visible:border-black text-end border-[#6d6d6d]' />
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="returns">
                            <AccordionTrigger>تفاصيل المنتج و اختيار المقاسات</AccordionTrigger>
                            <AccordionContent>
                              <div className='bg-[#f8f9fa] border border-[#e2e8f0] rounded-lg p-3 flex flex-col gap-2'>
                                <div className='flex justify-between items-center border-b border-gray-200 pb-2'>
                                  <span className='font-bold text-[15px] text-[#000000]'>{prod.price * quantity} EGP</span>
                                  <div className='flex items-center gap-3 text-right'>
                                    <div>
                                      <p className='font-bold text-[14px]'>{prod.name}</p>
                                      <div className='flex items-center justify-end gap-2 mt-1'>
                                        <button type="button" onClick={() => updateQuantity('plus')} className='bg-gray-200 text-gray-700 font-bold text-[14px] w-[22px] h-[22px] rounded'>+</button>
                                        <span className='text-[12px] font-bold'>{quantity}</span>
                                        <button type="button" onClick={() => updateQuantity('minus')} disabled={quantity <= 1} className='bg-gray-200 text-gray-700 font-bold text-[14px] w-[22px] h-[22px] rounded disabled:opacity-50'>-</button>
                                      </div>
                                    </div>
                                    <img src={prod.images[0]} className='w-[45px] h-[45px] object-cover rounded shadow-sm' alt={prod.name} />
                                  </div>
                                </div>

                                
                                <div className='flex flex-col gap-2 px-1 mt-2'>
                                  {Array.from({ length: quantity }).map((_, index) => {
                                    const currentColor = selections[index]?.color || "";
                                    const availableSizesForColor = prod.variants
                                      ?.filter(v => v.color === currentColor)
                                      .map(v => v.size) || [];

                                    return (
                                      <div key={index} className='flex items-center justify-between gap-2 bg-white p-2 rounded-md border border-[#e2e8f0]'>
                                        <span className='text-[11px] font-bold text-gray-500 whitespace-nowrap'>قطعة {index + 1}</span>
                                        <select 
                                          value={selections[index]?.size || ""}
                                          onChange={(e) => handleSelectionChange(index, 'size', e.target.value)}
                                          disabled={!currentColor}
                                          className="text-[12px] border rounded-md p-1 outline-none focus:ring-1 focus:ring-[#000000] w-[45%] text-center cursor-pointer disabled:opacity-50"
                                        >
                                          <option value="" disabled>المقاس</option>
                                          {availableSizesForColor.map(s => (
                                            <option key={s as string} value={s as string}>{s as string}</option>
                                          ))}
                                        </select>
                                        <select 
                                          value={currentColor}
                                          onChange={(e) => handleSelectionChange(index, 'color', e.target.value)}
                                          className="text-[12px] border rounded-md p-1 outline-none focus:ring-1 focus:ring-[#000000] w-[45%] text-center cursor-pointer"
                                        >
                                          <option value="" disabled>اللون</option>
                                          {uniqueColors.map(c => (
                                            <option key={c as string} value={c as string}>{c as string}</option>
                                          ))}
                                        </select>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                              
                              <div className='mt-4 pt-3 border-t-2 border-black flex justify-between items-center px-1'>
                                <span className='font-bold text-[18px] text-[#000000]'>{prod.price * quantity} EGP</span>
                                <span className='font-bold text-[16px]'>: الإجمالي المطلوب</span>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        <button type='submit' className='font-normal w-full mb-3 mt-4 p-[7px] rounded-md cursor-pointer border border-black hover:bg-white transition-colors duration-400 hover:text-black bg-black text-white'>
                          تأكيد الطلب
                        </button>
                        <AlertDialogCancel className='font-medium w-full cursor-pointer hover:bg-gray-100'>إلغاء</AlertDialogCancel>
                      </form>
                    }
                  </AlertDialogContent>
                </AlertDialog>

                <div className='grid grid-cols-12 gap-3 lg:p-2 justify-center lg:flex rounded-2xl w-full col-span-12 lg:col-span-4 lg:bg-gray-300'>
                  <button onClick={handleAddToCart} className='cursor-pointer rounded-xl lg:rounded-none py-[2px] lg:py-0 col-span-6 flex justify-center lg:block bg-gray-300 lg:bg-transparent '> 
                    <ShoppingBag className="w-5 h-5 md:w-[25px] md:h-[25px] transition-all duration-300 scale-100 hover:scale-110 " />
                  </button>
                  <button onClick={handleAddToWishlist} className='cursor-pointer rounded-xl lg:rounded-none py-[2px] lg:py-0 flex justify-center lg:block bg-gray-300 lg:bg-transparent col-span-6'>
                    <Heart 
                      className={`w-5 h-5 md:w-[25px] md:h-[25px] transition-all duration-300 ${isFavorite ? 'scale-110' : 'hover:scale-110'}`} 
                      fill={isFavorite ? "red" : "none"}
                      color={isFavorite ? "red" : "currentColor"} 
                    />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}