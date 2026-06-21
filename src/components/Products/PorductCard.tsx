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
  
  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);
  
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
    <>
      <div className="card">
        <div className="content ">
          <img className='rounded-xl w-full aspect-square object-cover z-55' src={prod.images[0]} alt="" />
          <div className='flex text-center rounded-b-2xl bg-[#ffffff1f] text-[12.5px] font-bold mt-[-20px] Orbitron pt-[12px] px-3 gap-5 items-center justify-center '>
           {prod.category.map((cat,index) => (
            <p key={index}>{cat}</p>
           ))}
          </div>
          <h3 className='text-center text-[20px] mb-2 Marhey'>{prod.name}</h3>
          <p className="text-end flex-grow Playpen text-[13px] mb-3">
          {prod.description}
          </p>
          <p className='acme text-center text-[22px]'>{prod.price} EGP</p>
          
          <div className='flex rounded-2xl  justify-center p-2 gap-x-8 px-5 w-[70%] mx-auto  bg-[#ffffff4c] items-center  '>
            {loading ? <Loader3/> : <>
              <button onClick={handleAddToCart} className='text-[12px] cursor-pointer'> <ShoppingBag size={25} /></button>
              <button onClick={handleAddToWishlist} className='cursor-pointer'><Heart size={25} fill={isFavorite ? "red" : "none"}
                      color={isFavorite ? "red" : "currentColor"} 
                      className={`transition-colors duration-300 ${isFavorite ? 'scale-110' : ''}`} /></button>
              <button onClick={() => router.push(`/product/${prod.id}`)} className='cursor-pointer'><View size={25} /></button>
            </>}
          </div>
        </div>
      </div>
    </>
  )
}