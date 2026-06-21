import { getProducts } from '@/Action/GetProducts';
import WomensMain from '@/components/Categories/WomensMain'
import React from 'react'

export default async function page() {
  const Womensdata = await getProducts("mens")
    console.log(Womensdata);
  return (
    <>
    <WomensMain products={Womensdata} />
    </>
  )
}
