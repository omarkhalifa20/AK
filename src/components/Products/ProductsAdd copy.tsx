"use client"
import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useForm, SubmitHandler } from "react-hook-form"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import {
    NativeSelect,
    NativeSelectOptGroup,
    NativeSelectOption,
  } from "@/components/ui/native-select"
import { Plus, X } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import Loader from '../Loader/Loader'
type Inputs = {
  productName: string
  productPrice: number
  productQuantity: number
  productCategory: string
  productSizes: string[]
  productColors: string[]
  productDescription: string
  productImages: FileList
}

export default function ProductsAdd() {
  const [prodSize, setProdSize] = useState("")
  const [sizes, setSizes] = useState<string[]>([])
  
  console.log(sizes);
  const [prodColor, setProdColor] = useState("")
  const [colors, setColors] = useState<string[]>([])
  console.log(prodColor);
  console.log(colors);
 const [loading, setLoading] = useState(false)

  const addcolor = () => {
    if (!prodColor.trim()) return
    if (colors.includes(prodColor.trim())) return
    setColors(prev=>[...prev, prodColor.trim()])
    setProdColor("")
  }
  
  
  const addsize = () => {
    if (!prodSize.trim()) return
    if (sizes.includes(prodSize.trim())) return
    setSizes(prev=>[...prev, prodSize.trim()])
    setProdSize("")
  }

  const removeSize = (size: string) => { setSizes(prev => prev.filter(s => s !== size)) }
  const removeColor = (color: string) => { setColors(prev => prev.filter(c => c !== color)) }
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<Inputs>()

  
  async function onSubmit(data: Inputs ) {
    const files = data.productImages as FileList
    const imageUrls: string[] = []
    setLoading(true)
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      
      const fileName = `${crypto.randomUUID()}-${file.name}`;
      
      
      const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file)
      
      
      if (error) {
      console.log(error)
      setLoading(false)
      return
     
    } 
    const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(fileName)
    imageUrls.push(urlData.publicUrl)
  }
   await supabase.from("Products").insert({name:data.productName, price:Number(data.productPrice), quantity:Number(data.productQuantity) , category:data.productCategory , size:sizes, color:colors, description:data.productDescription, images:imageUrls})
   
   reset();           
   setSizes([]);      
   setColors([]);   
   setProdSize("");   
   setProdColor("");  

   setLoading(false)
   console.log(data.productCategory)
  }
  return (
    <>
    
<Dialog >
  <DialogTrigger className='flex items-center py-1 px-4 rounded-xl  text-[#ffffff] bg-linear-to-r from-[#6E38FF] to-[#AF38FF] katibeh text-[22px] gap-2 cursor-pointer justify-center'><Plus size={20}  /> <p className='mb-2'>اضافه منتج </p></DialogTrigger>
  
  <DialogContent className='!max-w-[65%] !min-h-[75%] !max-h-[98vh] overflow-y-auto  !rounded-4xl '  >
  {loading ? <Loader /> : <>
    <DialogHeader>
      <DialogTitle className='text-center katibeh text-[24px] mb-6 text-[#6E38FF]'>اضافه المنتج</DialogTitle>
      <DialogDescription>
        <form onSubmit={handleSubmit(onSubmit)}  className='flex flex-col gap-4 '>
          <div className='flex flex-col'>
            <Input 
        
        {...register("productName" , { required: "ادخل اسم المنتج" })}
        className=' text-right text-[#000] !text-[16px] border-2 shadow-sm border-[#6d38ffc4] Playpen   placeholder:py-3 placeholder:text-[#6d38ffc4]   placeholder:text-right ' type="text" placeholder="اسم المنتج" />
         {errors.productName && (<span className="text-red-500 text-right text-sm">{errors.productName.message}</span>)}
          </div>

          <div className='flex flex-col'>
             <Input
        {...register("productPrice" , { required: "ادخل سعر المنتج" })}
         className=' text-right text-[#000] !text-[16px] border-2 shadow-sm border-[#6d38ffc4] Playpen   placeholder:py-3 placeholder:text-[#6d38ffc4]   placeholder:text-right ' type="text" placeholder="سعر المنتج" />
          {errors.productPrice && (<span className="text-red-500 text-right text-sm">{errors.productPrice.message}</span>)}

          </div>
        
          
       


       <div className='flex flex-col'>
       <Input
        {...register("productQuantity" , { required: "ادخل كميه المنتج" })}
         className=' text-right text-[#000] !text-[16px] border-2 shadow-sm border-[#6d38ffc4] Playpen   placeholder:py-3 placeholder:text-[#6d38ffc4]   placeholder:text-right ' type="text" placeholder="كميه المنتج" />
          {errors.productQuantity && (<span className="text-red-500 text-right text-sm">{errors.productQuantity.message}</span>)}

       </div>

       
       <div className='flex flex-col'>
       <NativeSelect
       {...register("productCategory" , { required: "ادخل مجموعه المنتج" })}
       className='!w-full'
       
       >
  <NativeSelectOption value="">اختر المجموعه</NativeSelectOption>
  <NativeSelectOption value="mens">رجالي</NativeSelectOption>
  <NativeSelectOption value="womens">حريمي</NativeSelectOption>
  <NativeSelectOption value="childs">اطفال</NativeSelectOption>
  <NativeSelectOption value="olds">كبار</NativeSelectOption>
</NativeSelect>



          {errors.productCategory && (<span className="text-red-500 text-right text-sm">{errors.productCategory.message}</span>)}

       </div>
          
       <div className='flex flex-col'>
        
       <div className='flex items-center relative'>
       <button type='button' onClick={addsize} className=' left-5 absolute bg-[#6d38ffc4] Playpen text-white py-1 px-4 rounded-2xl z-[50]'>اضافه</button>
       <Input 
        {...register("productSizes" , { required: "ادخل مقاسات المنتج" }) }
        value={prodSize}
        onChange={(e)=>setProdSize(e.target.value)}
        className='  z-10  text-right bg-white   text-[#000] !text-[16px]  border-2 shadow-sm border-[#6d38ffc4] Playpen   placeholder:py-3 placeholder:text-[#6d38ffc4]   placeholder:text-right ' type="text" placeholder="مقاسات المنتج" />
       </div>
        

        
        <div className=' z-0 rounded-b-xl px-5 py-1 pt-2   bg-[#6d38ffc4] w-full flex flex-wrap gap-3  mt-[-7px]  '>
          {sizes.map((size, index)=>(
            <span key={index} className='text-black   rounded-xl px-3 acme gap-2 flex justify-between items-center text-[15px]  bg-[#ffffff70]'>{size} <button type='button' onClick={() => {removeSize(size)}} > <X size={20} color='red' /> </button></span>
          ))}
        </div>
        {errors.productSizes  && (<span className="text-red-500 text-right text-sm">{errors.productSizes.message}</span>)}
       </div>
       
       
       <div className='flex flex-col'>

       <div className='flex items-center relative'>
       <button type='button' onClick={addcolor} className=' left-5 absolute bg-[#6d38ffc4] Playpen text-white py-1 px-4 rounded-2xl z-[50]'>اضافه</button>
         <Input 
        {...register("productColors" , { required: "ادخل الوان المنتج" })}
        value={prodColor}
        onChange={(e)=>setProdColor(e.target.value)}
        className='  z-10  text-right bg-white   text-[#000] !text-[16px]  border-2 shadow-sm border-[#6d38ffc4] Playpen   placeholder:py-3 placeholder:text-[#6d38ffc4]   placeholder:text-right ' type="text" placeholder="ألوان المنتج" />
        
       </div>
         
        <div className=' z-0 rounded-b-xl px-5 py-1 pt-2 gap-3 bg-[#6d38ffc4] w-full flex flex-wrap  mt-[-7px]  '>
          {colors.map((color, index)=>(
            <span key={index} className='text-black  Playpen rounded-xl px-3  gap-2 flex justify-between items-center text-[15px]  bg-[#ffffff70]'>{color} <button type='button' onClick={() => {removeColor(color)}} ><X size={20} color='red' /></button></span>
          ))}
        </div>
        {errors.productColors && (<span className="text-red-500 text-right text-sm">{errors.productColors.message}</span>)}
       </div>
       <div className='flex flex-col'>
       <textarea
        {...register("productDescription" , { required: "ادخل وصف عن المنتج" })}
         className=' text-right rounded-xl p-3  text-[#000] !text-[16px] border-2 shadow-sm border-[#6d38ffc4] Playpen    placeholder:text-[#6d38ffc4]   placeholder:text-right ' placeholder="وصف عن المنتج" />
          {errors.productDescription && (<span className="text-red-500 text-right text-sm">{errors.productDescription.message}</span>)}
       </div>

         <div className='flex flex-col'>
          <fieldset className="fieldset ">
         <legend className="fieldset-legend Playpen text-[#6E38FF] text-[14px] text-center">اختار الصور</legend>
          <input 
         {...register("productImages" , { required: "ادخل صور المنتج" })}
          multiple accept='image/*' type="file" className="file-input w-full border-2 rounded-xl border-[#6d38ffc4]" />
        <label className="label text-[#6E38FF] ">Max size 50MB</label>
        </fieldset>
        {errors.productImages && (<span className="text-red-500 text-right text-sm">{errors.productImages.message}</span>)}
         </div>
        
   <button type='submit' className='Playpen w-fit mx-auto py-3 cursor-pointer border-2 hover:text-[#6d38ff] hover:bg-white hover:border-[#6d38ff] duration-400 px-12 rounded-xl  bg-[#6d38ff] text-white font-bold'> اضافه</button>
        </form>
      
      </DialogDescription>
    </DialogHeader>
  </> }
   
  </DialogContent>
</Dialog>
    </>
  )
}