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
    const [products, setProducts] = useState<Productmod[]>(Products);
    
    const handleDelete = async (itemId: string) => {
        const previousProducts = [...products];
        setProducts((prev) => prev.filter(item => item.id !== itemId));
    
        const result = await removeProduct(itemId);
        
        if (!result.success) {
            setProducts(previousProducts);
            toast.error("حدث خطأ أثناء محاولة حذف المنتج");
            console.log("Error deleting product:", result.message);
        } else {
            toast.success("تم حذف المنتج بنجاح");
        }
    };

  return (
    <>
    <div className='container py-5 w-[95%] md:w-[90%] mx-auto pb-28 md:pb-10'>
      <div className='mb-6 md:mb-9'>
        <h3 className='text-center text-[24px] Playpen font-medium pt-5 mb-6 md:mb-10'>المنتجات</h3>
        <ProductsAdd setProducts={setProducts} />
      </div>
      
      {/* تصميم البطاقات الخاص بالهاتف (مخفي في الشاشات الكبيرة) */}
      <div className="md:hidden flex flex-col gap-4">
        {products.length === 0 ? (
           <div className="text-center py-10 font-bold text-black bg-white rounded-2xl shadow-sm border border-[#B8C2CC]">
             لا توجد منتجات في الموقع برجاء اضافة منتجات لعرضها هنا
           </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-2xl border border-[#B8C2CC] shadow-sm flex flex-col text-right">
              <div className="flex justify-between items-start mb-3">
                <img className='w-[70px] h-[70px] rounded-lg object-cover border' src={product.images[0]} alt={product.name} />
                <div className="flex-1 mr-4">
                  <h4 className="font-bold text-lg text-gray-800">{product.name}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{product.category.join(' - ')}</p>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4 bg-gray-50 p-2 rounded-lg">
                <div className="flex flex-col items-center">
                  <span className="text-[11px] text-gray-500">السعر</span>
                  <span className="font-bold">{product.price}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[11px] text-gray-500">الكمية</span>
                  <span className="font-bold">{product.quantity}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[11px] text-gray-500">الحالة</span>
                  {product?.status === 'متاح' ? (
                    <span className='flex items-center gap-1 text-green-600 text-sm font-bold'><BadgeCheck size={16}/> متاح</span>
                  ) : (
                    <span className='flex items-center gap-1 text-red-600 text-sm font-bold'><BadgeX size={16}/> غير متاح</span>
                  )}
                </div>
              </div>
              <div className="flex justify-start gap-2 border-t pt-3">
                <button onClick={() => handleDelete(product.id)} className='bg-red-500 p-2 rounded-md hover:bg-red-700 duration-300 text-white'>
                  <X size={18} />
                </button>
                <ProductsEdit product={product} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* تصميم الجدول الخاص بالشاشات الكبيرة (مخفي في الهاتف) */}
      <div className='hidden md:block border border-[#B8C2CC] rounded-2xl shadow-md overflow-hidden'>
        <div className="overflow-x-auto">
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
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-5 font-bold text-black">
                    لا توجد منتجات في الموقع برجاء اضافة منتجات لعرضها هنا
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="text-center">
                      <div className='flex items-center gap-3 justify-center'>
                        <button onClick={() => handleDelete(product.id)} className='bg-red-500 p-1 rounded-md hover:bg-red-700 duration-300 text-[#fff]'>
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
                      <img className='w-[60px] h-[60px] rounded mx-auto object-cover' src={product.images[0]} alt={product.name} />
                    </TableCell>
                  </TableRow>
                ))
              )} 
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
    </>
  )
}