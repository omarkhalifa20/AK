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
    {/* تمت إضافة pb-24 لعدم تغطية الشريط السفلي للمحتوى في الهاتف */}
    <div className='container w-[95%] md:w-[90%] mx-auto pb-24 md:pb-5'>
     <h3 className='text-center text-[22px] Playpen font-medium pt-5'>الرئيسية</h3>
     
     {/* إحصائيات عامة */}
     <div className='grid mt-8 md:mt-12 grid-cols-2 md:grid-cols-12 gap-4 md:gap-0 text-center p-0 md:p-7 w-full md:w-[85%] mx-auto md:rounded-2xl md:bg-white'>
       <div className='col-span-1 md:col-span-4 bg-white md:bg-transparent p-5 md:p-0 rounded-2xl md:rounded-none shadow-sm md:shadow-none flex flex-col justify-center items-center'>
         <h3 className='text-[#616F7C] flex items-center katibeh justify-center gap-2 text-[16px] md:text-[20px]'>عدد المستخدمين<span><User size={18} className="md:w-[20px] md:h-[20px]" /> </span></h3>
         <p className='text-[48px] md:text-[64px] text-[#552DD9] leading-none mt-2'>{usersCount}</p>
       </div>

       <div className='col-span-1 md:col-span-4 md:border-r-2 md:border-l-2 border-[#DAE1E9] bg-white md:bg-transparent p-5 md:p-0 rounded-2xl md:rounded-none shadow-sm md:shadow-none flex flex-col justify-center items-center'>
         <h3 className='text-[#616F7C] flex items-center katibeh justify-center gap-2 text-[16px] md:text-[20px]'>عدد المنتجات <span><Shirt size={18} className="md:w-[20px] md:h-[20px]" /></span></h3>
         <p className='text-[48px] md:text-[64px] text-[#552DD9] leading-none mt-2'>{initialProducts.length}</p>
       </div>
     
       <div className='col-span-2 md:col-span-4 bg-white md:bg-transparent p-5 md:p-0 rounded-2xl md:rounded-none shadow-sm md:shadow-none flex flex-col justify-center items-center'>
         <h3 className='text-[#616F7C] flex items-center katibeh justify-center gap-2 text-[16px] md:text-[20px]'>عدد الاقسام<span><Boxes size={18} className="md:w-[20px] md:h-[20px]" /> </span></h3>
         <p className='text-[48px] md:text-[64px] text-[#552DD9] leading-none mt-2'>4</p>
       </div>
     </div>

    {/* إحصائيات الطلبات */}
    <div className='text-center mt-8 md:mt-14 md:pt-3 p-0 md:p-7 w-full md:w-[85%] mx-auto md:rounded-2xl md:bg-white'>
      <h3 className='katibeh text-[22px] flex items-center katibeh justify-center gap-2 mb-5'>الطلبات<span><Inbox size={20} /></span></h3>
      <div className='grid grid-cols-2 md:grid-cols-12 gap-4 md:gap-0'>
         
         <div className='col-span-2 md:col-span-4 bg-white md:bg-transparent p-5 md:p-0 rounded-2xl md:rounded-none shadow-sm md:shadow-none flex flex-col justify-center items-center'>
           <h3 className='text-[#616F7C] flex items-center katibeh justify-center gap-2 text-[16px] md:text-[20px]'>الاجمالي</h3>
           <p className='text-[48px] md:text-[64px] text-[#552DD9] leading-none mt-2'>{doneOrders.length+waitingOrders.length}</p>
         </div>

         <div className='col-span-1 md:col-span-4 md:border-r-2 md:border-l-2 border-[#DAE1E9] bg-white md:bg-transparent p-5 md:p-0 rounded-2xl md:rounded-none shadow-sm md:shadow-none flex flex-col justify-center items-center'>
           <h3 className='text-[#616F7C] flex items-center katibeh justify-center gap-2 text-[16px] md:text-[20px]'>تم تسليمه</h3>
           <p className='text-[48px] md:text-[64px] text-[#552DD9] leading-none mt-2'>{doneOrders.length}</p>
         </div>
       
         <div className='col-span-1 md:col-span-4 bg-white md:bg-transparent p-5 md:p-0 rounded-2xl md:rounded-none shadow-sm md:shadow-none flex flex-col justify-center items-center'>
           <h3 className='text-[#616F7C] flex items-center katibeh justify-center gap-2 text-[16px] md:text-[20px]'>لم يتم تسليمه</h3>
           <p className='text-[48px] md:text-[64px] text-[#552DD9] leading-none mt-2'>{waitingOrders.length}</p>
         </div>
      </div>
    </div>
</div>
    </>
  )
}