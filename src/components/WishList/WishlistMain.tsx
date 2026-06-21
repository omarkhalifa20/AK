"use client"
import React, { useEffect, useState, useTransition } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table"
import { BadgeCheck, BadgeX, ShoppingBag, X } from 'lucide-react'
import { Wishlistmod } from '@/Types/Wishlistmod'
import { removeFromWishlist } from '@/Action/Wishlist'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabaseClient'
import { CartMod } from '@/Types/Cartmod'
import { AddCart, getCart } from '@/Action/Cart'
import { useStore } from '@/useStore'
import { Productmod } from '@/Types/Productmod'
import { useAuth } from '@/app/(site)/(auth)/useAuth' 

export default function WishlistMain({wishlistdata} : {wishlistdata:Wishlistmod[]}) {
  const { incrementCart, setInitialCounts, cartCount } = useStore(); 
  const { user } = useAuth(); 
  
  const [wishlist, setWishlist] = useState<Wishlistmod[]>([]); 
  
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        setWishlist(wishlistdata);
      } else {
        const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
        setWishlist(guestWishlist);
      }
    }, 0);
    
    return () => clearTimeout(timer);
  }, [user, wishlistdata]);
   
  const handleAddToCart = (prod: Wishlistmod) => {
    startTransition(async () => {
      try {
        if (user) {
          const currentCart = await getCart();
          const isItemInCart = currentCart.find((item: CartMod) => String(item.product_id) === String(prod.product_id || prod.id));

          if (isItemInCart) {
            toast.error("المنتج موجود بالفعل في السلة");
            return; 
          }
          
          const response = await AddCart(prod as unknown as Productmod, user.id);
          
          if (response.success) {
            toast.success("تمت إضافة المنتج للسلة بنجاح!");
            incrementCart();
          } else {
            toast.error("حصلت مشكلة: " + response.error);
          }
        } else {
          const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
          
          // التعديل هنا: استخدمنا Wishlistmod بدل any
          const isItemInCart = guestCart.find((item: Wishlistmod) => String(item.id) === String(prod.id || prod.product_id));

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
        toast.error("حدث خطأ غير متوقع");
      }
    });
  }

  const handleDelete = (itemId: string) => {
    const previousWishlist = [...wishlist];
    const newWishlist = wishlist.filter(item => item.id !== itemId);
    
    setWishlist(newWishlist);

    if (user) {
      startTransition(async () => {
        const result = await removeFromWishlist(itemId);
    
        if (!result.success) {
          setWishlist(previousWishlist);
          toast.error("حدث خطأ أثناء محاولة حذف المنتج");
        } else {
          toast.success("تم الحذف من المفضلة");
          setInitialCounts(cartCount, newWishlist.length); 
        }
      });
    } else {
      localStorage.setItem("guestWishlist", JSON.stringify(newWishlist));
      toast.success("تم الحذف من المفضلة");
      setInitialCounts(cartCount, newWishlist.length); 
    }
  };

  return (
    <>
      <div className='container w-[90%] mx-auto '>
        <h3 className='text-center font-bold mb-8 text-[29px] Playpen pt-5'>Your Wishlist</h3>
        
        <div className={`border border-[#B8C2CC] rounded-2xl shadow-md overflow-hidden transition-opacity duration-300 ${isPending ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
          <Table className='bg-white Playpen text-[15px]'>
            <TableHeader className='bg-[#F0F3F6]'>
              <TableRow>
                <TableCell className="text-center"></TableCell>
                <TableHead className="text-center"></TableHead>
                <TableHead className="text-center">السعر</TableHead>
                <TableHead className="text-center">الحاله</TableHead>
                <TableHead className="text-center">أسم المنتج</TableHead>
                <TableHead className="text-center">المنتج</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className=' '>
              {wishlist.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-5 font-bold text-black">
                    المفضله فارغة 🛒 .. برجاء إضافة منتجات أولاً!
                  </TableCell>
                </TableRow>
              ) : (
                wishlist.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center">
                      <button onClick={()=>handleDelete(item.id)} className='bg-red-500 p-2 rounded-full text-white cursor-pointer mx-auto hover:bg-red-600 transition-all duration-300 '>
                        <X size={16} />
                      </button>
                    </TableCell>
                    <TableCell className="text-center">
                      <button onClick={()=>handleAddToCart(item)} className=' flex hover:bg-transparent hover:text-black border-2 duration-300 border-black mx-auto py-1 px-3 gap-3 rounded-md text-white bg-black cursor-pointer '>
                        <ShoppingBag /> اضف الي السله 
                      </button>
                    </TableCell>
                    <TableCell className="text-center"><p className='font-semibold'>{item.price}</p></TableCell>
                    <TableCell className="text-center">
                      {item.Products?.status === 'متاح' || !user ? (
                        <span className='bg-green-100 flex w-fit py-1 px-2 text-green-600 rounded-3xl mx-auto items-center gap-4 justify-center'><BadgeCheck />{item.Products?.status || 'متاح'} </span>
                      ) : (
                        <span className='bg-red-100 flex w-fit py-1 px-2 text-red-600 rounded-3xl mx-auto items-center gap-4 justify-center'><BadgeX />{item.Products?.status || 'غير متاح'} </span>
                      )}
                    </TableCell> 
                    <TableCell className="text-center"><p className='font-semibold'>{item.name}</p></TableCell>
                    <TableCell className="text-center "><img className='w-[60px] rounded mx-auto' src={item.images[0]} alt="" /></TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter className='bg-[#F0F3F6] p-1'>
              <TableRow>
                <TableCell className="text-center"></TableCell>
                <TableCell className="text-center"></TableCell>
                <TableCell className="text-center"></TableCell>
                <TableCell className="text-center"></TableCell>
                <TableCell className="text-center"></TableCell>
                <TableCell className="text-center"></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </>
  )
}