"use client"
import { Productmod } from '@/Types/Productmod'
import React from 'react'
import PorductCard from '../Products/PorductCard'
import { motion, useAnimation } from "framer-motion";
export default function MensMain({products } : {products: Productmod[]}) {

  return (
    <>
    <div  className='container mx-auto w-[90%] min-h-screen pt-25 pb-15'>
     <h3 className='text-center font-semibold mb-23 Orbitron text-[35px]'>Mens Clothes</h3>
     {products.length === 0 ? ( <p className='text-center text-[20px] text-[#616F7C] Playpen'>للاسف مفيش منتجات متاحه حالياً في هذا القسم</p>)
          :(<motion.div 
           initial={{ scale: 0.8, opacity: 0 }} 
           whileInView={{ scale: 1, opacity: 1 }}
           transition={{ duration: 1.7, ease: "easeIn" }}
           viewport={{ once: true }}
           className='grid grid-cols-12 gap-19'>
            {products.map((product) => (
            
              <div key={product.id} className='col-span-3  '>
             <PorductCard  prod={product}/> 
            </div>
            
            ))}
            
           
            
           </motion.div>) }
     
    </div>
    
    </>
  )
}
