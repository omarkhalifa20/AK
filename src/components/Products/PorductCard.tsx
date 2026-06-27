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

export default function PorductCard({prod, initialIsFavorite = false} : {prod:Productmod, initialIsFavorite?: boolean}) {
  const { incrementCart, incrementWishlist } = useStore();
  const [loading, setLoading] = useState(false)
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  

  
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
        // استخدمنا Productmod بدل any
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
        // استخدمنا Productmod بدل any
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
    <><div className="card w-full h-full flex flex-col">
    {/* أضفنا h-full و flex flex-col عشان الكارت يملأ المساحة المتاحة له بالكامل */}
    <div className="content flex flex-col flex-grow h-full">
      
      {/* صورة المنتج */}
      <div className="relative w-full aspect-square overflow-hidden rounded-xl z-10">
        <img 
          className='w-full h-full object-cover transition-transform duration-300 hover:scale-105' 
          src={prod.images[0]} 
          alt={prod.name} 
        />
      </div>
  
      {/* تصنيفات المنتج (Categories) */}
      <div className='flex text-center rounded-b-2xl bg-[#ffffff1f] text-[12.5px] font-bold mt-[-20px] Orbitron pt-[12px] px-3 gap-5 items-center justify-center '>
           {prod.category.map((cat,index) => (
            <p key={index}>{cat}</p>
           ))}
          </div>
  
      <div className="flex flex-col flex-grow mt-4 px-2">
        <h3 className='text-center text-[17px] md:text-[20px] mb-2 Marhey truncate' title={prod.name}>
          {prod.name}
        </h3>
        
        <p className="text-center text-gray-400 Playpen text-[11px] md:text-[13px] mb-3 line-clamp-2">
          {prod.description}
        </p>
      </div>
  
      {/* السعر */}
      <p className='acme text-center text-[18px] md:text-[22px] mb-3'>
        {prod.price} EGP
      </p>
      
      <div className='flex rounded-2xl justify-center py-2 px-3 gap-x-4 md:gap-x-8 w-[95%] lg:w-[80%] mx-auto bg-[#ffffff4c] items-center mt-auto mb-2'>
        {loading ? (
          <Loader3 />
        ) : (
          <>
            <button onClick={handleAddToCart} className='cursor-pointer hover:opacity-70 transition-opacity'> 
              <ShoppingBag className="w-5 h-5 md:w-[25px] md:h-[25px]" />
            </button>
            
            <button onClick={handleAddToWishlist} className='cursor-pointer'>
              <Heart 
                className={`w-5 h-5 md:w-[25px] md:h-[25px] transition-all duration-300 ${isFavorite ? 'scale-110' : 'hover:scale-110'}`} 
                fill={isFavorite ? "red" : "none"}
                color={isFavorite ? "red" : "currentColor"} 
              />
            </button>
            
            <button onClick={() => router.push(`/product/${prod.id}`)} className='cursor-pointer hover:opacity-70 transition-opacity'>
              <View className="w-5 h-5 md:w-[25px] md:h-[25px]" />
            </button>
          </>
        )}
      </div>
  
    </div>
  </div>
    </>
  )
}