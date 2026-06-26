"use client"
import React, { useEffect } from 'react'
import { motion, useAnimation } from "framer-motion";
export default function HomeComp() {
  const controls = useAnimation();

  useEffect(() => {
    const startAnimations = async () => {
   
      await controls.start({
        y: 0,
        opacity: 1,
        transition: { duration: 1.5, ease: "easeInOut" }
      });

      
      controls.start({
        boxShadow: [
          "0 0 5px #000",
          "0 0 25px #000",
          "0 0 50px #000",
          "0 0 25px #000",
        ],
        transition: {
          duration: 1.5,
          repeat: Infinity, 
          ease: "easeInOut",
        }
      });
    };

    startAnimations();
  }, [controls]);
  return (
    <>
    <div className=" home-comp h-[90vh]  md:h-screen ">
        <div className='container overflow-y-hidden mx-auto h-full flex flex-col justify-end items-center text-center md:px-6 '>
            <div className='flex relative justify-center items-center'>
            <motion.img
             initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.7, ease: "easeIn" }}
             className=' w-[330px]  md:w-[53%]  lg:w-[43%] xl:w-[33%] 2xl:w-[28.5%] z-[30] relative top-[6%]  '  src="/homemodel.png" alt="" />
                <div className='Orbitron flex flex-col h-full  font-bold absolute top-[-30] md:top-[0] lg:top-[150] '>
                  <motion.h1
                  initial={{ x:-150, opacity: 0 }}
                  animate={{ x:0, opacity: 1 }}
                  transition={{ duration: 1.7, ease: "easeIn" }}
                   className='text-[55px] md:text-[100px] lg:text-[140px] xl:text-[140px]  2xl:text-[120px] relative leading-9 md:leading-12 lg:leading-17 xl:leading-15.5 xl:leading-14.5 flex flex-col  z-[20] items-end  text-white' >AK STORE <br /><span className='text-[20px] justify-end text-black font-bold me-1 '>for Shoes</span></motion.h1>
                 
                  <motion.button
  className="relative duration-500 mt-auto mb-30 md:mb-9 bg-[#000000e0] text-white text-[10px] md:text-[12px] lg:text-[16px] w-fit mx-auto rounded-xl cursor-pointer py-2 px-5 font-bold tracking-[4px] uppercase z-[40]"
  initial={{
    y: 100,
    opacity: 0,
    boxShadow: "0 0 25px #000",
  }}
  
  animate={controls}
  whileHover={{
    boxShadow: `
      0 0 5px #000,
      0 0 25px #000,
      0 0 50px #000,
      0 0 100px #000
    `,
  }}
>
  Get Started
</motion.button>
                 
                </div>
                
            </div>
            
        </div>
     
    </div>
    </>
  )
}
