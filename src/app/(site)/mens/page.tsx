
import { getProducts } from '@/Action/GetProducts'
import MensMain from '@/components/Categories/MensMain';
import React from 'react'

export default async function page() {
  const mensdata = await getProducts("mens")
  console.log(mensdata);
  
  return (
    <>
    <MensMain products={mensdata} />
    </>
  )
}
