"use client"
import { supabase } from '@/lib/supabaseClient'
import { on } from 'events'


import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Loader3 from '../Loader3/Loader3'
import toast from 'react-hot-toast'

type RegisterFormValues = {
  name: string
  email: string
  phone: string
  address: string
  password: string
}

export default function RegisterForm() {
    const [loading, setLoading] = useState(false)
  
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>()

  async function onSubmit(data:RegisterFormValues) {
    setLoading(true)
    const { data: userData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          phone: data.phone,
          address: data.address,
        }
      }
    });
   
     
    if (error) {
      console.log("Error signing up:", error.message);
      setLoading(false)
      toast.error(error.message)
      return;
    }
  
    
    router.push("/");
   
  }

  return (
    <>
    <form className="form mt-9" onSubmit={handleSubmit(onSubmit)}>
  <p className="title">Sign Up</p>
  <p className="message mb-4">Sign Up now and get full access to our app. </p>
  
    <label >
      <input {...register("name", { required: "من فضلك ادخل الاسم" })} className="input " type="text"   />
      <span>Full Name</span>
    </label>
    {errors.name && (<span className="text-red-500 text-right text-sm">{errors.name.message}</span>)}
   
 
  <label>
    <input {...register("email", { required: "من فضلك ادخل البريد الالكتروني" })}  className="input" type="email"   />
    <span>Email</span>
  </label> 
  {errors.email && (<span className="text-red-500 text-right text-sm">{errors.email.message}</span>)}

  <label>
    <input {...register("phone", { required: "من فضلك ادخل رقم الهاتف" ,pattern: {
        value: /^(01[0125][0-9]{8}|\+201[0125][0-9]{8})$/,
        message: "رقم الهاتف غير صحيح، يجب أن يكون رقم مصري (مثال: 01012345678 أو 201012345678+)"
      } })} className="input" type="text"   />
    <span>Phone</span>
  </label> 
  {errors.phone && (<span className="text-red-500 text-right text-sm">{errors.phone.message}</span>)}
  <label>
    <input {...register("address", { required: "من فضلك ادخل العنوان" })} className="input" type="text"   />
    <span>Address</span>
  </label> 
  {errors.address && (<span className="text-red-500 text-right text-sm">{errors.address.message}</span>)}

  <label>
    <input {...register("password", { required: "من فضلك ادخل كلمه السر" , pattern: {
        value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف ورقم"
      } } )} className="input" type="password"   />
    <span>Password</span>
  </label>
  {errors.password && (<span className="text-red-500 text-right text-sm">{errors.password.message}</span>)}

  <button type='submit' className="submit flex justify-center w-full">{loading? <Loader3/> : "Submit" }</button>
  <p className="signin">Already have an acount ? <a href="#">Signin</a> </p>
</form>
    
    </>
  )
}
