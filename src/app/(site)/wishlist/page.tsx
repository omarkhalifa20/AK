"use server"
import { getWishlist } from '@/Action/Wishlist';
import WishlistMain from '@/components/WishList/WishlistMain'
import React from 'react'

export default async function page() {
  const wishlistdata  = await getWishlist();
  return (
    <>
    <div className='container w-[90%] mx-auto min-h-screen pt-25 pb-9 bg-[#F5F3F1]  '>
          <WishlistMain wishlistdata={wishlistdata}/>
        </div>
    </>
  )
}
