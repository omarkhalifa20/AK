"use client"
import React from 'react'
import PorductCard from './PorductCard'
import { motion } from "framer-motion";
import { Productmod } from '@/Types/Productmod';
import Link from 'next/link'
import { ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Wishlistmod } from '@/Types/Wishlistmod';

// استيراد Swiper والموديول الخاص بالنقاط (Pagination)
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

// استيراد ملفات الستايل الخاصة بـ Swiper
import 'swiper/css';
import 'swiper/css/pagination';

interface ProductHomeProps {
  initialProducts: Productmod[];
  initialWishlist: Wishlistmod[];
}

export default function ProductHome({ initialProducts, initialWishlist }: ProductHomeProps) {
  const Pathname = usePathname()

  const wishlistIds = new Set(
    initialWishlist.map((item) => String(item.product_id))
  )

  const availableProducts = initialProducts.filter((p) => p.quantity > 0);
  
  const mensProducts = availableProducts.filter(p => p.category?.includes('mens'));
  const womensProducts = availableProducts.filter(p => p.category?.includes('womens'));
  const kidsProducts = availableProducts.filter(p => p.category?.includes('childs')); 
  const oldsProducts = availableProducts.filter(p => p.category?.includes('olds'));

  const renderProductSection = (title: string, link: string, products: Productmod[]) => {
    return (
      <div className='mb-15 w-full'>
        <div className='relative flex items-center justify-between mb-8 pb-3 border-b-2 border-gray-100'>
          <h3 className='font-normal Bungee text-[18px] md:text-[28px] uppercase tracking-wide text-black'>{title}</h3>
          <Link className='flex items-center Bungee text-[13px] md:text-[15px] border py-[5px] px-[9px] md:py-2 md:px-4 hover:bg-black hover:text-white transition-all duration-300 rounded-md border-black ' href={link}>
            Show All <ArrowRight className='ml-2' size={18} />
          </Link>
        </div>

       
        {products.length === 0 ? (
       
          <div className="flex items-center justify-center Playpen h-44 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
            <p className="text-gray-400 font-medium text-lg tracking-wide">
              عفواً، لا يوجد منتجات في هذا القسم حالياً.
            </p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-50px" }}
            className="relative" 
          >
            <Swiper
              modules={[Pagination]}
              pagination={{ 
                clickable: true, 
                dynamicBullets: true,
              }}
              spaceBetween={8}
              breakpoints={{
                0: { slidesPerView: 2, slidesPerGroup: 2 },  
                640: { slidesPerView: 3, slidesPerGroup: 3 },  
                1024: { slidesPerView: 4, slidesPerGroup: 4 }, 
              }}
              className="pb-16" 
            >
              {products.map((product) => (
                <SwiperSlide className='mb-8' key={product.id}>
                  <PorductCard initialIsFavorite={wishlistIds.has(String(product.id))} prod={product}/> 
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <>
      <div id='products' className={Pathname === '/product' ? "container mx-auto pt-24 overflow-x-hidden pb-20 w-[90%]" : "container mx-auto pt-12 overflow-x-hidden pb-20 w-[90%]"}>
        
        {/* عنوان المتجر الرئيسي أعلى الصفحة */}
        <div className='flex flex-col items-center justify-center mb-16'>
          <h2 className='text-center font-normal Bungee text-[38px] tracking-wider border-b-4 border-black pb-2 px-6'>Our Store</h2>
        </div>

        {/* استدعاء السكاشن الأربعة بالتوالي */}
        {renderProductSection("Men's Products", "/mens", mensProducts)}
        {renderProductSection("Women's Products", "/womens", womensProducts)}
        {renderProductSection("Kids Products", "/childs", kidsProducts)}
     

      </div>
    </>
  )
}