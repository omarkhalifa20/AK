"use client"
import { getProductById } from '@/Action/GetProducts';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { toast } from 'react-hot-toast';

import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';
import { Productmod } from '@/Types/Productmod'; 
import { Heart, ShoppingCart } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { AddCart, getCart } from '@/Action/Cart';
import { AddToWishlist, getWishlist } from '@/Action/Wishlist';
import { CartMod } from '@/Types/Cartmod';
import { Wishlistmod } from '@/Types/Wishlistmod';
import { useStore } from '@/useStore';

export default function ProductDet() {
  const { incrementCart, incrementWishlist } = useStore();
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<Productmod | null>(null);
  const productId = params.id as string
  
  useEffect(() => {
    async function GetProduct() {
      if (productId) {
        const data = await getProductById(productId);
        setProduct(data);
      }
    }
    GetProduct();
  }, [productId]); 

  // --- استخراج الألوان والمقاسات المتاحة للعرض فقط ---
  const availableColors = Array.from(new Set(product?.variants?.map(v => v.color) || []));
  const availableSizes = Array.from(new Set(product?.variants?.map(v => v.size) || []));

  // --- دالة الإضافة للسلة (تدعم المسجلين والضيوف) ---
  async function handleAddToCart() {
    if (!product) {
      toast.error("المنتج غير موجود!");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // -- لو العميل مسجل دخول --
      const currentCart = await getCart();
      const isItemInCart = currentCart.find((item: CartMod) => String(item.product_id) === String(product.id));
    
      if (isItemInCart) {
        toast.error("المنتج موجود بالفعل في السلة (يمكنك تحديد التفاصيل من داخل السلة)");
        return; 
      }
      
      const response = await AddCart(product, user.id);
      
      if (response.success) {
        toast.success("تمت إضافة المنتج للسلة بنجاح!");
        incrementCart()
      } else {
        toast.error("حصلت مشكلة: " + response.error);
      }
    } else {
      // -- لو العميل ضيف (Guest) --
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
  }
  
  // --- دالة المفضلة (تدعم المسجلين والضيوف) ---
  async function handleAddToWishlist() {
    if (!product) {
      toast.error("المنتج غير موجود!");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
  
    if (user) {
      // -- لو العميل مسجل دخول --
      const currentWishlist = await getWishlist();
      const isItemInWishlist = currentWishlist.find((item: Wishlistmod) => String(item.product_id) === String(product.id));
    
      if (isItemInWishlist) {
        toast.error("المنتج موجود بالفعل في المفضله");
        return; 
      }
      
      const response = await AddToWishlist(product, user.id);
      
      if (response.success) {
        toast.success("تمت إضافة المنتج للمفضله بنجاح!");
        incrementWishlist()
      } else {
        toast.error("حصلت مشكلة: " + response.error);
      }
    } else {
      // -- لو العميل ضيف (Guest) --
      const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
      const isItemInWishlist = guestWishlist.find((item: Productmod) => String(item.id) === String(product.id));

      if (isItemInWishlist) {
        toast.error("المنتج موجود بالفعل في المفضله");
        return;
      }

      guestWishlist.push(product);
      localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));
      
      toast.success("تمت إضافة المنتج للمفضله بنجاح!");
      incrementWishlist(); 
    }
  }
  
  return (
    <>
    <div className='container mx-auto w-[90%] min-h-screen flex items-center justify-center'>
     <div className=' p-6 mt-5 grid grid-cols-12'>
      
      {/* قسم الصور */}
      <div className='col-span-4 flex items-center'>
        <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
          {product && Array.isArray(product?.images) ? (
            product?.images.map((img: string, index: number) => (
              <SwiperSlide key={index} className="image-wrapper">
                <img src={img} alt={`Product image ${index + 1}`} />
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide> {product?.images?.[0]} </SwiperSlide>
          )}
        </Swiper>
      </div>

      {/* قسم التفاصيل */}
      <div className='col-span-8 px-5 text-center'>
        
        {/* المجموعات / التصنيفات */}
        <div className='flex Orbitron mb-7 text-[14px] font-medium items-center justify-center gap-9'>
          {product && Array.isArray(product?.category) ? (
            product?.category.map((cat: string, index: number) => (
              <p key={index} className='py-[1px] bg-[#ffffff33] capitalize px-5 rounded-3xl border border-black'>{cat}</p>
            ))
          ) : (
            <p className='py-[1px] px-5 rounded-3xl capitalize border border-black'>{product?.category?.[0]}</p>
          )}
        </div>

        {/* الاسم والسعر */}
        <div className='Playpen px-5 flex flex-col gap-5 mb-6 items-center justify-center'>
          <h1 className='text-[32px] font-bold '>{product?.name}</h1>
          <p className='text-xl font-bold '>{product?.price} EGP</p>
        </div>
        
        {/* === عرض الألوان والمقاسات المتاحة (للعرض فقط) === */}
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
        {/* ================================================= */}

        {/* أزرار الإضافة */}
        <div className='flex flex-col items-end'>
          <div className='grid grid-cols-12 gap-4 w-full mt-2'>
            <button 
              onClick={handleAddToCart} 
              className='col-span-11 Orbitron font-medium bg-black py-3 hover:bg-transparent duration-300 cursor-pointer hover:text-black border-2 border-black rounded-[30px] text-white flex justify-center items-center gap-2'
            >
               Add To Cart <ShoppingCart size={20} />
            </button>
            <button 
              onClick={handleAddToWishlist} 
              className='col-span-1 flex items-center justify-center mx-auto border duration-300 cursor-pointer hover:bg-black hover:text-white border-[#ababab] rounded-full px-3 w-full h-full'
            >
              <Heart />
            </button>
          </div>
          <p className='text-gray-500 text-[13px] Playpen mt-3 text-right w-full'>* يمكنك تحديد المقاس واللون المناسب لك من داخل سلة المشتريات.</p>
        </div>

        {/* الوصف */}
        <div className='border Playpen py-3 px-5 rounded-2xl mt-5 border-[#ababab]'>
         <h3 className='mb-6 text-end font-bold text-[18px]'>: وصف المنتج</h3>
         <p className='text-end whitespace-pre-wrap'>{product?.description}</p>
        </div>
        
      </div>
      
     </div>
    </div>
    </>
  )
}