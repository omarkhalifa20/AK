import { getProducts } from '@/Action/GetProducts';
import OldsMain from '@/components/Categories/OldsMain';
import React from 'react'

export default async function page() {
   const Oldsdata = await getProducts("mens")
    console.log(Oldsdata);
  return (
    <>
    <OldsMain products={Oldsdata} />
    </>
  )
}
