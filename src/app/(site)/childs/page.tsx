import { getProducts } from '@/Action/GetProducts';
import ChildsMain from '@/components/Categories/ChildsMain';
import React from 'react'

export default async function page() {
   const Childsdata = await getProducts("childs")
    console.log(Childsdata);
  return (
    <>
    <ChildsMain products={Childsdata} />
    </>
  )
}
