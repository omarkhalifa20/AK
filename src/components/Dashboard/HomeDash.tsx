import { FinalOrder } from '@/Types/Orders';
import { Productmod } from '@/Types/Productmod'
import { Wishlistmod } from '@/Types/Wishlistmod';
import { Boxes, Inbox, Shirt, User } from 'lucide-react'
import React from 'react'
interface DashHomeProps {
  initialProducts: Productmod[];
  usersCount: number; 
  doneOrders :FinalOrder[] ;
  waitingOrders : FinalOrder[] ;
}
export default function HomeDash({ initialProducts, usersCount , waitingOrders , doneOrders }: DashHomeProps) {
  return (
    <>
    
    <div className='container w-[90%] mx-auto '>
     <h3 className='text-center text-[22px] Playpen font-medium pt-5'>الرئيسية</h3>
     <div className='grid mt-12 grid-cols-12 text-center p-7 w-[85%] mx-auto rounded-2xl bg-white  '>
     <div className='col-span-4'>
       <h3 className='text-[#616F7C] flex items-center katibeh justify-center gap-2 text-[20px]'>عدد المستخدمين<span><User size={20} /> </span></h3>
       <p className='text-[64px] text-[#552DD9]'>{usersCount}</p>
       </div>

       <div className='col-span-4 border-r-2 border-l-2 border-[#DAE1E9]'>
       <h3 className='text-[#616F7C]  flex items-center katibeh justify-center gap-2 text-[20px]'>عدد المنتجات <span><Shirt size={20} /></span></h3>
       <p className='text-[64px] text-[#552DD9]'>{initialProducts.length}</p>
       </div>
     
       <div className='col-span-4 '>
       <h3 className='text-[#616F7C] flex items-center katibeh justify-center gap-2 text-[20px]'>عدد الاقسام<span><Boxes size={20} /> </span></h3>
       <p className='text-[64px] text-[#552DD9]'>4</p>
       </div>
     </div>

    <div className='text-center mt-14 pt-3 p-7 w-[85%] mx-auto rounded-2xl bg-white'>
    <h3 className='katibeh text-[22px] flex items-center katibeh justify-center gap-2 mb-5'>الطلبات<span><Inbox size={20} /></span></h3>
  <div className='grid  grid-cols-12   '>
     
     <div className='col-span-4'>
       <h3 className='text-[#616F7C] flex items-center katibeh justify-center gap-2 text-[20px]'>الاجمالي</h3>
       <p className='text-[64px] text-[#552DD9]'>{doneOrders.length+waitingOrders.length}</p>
       </div>

       <div className='col-span-4 border-r-2 border-l-2 border-[#DAE1E9]'>
       <h3 className='text-[#616F7C]  flex items-center katibeh justify-center gap-2 text-[20px]'>تم تسليمه</h3>
       <p className='text-[64px] text-[#552DD9]'>{doneOrders.length}</p>
       </div>
     
       <div className='col-span-4 '>
       <h3 className='text-[#616F7C] flex items-center katibeh justify-center gap-2 text-[20px]'>لم يتم تسليمه</h3>
       <p className='text-[64px] text-[#552DD9]'>{waitingOrders.length}</p>
       </div>
     </div>

    </div>
</div>
    </>
  )
}
