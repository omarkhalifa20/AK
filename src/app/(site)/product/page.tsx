"use server"
import { getProducts } from '@/Action/GetProducts';
import { getWishlist } from '@/Action/Wishlist';
import ProductHome from '@/components/Products/ProductHome'
import React from 'react'

export default async function page() {
  const [products, wishlist] = await Promise.all([
    getProducts(),
    getWishlist()
  ]);
  return (
    <>
    <ProductHome
  initialProducts={products || []} 
  initialWishlist={wishlist || []}
     />
    </>
  )
}
