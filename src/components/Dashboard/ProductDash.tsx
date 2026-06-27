"use client"
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import ProductsAdd from '@/components/Products/ProductsAdd'
import { Productmod } from '@/Types/Productmod'
import { BadgeCheck, BadgeX, X } from 'lucide-react'
import { removeProduct } from '@/Action/GetProducts'
import toast from 'react-hot-toast'
import ProductsEdit from '../Products/ProductsEdit'

export default function ProductDash({Products} : {Products : Productmod[]}) {
    // تعريف الـ State لقائمة المنتجات وتعيين القيمة الابتدائية القادمة من الـ Props
    const [products, setProducts] = useState<Productmod[]>(Products);
    
   

    // دالة حذف المنتج
    const handleDelete = async (itemId: string) => {
        const previousProducts = [...products];
        
        // تحديث الواجهة فوراً قبل اكتمال طلب السيرفر لتجربة مستخدم أسرع (Optimistic UI)
        setProducts((prev) => prev.filter(item => item.id !== itemId));
    
        const result = await removeProduct(itemId);
        
        if (!result.success) {
            // في حال فشل الحذف من السيرفر، يتم إرجاع المنتجات المحذوفة للواجهة
            setProducts(previousProducts);
            toast.error("حدث خطأ أثناء محاولة حذف المنتج");
            console.log("Error deleting product:", result.message);
        } else {
            toast.success("تم حذف المنتج بنجاح");
        }
    };

  return (
    <>
    <div className='container pt-4 w-[90%] mx-auto '>
      <div className='mb-9'>
        <h3 className='text-center text-[24px] Playpen font-medium pt-5 mb-10'>المنتجات</h3>
        {/* تمرير دالة setProducts لمكون الإضافة ليقوم بتحديث الجدول فوراً عند إضافة منتج جديد */}
        <ProductsAdd setProducts={setProducts} />
      </div>
      
      <div className='border border-[#B8C2CC] rounded-2xl shadow-md overflow-hidden'>
        <Table className='bg-white Playpen font-medium'>
          <TableHeader className='bg-[#F0F3F6] font-semibold'>
            <TableRow>
              <TableHead className="text-center"></TableHead>
              <TableHead className="text-center">السعر</TableHead>
              <TableHead className="text-center">الحاله</TableHead>
              <TableHead className="text-center">الكميه</TableHead>
              <TableHead className="text-center">المجموعه</TableHead>
              <TableHead className="text-center">أسم المنتج</TableHead>
              <TableHead className="text-center">المنتج</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {/* هنا تم تعديل الكود ليقرأ من الـ State (products) بدلاً من الـ Props الثابتة */}
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-5 font-bold text-black">
                  لا توجد منتجات في الموقع برجاء اضافة منتجات لعرضها هنا
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="text-center">
                    <div className='flex items-center gap-3 justify-center'>
                      <button 
                        onClick={() => handleDelete(product.id)} 
                        className='bg-red-500 p-1 rounded-md hover:bg-red-700 duration-300 cursor-pointer text-[#fff]'
                      >
                        <X size={21} />
                      </button>
                      <ProductsEdit product={product} />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{product.price}</TableCell>
                  <TableCell className="text-center">
                    {product?.status === 'متاح' ? (
                      <span className='bg-green-100 flex w-fit py-1 px-2 text-green-600 rounded-3xl mx-auto items-center gap-4 justify-center'>
                        <BadgeCheck />{product?.status}
                      </span>
                    ) : (
                      <span className='bg-red-100 flex w-fit py-1 px-2 text-red-600 rounded-3xl mx-auto items-center gap-4 justify-center'>
                        <BadgeX />{product?.status}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">{product.quantity}</TableCell>
                  <TableCell className="text-center">{product.category.join(' - ')}</TableCell>
                  <TableCell className="text-center">{product.name}</TableCell>
                  <TableCell className="text-center">
                    <img className='w-[60px] h-[60px] rounded mx-auto' src={product.images[0]} alt={product.name} />
                  </TableCell>
                </TableRow>
              ))
            )} 
          </TableBody>
          
          <TableFooter>
            <TableRow>
              <TableCell className="text-center"></TableCell>
              <TableCell className="text-center"></TableCell>
              <TableCell className="text-center"></TableCell>
              <TableCell className="text-center"></TableCell>
              <TableCell className="text-center"></TableCell>
              <TableCell className="text-center"></TableCell>
              <TableCell className="text-center"></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
    </>
  )
}