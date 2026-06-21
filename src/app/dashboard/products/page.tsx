"use server"
import { getProducts } from '@/Action/GetProducts'
import ProductDash from '@/components/Dashboard/ProductDash'
import React from 'react'


export default async function page() {
  const Products = await getProducts()
  return (
    <>
    <ProductDash Products={Products}/>
    </>
  )
}
