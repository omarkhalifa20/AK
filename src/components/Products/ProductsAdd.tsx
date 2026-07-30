"use client"
import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, X, ListPlus } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import Loader from '../Loader/Loader'
import toast from 'react-hot-toast'
import { Productmod } from '@/Types/Productmod'

type Inputs = {
  productName: string
  productPrice: number
  productCategory: string[]
  productDescription: string
  productImages: FileList
}

type Variant = {
  id: string; 
  color: string;
  size: string;
  quantity: number;
}

type ProductsAddProps = {
  setProducts?: React.Dispatch<React.SetStateAction<Productmod[]>>
}

export default function ProductsAdd({ setProducts }: ProductsAddProps) {
  const categories = ["mens", "womens", "childs"]
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const [variants, setVariants] = useState<Variant[]>([])
  const [tempColor, setTempColor] = useState("")
  const [tempSize, setTempSize] = useState("")
  const [tempQty, setTempQty] = useState<number | "">("")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>()

  const addVariant = () => {
    if (!tempColor.trim() || !tempSize.trim() || !tempQty || tempQty <= 0) {
      toast.error("برجاء إدخال اللون والمقاس والكمية بشكل صحيح")
      return
    }

    const newVariant: Variant = {
      id: crypto.randomUUID(),
      color: tempColor.trim(),
      size: tempSize.trim(),
      quantity: Number(tempQty)
    }

    setVariants(prev => [...prev, newVariant])
    
    setTempColor("")
    setTempSize("")
    setTempQty("")
  }

  const removeVariant = (id: string) => {
    setVariants(prev => prev.filter(v => v.id !== id))
  }

  async function onSubmit(data: Inputs) {
    if (variants.length === 0) {
      toast.error("برجاء إضافة متغير واحد على الأقل (لون، مقاس، كمية)")
      return
    }

    setLoading(true)

    const totalQuantity = variants.reduce((acc, curr) => acc + curr.quantity, 0)
    
    const files = data.productImages as FileList
    const imageUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileName = `${crypto.randomUUID()}-${file.name}`;
      
      const { error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file)
      
      if (error) {
        console.log(error)
        toast.error("فشل في رفع الصور")
        setLoading(false)
        return
      } 
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(fileName)
      imageUrls.push(urlData.publicUrl)
    }

    const { data: newProduct, error } = await supabase.from("Products").insert([
      {
        name: data.productName,
        price: Number(data.productPrice),
        category: data.productCategory,
        description: data.productDescription,
        images: imageUrls,
        quantity: totalQuantity,
        variants: variants 
      }
    ]).select()
    
    if (error) {
      console.log(error.message)
      toast.error("حدث خطأ أثناء إضافة المنتج")
    } else {
      toast.success("تم إضافة المنتج بنجاح")
      
      if (setProducts && newProduct) {
        setProducts((prev) => [newProduct[0] as Productmod, ...prev]);
      }

      reset()
      setVariants([])
      setIsOpen(false)
    }

    setLoading(false)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className='flex items-center py-1 px-4 rounded-xl text-[#ffffff] bg-linear-to-r from-[#6E38FF] to-[#AF38FF] katibeh text-[22px] gap-2 cursor-pointer justify-center'>
          <Plus size={20} /> <p className='mb-2'>اضافه منتج </p>
        </DialogTrigger>
        
        <DialogContent className='w-[95%] md:!max-w-[65%] max-h-[90vh] overflow-y-auto !rounded-3xl p-4 md:p-6' >
          {loading ? <Loader /> : <>
            <DialogHeader>
              <DialogTitle className='text-center katibeh text-[24px] mb-4 md:mb-6 text-[#6E38FF]'>اضافه المنتج</DialogTitle>
              <DialogDescription asChild>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 '>
                  
                  <div className='flex flex-col'>
                    <Input 
                      {...register("productName" , { required: "ادخل اسم المنتج" })}
                      className=' text-right text-[#000] !text-[16px] border-2 shadow-sm border-[#6d38ffc4] Playpen placeholder:py-3 placeholder:text-[#6d38ffc4] placeholder:text-right ' type="text" placeholder="اسم المنتج" />
                    {errors.productName && (<span className="text-red-500 text-right text-sm">{errors.productName.message}</span>)}
                  </div>

                  <div className='flex flex-col'>
                    <Input
                      {...register("productPrice" , { required: "ادخل سعر المنتج" })}
                      className=' text-right text-[#000] !text-[16px] border-2 shadow-sm border-[#6d38ffc4] Playpen placeholder:py-3 placeholder:text-[#6d38ffc4] placeholder:text-right ' type="number" placeholder="سعر المنتج" />
                    {errors.productPrice && (<span className="text-red-500 text-right text-sm">{errors.productPrice.message}</span>)}
                  </div>

                  {/* قسم المجموعات (تم إضافة flex-wrap) */}
                  <div className='flex flex-col '>
                    
                    <div className='flex flex-wrap gap-3 md:gap-5 !text-[16px] text-[#6d38ffc4] font-normal Playpen p-[10px] md:p-[5px] rounded-md border-2 shadow-sm border-[#6d38ffc4] justify-center md:justify-end pr-2'>
                    <p className='w-full text-center md:w-auto md:text-right mb-2 md:mb-0'>: اختر المجموعه</p>
                      {categories.map((cat) => (
                        <label key={cat} className="flex gap-2 items-center cursor-pointer">
                          <input
                            type="checkbox"
                            value={cat}
                            {...register("productCategory", {
                              validate: (value) => value && value.length > 0 || "اختار تصنيف واحد على الأقل"
                            })}
                          />
                          {cat}
                        </label>
                      ))}
                      
                    </div>
                    {errors.productCategory && (<span className="text-red-500 text-right text-sm">{errors.productCategory.message}</span>)}
                  </div>

                  {/* قسم بناء المتغيرات (تم تعديل التصميم ليتناسب مع الهاتف) */}
                  <div className='flex flex-col gap-3 p-3 md:p-4 border-2 border-[#6d38ffc4] border-dashed rounded-xl'>
                    <p className='text-center md:text-right text-[#6E38FF] font-bold Playpen'>تفاصيل المخزن (الألوان والمقاسات)</p>
                    
                    <div className='flex flex-col md:flex-row gap-2 items-center w-full'>
                      <div className='flex w-full gap-2'>
                        <Input 
                          value={tempQty} onChange={(e) => setTempQty(e.target.value === "" ? "" : Number(e.target.value))} 
                          className='text-center text-[#000] border-[#6d38ffc4] w-1/2 placeholder:text-[#6d38ffc4]' type="number" placeholder="الكمية" />
                        <Input 
                          value={tempSize} onChange={(e) => setTempSize(e.target.value)} 
                          className='text-center text-[#000] border-[#6d38ffc4] w-1/2 placeholder:text-[#6d38ffc4]' type="text" placeholder="المقاس" />
                      </div>
                      
                      <div className='flex w-full gap-2'>
                        <Input 
                          value={tempColor} onChange={(e) => setTempColor(e.target.value)} 
                          className='text-center text-[#000] border-[#6d38ffc4] flex-1 placeholder:text-[#6d38ffc4]' type="text" placeholder="اللون" />
                        <button type="button" onClick={addVariant} className='bg-[#6E38FF] text-white p-2 w-[50px] flex justify-center items-center rounded-lg hover:bg-[#5a2de0] duration-300'>
                          <ListPlus size={24} />
                        </button>
                      </div>
                    </div>

                    {/* عرض المتغيرات */}
                    {variants.length > 0 && (
                      <div className='flex flex-col gap-2 mt-3'>
                        {variants.map((v) => (
                          <div key={v.id} className='flex justify-between items-center bg-[#f0ecff] p-2 rounded-md px-3 border border-[#d6ccff]'>
                            <button type="button" onClick={() => removeVariant(v.id)} className='text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow-sm'><X size={16} /></button>
                            <div className='flex flex-wrap justify-end gap-2 text-[#6E38FF] Playpen font-medium text-[13px] md:text-[15px]'>
                              <span>الكمية: {v.quantity}</span>
                              <span className="hidden md:inline">|</span>
                              <span>المقاس: {v.size}</span>
                              <span className="hidden md:inline">|</span>
                              <span>اللون: {v.color}</span>
                            </div>
                          </div>
                        ))}
                        <div className='text-center md:text-right text-[14px] text-gray-500 mt-1 Playpen'>
                          إجمالي الكمية: {variants.reduce((acc, curr) => acc + curr.quantity, 0)} قطعة
                        </div>
                      </div>
                    )}
                  </div>

                  <div className='flex flex-col'>
                    <textarea
                      {...register("productDescription" , { required: "ادخل وصف عن المنتج" })}
                      className=' text-right rounded-xl p-3 text-[#000] !text-[16px] border-2 shadow-sm border-[#6d38ffc4] Playpen placeholder:text-[#6d38ffc4] placeholder:text-right min-h-[100px]' placeholder="وصف عن المنتج" />
                    {errors.productDescription && (<span className="text-red-500 text-right text-sm">{errors.productDescription.message}</span>)}
                  </div>

                  <div className='flex flex-col'>
                    <fieldset className="fieldset border p-3 rounded-xl border-[#6d38ffc4]">
                      <legend className="fieldset-legend Playpen text-[#6E38FF] text-[14px] text-center px-2">اختار الصور</legend>
                      <input 
                        {...register("productImages" , { required: "ادخل صور المنتج" })}
                        multiple accept='image/*' type="file" className="file-input w-full text-sm" />
                    </fieldset>
                    {errors.productImages && (<span className="text-red-500 text-right text-sm mt-1">{errors.productImages.message}</span>)}
                  </div>
                  
                  <button type='submit' className='Playpen mt-4 w-fit mx-auto py-3 cursor-pointer border-2 hover:text-[#6d38ff] hover:bg-white hover:border-[#6d38ff] duration-400 px-12 rounded-xl bg-[#6d38ff] text-white font-bold'> إضافة المنتج</button>
                </form>
              </DialogDescription>
            </DialogHeader>
          </>}
        </DialogContent>
      </Dialog>
    </>
  )
}