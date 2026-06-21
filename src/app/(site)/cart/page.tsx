"use server"
import { getCart } from '@/Action/Cart'
import CartMain from '@/components/Cart/CartMain'
import React from 'react'

export default async function page() {
  const cartdata  = await getCart();
  
 
  
  
  return (
    <>
    <div className='container w-[90%] mx-auto min-h-screen pt-25 pb-9 bg-[#F5F3F1]  '>
      <CartMain cartdata={cartdata} />
    </div>
    </>
  )
}
