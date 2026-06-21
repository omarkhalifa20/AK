import React from 'react'
import Marquee from "react-fast-marquee";

export default function MarqueeComp() {
  return (
    <>
    <Marquee className='bg-black w-full mt-5' 
    gradient={false} 
    speed={50}
    autoFill   
    >
      <div className='flex items-center gap-5 justify-between '>
        
        <img className='w-[40px]' src="/brand2.webp" alt="" />
        <img className='w-[40px]' src="/brand3.jpg" alt="" />
        <img className='w-[40px]' src="/brand4.jpg" alt="" />
        
      </div>
    </Marquee>
    </>
  )
}
