"use client"
import React from 'react'
import { motion, useAnimation } from "framer-motion";
import Link from 'next/link'
export default function CategoriesHome() {
  return (
    <>
    <div id='categories' className='container mx-auto pt-8 pb-5 w-[90%]'>
     <h3 className='text-center mb-5 lg:mb-20 Bungee text-[35px]'>Our Categories</h3>
        <div className='grid grid-cols-12 gap-7 overflow-hidden   '> 
          
          <Link className='col-span-12 lg:col-span-8'  href='/womens'>
          <motion.div
            
            initial={{ x:-150 , opacity: 0 }} 
            whileInView={{ x:0, opacity: 1 }}
            transition={{ duration: 2, ease: "easeIn"}}
            viewport={{ once: true }}
           className='  cursor-pointer px-4 flex justify-center lg:justify-start items-end sm:h-50 md:h-70 lg:h-100 rounded-3xl grimg-1 '>
           <p className='Bungee z-[50] text-[#ffffff]  text-[33px] lg:text-[50px]'>Womens Shoes</p>
          </motion.div></Link>

          <Link className='col-span-12 lg:col-span-4'  href='/childs'>
          <motion.div
           initial={{ x:150 , opacity: 0 }} 
           whileInView={{ x:0, opacity: 1 }}
           transition={{ duration: 2, ease: "easeIn"}}
           viewport={{ once: true }}
           className=' flex cursor-pointer items-end justify-center sm:h-50 md:h-70 lg:h-100 rounded-3xl grimg-2 '>
          <p className='Bungee z-[50] text-[#007c8f] text-[33px] lg:text-[40px]'> Child Shoes</p>
          </motion.div>
          </Link>
          
          <Link className='col-span-12 lg:col-span-4'  href='/olds'>
          <motion.div
           initial={{ x:-150 , opacity: 0 }} 
           whileInView={{ x:0, opacity: 1 }}
           transition={{ duration: 2, ease: "easeIn"}}
           viewport={{ once: true }}
           className=' flex cursor-pointer items-end justify-center sm:h-50 md:h-70 lg:h-100 rounded-3xl grimg-3 '>
          <p className='Bungee z-[50] text-[#007c8f]  text-[33px] lg:text-[40px]'> Old Man Shoes</p>
          </motion.div>
          </Link>

          <Link className='col-span-12 lg:col-span-8'  href='/mens'>
          <motion.div 
           initial={{ x:150 , opacity: 0 }} 
           whileInView={{ x:0, opacity: 1 }}
           transition={{ duration: 2, ease: "easeIn"}}
           viewport={{ once: true }}
          className='col-span-8 sm:h-50 md:h-70 lg:h-100 cursor-pointer px-4 justify-center lg:justify-start flex items-end rounded-3xl grimg-4'>
          <p className='Bungee z-[50] text-[#ffffff]  text-[33px] lg:text-[50px]'>Mens Shoes</p>
          </motion.div>
          </Link>

        </div>  
      </div>
    </>
  )
}
