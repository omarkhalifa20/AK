"use client"
import React, { useEffect, useState } from 'react'
import PorductCard from './PorductCard'
import { motion, useAnimation } from "framer-motion";
import { Productmod } from '@/Types/Productmod';
import { get } from 'http';
import { getProducts } from '@/Action/GetProducts';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link'
import { ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Loader2 from '../Loader2/Loader2';
import { Wishlistmod } from '@/Types/Wishlistmod';

interface ProductHomeProps {
  initialProducts: Productmod[];
  initialWishlist: Wishlistmod[];
}

export default function ProductHome({ initialProducts, initialWishlist }: ProductHomeProps) {
 const Pathname = usePathname()

  const wishlistIds = new Set(
    initialWishlist.map((item) => String(item.product_id))
  )
  
  return (
    <>
    <div id='products' className={Pathname === '/product' ?"container mx-auto pt-23 overflow-x-hidden pb-20 w-[90%]" :"container mx-auto pt-9 overflow-x-hidden pb-20 w-[90%]"}>
      <div className=' relative flex items-center justify-center mb-23 '>
      <h3 className='text-center font-normal  Bungee text-[35px]'>Our Store</h3>
      <Link className='flex items-center absolute right-0 Bungee text-[16px] border p-2 hover:bg-black hover:text-white duration-00 justify-self-end rounded-md border-black ' href="/product">All Products <ArrowRight /> </Link>
      </div>
      <motion.div 
      initial={{ scale: 0.8, opacity: 0 }} 
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1.7, ease: "easeIn" }}
      viewport={{ once: true }}
      className='grid grid-cols-12 gap-19'>
      
      {initialProducts
        .filter((product) => product.quantity > 0)
        .map((product) => (
          <div key={product.id} className='col-span-3'>
            <PorductCard initialIsFavorite={wishlistIds.has(String(product.id))}  prod={product}/> 
          </div>
      ))}
      
      </motion.div> 
      <p className='text-center mx-auto rounded-md mt-11 font-medium py-1 px-5 Orbitron text-[14px]  text-black border border-black w-fit hover:bg-black hover:text-white duration-300 cursor-pointer ' >Show More..</p>
      
    </div>
    </>
  )
}