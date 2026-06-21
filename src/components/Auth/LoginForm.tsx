"use client"
import { supabase } from '@/lib/supabaseClient'
import { on } from 'events'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Loader2 from '../Loader2/Loader2'
import Loader3 from '../Loader3/Loader3'
import toast from 'react-hot-toast'

type LoginFormValues = {
  email: string
  password: string
}

export default function LoginForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>()

  async function onSubmit(data:LoginFormValues) {
    setLoading(true)
    const { data: userData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
      
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
        <div className='container mx-auto flex items-center justify-center w-[90%] min-h-screen'>
    
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <p className="title">Login </p>
      <p className="message mb-4">Login now and get full access to our app. </p>
     <div className='flex flex-col gap-4 mb-2'>
         <label>
        <input className="input" type="email"  
        {...register("email", { required: "من فضلك ادخل البريد الالكتروني" })} />
        
        <span>Email</span>
        {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
      </label> 
      <label>
        <input className="input" type="password"  
        {...register("password", { required: "من فضلك ادخل كلمه السر" })} />
        <span>Password</span>
        {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>}
      </label>
     </div>
     
      
      <button type='submit' className="submit flex justify-center w-full">{loading? <Loader3/> : "Submit" }</button>
      <p className="signin">You not have account ? <a href="#">SignUp</a> </p>
    </form>
    
        </div>
    
    </>
  )
}
