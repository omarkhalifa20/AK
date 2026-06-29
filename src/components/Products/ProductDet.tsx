"use client"
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { toast } from 'react-hot-toast';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

import { getProductById } from '@/Action/GetProducts';
import { Productmod } from '@/Types/Productmod';
import { supabase } from '@/lib/supabaseClient';
import { AddCart, getCart } from '@/Action/Cart';
import { AddToWishlist, getWishlist } from '@/Action/Wishlist';
import { CartMod } from '@/Types/Cartmod';
import { Wishlistmod } from '@/Types/Wishlistmod';
import { useStore } from '@/useStore';

import { Heart, ShoppingBag, Loader2 } from 'lucide-react';
import { useForm } from "react-hook-form";

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
import Loader3 from '../Loader3/Loader3'; 

export default function ProductDet() {
  const { incrementCart, incrementWishlist } = useStore();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Productmod | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const [quantity, setQuantity] = useState(1);
  const [selections, setSelections] = useState<{ color: string, size: string }[]>([{ color: '', size: '' }]);

  type FormValues = {
    fullname: string;
    number: string;
    number2?: string;
    address: string;
    details?: string;
  };
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  useEffect(() => {
    async function GetProduct() {
      if (productId) {
        const data = await getProductById(productId);
        setProduct(data);
      }
    }
    GetProduct();
  }, [productId]);

  const availableColors = Array.from(new Set(product?.variants?.map(v => v.color) || []));
  const availableSizes = Array.from(new Set(product?.variants?.map(v => v.size) || []));

  const updateQuantity = (action: 'plus' | 'minus') => {
    if (action === 'plus') {
      setQuantity(prev => prev + 1);
      setSelections(prev => [...prev, { color: '', size: '' }]);
    } else if (action === 'minus' && quantity > 1) {
      setQuantity(prev => prev - 1);
      setSelections(prev => prev.slice(0, prev.length - 1));
    }
  };

  const handleSelectionChange = (index: number, field: 'color' | 'size', value: string) => {
    setSelections(prev => {
      const newSelections = [...prev];
      if (field === 'color') {
        newSelections[index] = { color: value, size: '' };
      } else {
        newSelections[index] = { ...newSelections[index], [field]: value };
      }
      return newSelections;
    });
  };

  async function onDirectSubmit(data: FormValues) {
    if (!product) return;

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
          product_id: product.id,
          product_name: product.name,
          quantity: quantity, 
          price_per_unit: product.price,
          subtotal: product.price * quantity,
          details: selections,
          image: product.images[0]
        }],
        total_amount: product.price * quantity,
        order_date: new Date().toISOString()
      };

      console.log("Order Data:", finalOrder);
      toast.success("تم تأكيد طلبك بنجاح!");
      
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("حدث خطأ غير متوقع في الاتصال بالسيرفر.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToCart() {
    if (!product) {
      toast.error("المنتج غير موجود!");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const currentCart = await getCart();
        const isItemInCart = currentCart.find((item: CartMod) => String(item.product_id) === String(product.id));
      
        if (isItemInCart) {
          toast.error("المنتج موجود بالفعل في السلة (يمكنك تحديد التفاصيل من داخل السلة)");
          return; 
        }
        
        const response = await AddCart(product, user.id);
        if (response.success) {
          toast.success("تمت إضافة المنتج للسلة بنجاح!");
          incrementCart();
        } else {
          toast.error("حصلت مشكلة: " + response.error);
        }
      } else {
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        const isItemInCart = guestCart.find((item: Productmod) => String(item.id) === String(product.id));

        if (isItemInCart) {
          toast.error("المنتج موجود بالفعل في السلة (يمكنك تحديد التفاصيل من داخل السلة)");
          return;
        }

        guestCart.push({ ...product, quantity: 1 });
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
    if (!product) {
      toast.error("المنتج غير موجود!");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const currentWishlist = await getWishlist();
        const isItemInWishlist = currentWishlist.find((item: Wishlistmod) => String(item.product_id) === String(product.id));
      
        if (isItemInWishlist) {
          toast.error("المنتج موجود بالفعل في المفضلة");
          return; 
        }
        
        const response = await AddToWishlist(product, user.id);
        if (response.success) {
          toast.success("تمت إضافة المنتج للمفضلة بنجاح!");
          setIsFavorite(true);
          incrementWishlist();
        } else {
          toast.error("حصلت مشكلة: " + response.error);
        }
      } else {
        const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
        const isItemInWishlist = guestWishlist.find((item: Productmod) => String(item.id) === String(product.id));

        if (isItemInWishlist || isFavorite) {
          toast.error("المنتج موجود بالفعل في المفضلة");
          return;
        }

        guestWishlist.push(product);
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
    <div className='container mx-auto w-[90%] min-h-screen pt-15 lg:pt-0 flex items-center justify-center'>
     <div className='lg:p-6 mt-5 grid grid-cols-12 w-full gap-5'>
      
      <div className='col-span-12 lg:col-span-4 flex items-center'>
        <Swiper navigation={true} modules={[Navigation]} className="mySwiper w-full">
          {product && Array.isArray(product?.images) ? (
            product?.images.map((img: string, index: number) => (
              <SwiperSlide key={index} className="image-wrapper">
                <img className='w-full rounded-xl' src={img} alt={`Product image ${index + 1}`} />
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide className='w-full rounded-xl'> {product?.images?.[0]} </SwiperSlide>
          )}
        </Swiper>
      </div>

      <div className='col-span-12 lg:col-span-8 lg:px-5 flex flex-col text-center'>
        
        <div className='flex Orbitron mb-7 text-[14px] font-medium items-center justify-center gap-1 lg:gap-9'>
          {product && Array.isArray(product?.category) ? (
            product?.category.map((cat: string, index: number) => (
              <p key={index} className='py-[1px] bg-[#ffffff33] capitalize px-5 rounded-3xl border border-black'>{cat}</p>
            ))
          ) : (
            <p className='py-[1px] px-5 rounded-3xl capitalize border border-black'>{product?.category?.[0]}</p>
          )}
        </div>

        <div className='Playpen px-5 flex flex-row-reverse lg:flex-col gap-5 lg:mb-6 items-center justify-between lg:justify-center'>
          <h1 className='text-[20px] lg:text-[32px] font-bold '>{product?.name}</h1>
          <p className='text-[20px] lg:text-[32px] font-bold '>{product?.price} EGP</p>
        </div>

        <div className='border lg:hidden block Playpen mb-4 py-3 px-5 rounded-2xl mt-5 border-[#ababab]'>
         <h3 className='mb-6 text-end font-bold lg:text-[18px]'>: وصف المنتج</h3>
         <p className='text-end whitespace-pre-wrap'>{product?.description}</p>
        </div>
       
        <div className='flex flex-col items-end gap-5 mb-6 w-full px-5'>
          {availableColors.length > 0 && (
            <div className='w-full'>
              <h3 className='font-semibold text-gray-600 mb-2 text-right'>: الألوان المتوفرة</h3>
              <div className='flex gap-2 justify-end flex-wrap'>
                {availableColors.map((color, index) => (
                  <span key={index} className='bg-transparent border border-black text-black px-6 py-1.5 rounded-full text-[15px] font-medium Playpen'>
                    {color as string}
                  </span>
                ))}
              </div>
            </div>
          )}

          {availableSizes.length > 0 && (
            <div className='w-full'>
              <h3 className='font-semibold text-gray-600 mb-2 text-right'>: المقاسات المتوفرة</h3>
              <div className='flex gap-2 justify-end flex-wrap'>
                {availableSizes.map((size, index) => (
                  <span key={index} className='bg-transparent border border-black text-black px-6 py-1.5 rounded-full text-sm font-bold Orbitron uppercase'>
                    {size as string}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* ========================================= */}
        {/* الثلاث زراير بنفس تصميم وشكل الـ ProductCard */}
        {/* ========================================= */}
        <div className='flex flex-col items-end px-5'>
          <div className='grid grid-cols-12 gap-2 justify-center lg:mx-auto items-center mt-auto w-full'>
            {loading ? (
              <div className="col-span-12 flex justify-center"><Loader3 /></div>
            ) : (
              <>
                <AlertDialog>
                  <AlertDialogTrigger className='col-span-12 lg:col-span-8' asChild>
                    <Button 
                      className='bg-[#000] border-2 text-[15px] font-medium border-black Playpen cursor-pointer w-full hover:bg-transparent hover:text-black transition-colors duration-500 mx-auto block text-white rounded-2xl ' 
                      variant="outline"
                    >
                      شراء الآن
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent className='Playpen max-h-[90vh] overflow-y-auto'>
                    <AlertDialogTitle className='mb-3 text-center'>تأكيد الطلب </AlertDialogTitle>
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
                                  <span className='font-bold text-[15px] text-[#000000]'>{(product?.price || 0) * quantity} EGP</span>
                                  <div className='flex items-center gap-3 text-right'>
                                    <div>
                                      <p className='font-bold text-[14px]'>{product?.name}</p>
                                      <div className='flex items-center justify-end gap-2 mt-1'>
                                        <button type="button" onClick={() => updateQuantity('plus')} className='bg-gray-200 text-gray-700 font-bold text-[14px] w-[22px] h-[22px] rounded'>+</button>
                                        <span className='text-[12px] font-bold'>{quantity}</span>
                                        <button type="button" onClick={() => updateQuantity('minus')} disabled={quantity <= 1} className='bg-gray-200 text-gray-700 font-bold text-[14px] w-[22px] h-[22px] rounded disabled:opacity-50'>-</button>
                                      </div>
                                    </div>
                                    {product?.images && <img src={product.images[0]} className='w-[45px] h-[45px] object-cover rounded shadow-sm' alt={product.name} />}
                                  </div>
                                </div>

                                <div className='flex flex-col gap-2 px-1 mt-2'>
                                  {Array.from({ length: quantity }).map((_, index) => {
                                    const currentColor = selections[index]?.color || "";
                                    const availableSizesForColor = product?.variants
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
                                          {availableColors.map(c => (
                                            <option key={c as string} value={c as string}>{c as string}</option>
                                          ))}
                                        </select>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                              
                              <div className='mt-4 pt-3 border-t-2 border-black flex justify-between items-center px-1'>
                                <span className='font-bold text-[18px] text-[#000000]'>{(product?.price || 0) * quantity} EGP</span>
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

                <div className='grid grid-cols-12 gap-3 lg:p-2 justify-center lg:flex rounded-2xl w-full col-span-12 lg:col-span-4 lg:bg-gray-300  lg:py-2'>
                  <button type="button" onClick={handleAddToCart} className='cursor-pointer rounded-xl lg:rounded-none py-[2px] lg:py-0 col-span-6 flex justify-center lg:block bg-gray-300 lg:bg-transparent w-full'> 
                    <ShoppingBag className="w-5 h-5 md:w-[25px] md:h-[25px] transition-all duration-300 scale-100 hover:scale-110 mx-auto" />
                  </button>
                  
                  <button type="button" onClick={handleAddToWishlist} className='cursor-pointer rounded-xl lg:rounded-none py-[2px] lg:py-0 flex justify-center lg:block bg-gray-300 lg:bg-transparent col-span-6 w-full'>
                    <Heart 
                      className={`w-5 h-5 md:w-[25px] md:h-[25px] transition-all duration-300 mx-auto ${isFavorite ? 'scale-110' : 'hover:scale-110'}`} 
                      fill={isFavorite ? "red" : "none"}
                      color={isFavorite ? "red" : "currentColor"} 
                    />
                  </button>
                </div>
              </>
            )}
          </div>
          <p className='text-gray-500 text-[13px] Playpen mt-3 text-right w-full'>* يمكنك تحديد المقاس واللون المناسب لك من داخل طلب الشراء.</p>
        </div>

        <div className='border hidden lg:block Playpen py-3 px-5 rounded-2xl mt-5 border-[#ababab]'>
         <h3 className='mb-6 text-end font-bold text-[18px]'>: وصف المنتج</h3>
         <p className='text-end whitespace-pre-wrap'>{product?.description}</p>
        </div>
        
      </div>
      
     </div>
    </div>
    </>
  )
}