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
import { SquarePen, X, ListPlus } from 'lucide-react'
import Loader from '../Loader/Loader' 
import { Productmod } from '@/Types/Productmod' // تأكد من اسم الـ Type (خليته ProductMod زي ما عملناه)
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { updateProduct } from '@/Action/GetProducts'

type Inputs = {
  productName: string
  productPrice: number
  productCategory: string[]
  productDescription: string 
  productImages: FileList
}

// نفس نوع الـ Variant اللي عملناه في الإضافة
type Variant = {
  id: string;
  color: string;
  size: string;
  quantity: number;
}

export default function ProductsEdit({ product }: { product: Productmod }) {
  const router = useRouter()
  const categories = ["mens", "womens", "childs", "olds"]

  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false) 

  const [variants, setVariants] = useState<Variant[]>(product.variants || [])
  const [tempColor, setTempColor] = useState("")
  const [tempSize, setTempSize] = useState("")
  const [tempQty, setTempQty] = useState<number | "">("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      productName: product.name,
      productPrice: product.price,
      productCategory: product.category,
      productDescription: product.description || "",
    }
  })

  // دوال التحكم في المتغيرات
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

    try {
      const formData = new FormData()
      
      // حساب الكمية الإجمالية الجديدة من المتغيرات
      const totalQuantity = variants.reduce((acc, curr) => acc + curr.quantity, 0)

      formData.append("id", product.id)
      formData.append("name", data.productName)
      formData.append("price", data.productPrice.toString())
      formData.append("quantity", totalQuantity.toString()) // بنبعت الكمية المحسوبة
      formData.append("description", data.productDescription)
      formData.append("category", JSON.stringify(data.productCategory))
      
      // بنبعت المتغيرات الجديدة للـ الأكشن باسم inventory
      formData.append("variants", JSON.stringify(variants))
      
      formData.append("oldImages", JSON.stringify(product.images))

      const files = data.productImages as FileList
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          formData.append("newImages", files[i])
        }
      }

      const result = await updateProduct(formData)

      if (result.success) {
        toast.success(result.message)
        setIsOpen(false)
        router.refresh()
      } else {
        toast.error(result.message || "فشل في تحديث المنتج")
      }
    } catch (error) {
      console.error("Submission error:", error)
      toast.error("حدث خطأ غير متوقع")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className='bg-orange-400 hover:bg-[#e98c00] duration-300 cursor-pointer p-1 rounded-md text-[#000]'>
          <SquarePen size={21} />
        </button>
      </DialogTrigger>

      <DialogContent className='!max-w-[65%] !min-h-[75%] !max-h-[98vh] overflow-y-auto !rounded-4xl'>
        {loading ? <Loader /> : <>
          <DialogHeader>
            <DialogTitle className='text-center katibeh text-[24px] mb-6 text-[#e98c00]'>تعديل المنتج</DialogTitle>
            <DialogDescription asChild>
              <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 '>
                
                <div className='flex flex-col'>
                  <Input
                    {...register("productName", { required: "ادخل اسم المنتج" })}
                    className=' text-right text-[#000] !text-[16px] border-2 shadow-sm border-[#e98c00] Playpen placeholder:py-3 placeholder:text-[#e98c00] placeholder:text-right ' type="text" placeholder="اسم المنتج" />
                  {errors.productName && (<span className="text-red-500 text-right text-sm">{errors.productName.message}</span>)}
                </div>

                <div className='flex flex-col'>
                  <Input
                    {...register("productPrice", { required: "ادخل سعر المنتج" })}
                    className=' text-right text-[#000] !text-[16px] border-2 shadow-sm border-[#e98c00] Playpen placeholder:py-3 placeholder:text-[#e98c00] placeholder:text-right ' type="number" placeholder="سعر المنتج" />
                  {errors.productPrice && (<span className="text-red-500 text-right text-sm">{errors.productPrice.message}</span>)}
                </div>

                <div className='flex flex-col '>
                  <div className='flex gap-5 !text-[16px] text-[#e98c00] font-normal Playpen p-[5px] rounded-md border-2 shadow-sm border-[#e98c00] justify-end pr-2'>
                    {categories.map((cat) => (
                      <label key={cat} className="flex gap-2 items-center">
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
                    <p className=''>: اختر المجموعه</p>
                  </div>
                  {errors.productCategory && (<span className="text-red-500 text-right text-sm">{errors.productCategory.message}</span>)}
                </div>

                {/* ----------------- قسم التعديل على المخزن ----------------- */}
                <div className='flex flex-col gap-3 p-4 border-2 border-[#e98c00] border-dashed rounded-xl'>
                  <p className='text-right text-[#e98c00] font-bold Playpen'>تفاصيل المخزن (الألوان والمقاسات)</p>
                  
                  <div className='flex gap-2 items-center'>
                    <button type="button" onClick={addVariant} className='bg-[#e98c00] text-white p-2 rounded-lg hover:bg-[#cc7a00] duration-300'>
                      <ListPlus size={24} />
                    </button>
                    <Input 
                      value={tempQty} onChange={(e) => setTempQty(e.target.value === "" ? "" : Number(e.target.value))} 
                      className='text-center text-[#000] border-[#e98c00] flex-1 placeholder:text-[#e98c00]' type="number" placeholder="الكمية" />
                    <Input 
                      value={tempSize} onChange={(e) => setTempSize(e.target.value)} 
                      className='text-center text-[#000] border-[#e98c00] flex-1 placeholder:text-[#e98c00]' type="text" placeholder="المقاس (مثال: M)" />
                    <Input 
                      value={tempColor} onChange={(e) => setTempColor(e.target.value)} 
                      className='text-center text-[#000] border-[#e98c00] flex-1 placeholder:text-[#e98c00]' type="text" placeholder="اللون (مثال: أحمر)" />
                  </div>

                  {variants.length > 0 && (
                    <div className='flex flex-col gap-2 mt-3'>
                      {variants.map((v) => (
                        <div key={v.id} className='flex justify-between items-center bg-[#fff8ef] p-2 rounded-md px-4 border border-[#ffd28f]'>
                          <button type="button" onClick={() => removeVariant(v.id)} className='text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow-sm'><X size={16} /></button>
                          <div className='flex gap-4 text-[#e98c00] Playpen font-medium text-[15px]'>
                            <span>الكمية: {v.quantity}</span>
                            <span>|</span>
                            <span>المقاس: {v.size}</span>
                            <span>|</span>
                            <span>اللون: {v.color}</span>
                          </div>
                        </div>
                      ))}
                      <div className='text-right text-[14px] text-gray-500 mt-1 Playpen'>
                        إجمالي الكمية: {variants.reduce((acc, curr) => acc + curr.quantity, 0)} قطعة
                      </div>
                    </div>
                  )}
                </div>
                {/* ------------------------------------------------------------------------- */}

                <div className='flex flex-col'>
                  <textarea
                    {...register("productDescription", { required: "ادخل وصف عن المنتج" })}
                    className=' text-right rounded-xl p-3 text-[#000] !text-[16px] border-2 shadow-sm border-[#e98c00] Playpen placeholder:text-[#e98c00] placeholder:text-right ' placeholder="وصف عن المنتج" />
                  {errors.productDescription && (<span className="text-red-500 text-right text-sm">{errors.productDescription.message}</span>)}
                </div>

                <div className='flex flex-col'>
                  <fieldset className="fieldset ">
                    <legend className="fieldset-legend Playpen text-[#e98c00] text-[14px] text-center">صور المنتج (اتركه فارغاً للاحتفاظ بالصور القديمة)</legend>
                    <input
                      {...register("productImages")}
                      multiple accept='image/*' type="file" className="file-input w-full border-2 rounded-xl border-[#e98c00]" />
                    <label className="label text-[#e98c00] ">Max size 50MB</label>
                  </fieldset>
                </div>

                <button type='submit' className='Playpen w-fit mx-auto py-3 cursor-pointer border-2 hover:text-[#e98c00] hover:bg-white hover:border-[#e98c00] duration-400 px-12 rounded-xl bg-[#e98c00] text-white font-bold'> حفظ التعديلات</button>
              </form>
            </DialogDescription>
          </DialogHeader>
        </>}
      </DialogContent>
    </Dialog>
  )
}