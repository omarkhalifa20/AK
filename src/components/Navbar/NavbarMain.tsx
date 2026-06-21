"use server"
import { getProducts } from '@/Action/GetProducts';
import { getWishlist } from '@/Action/Wishlist';
import React from 'react'
import NavbarComp from './NavbarComp';
import { getCart } from '@/Action/Cart';

export default async function NavbarMain() {
    const [cart, wishlist] = await Promise.all([
        getCart(),
        getWishlist()
      ]);
  return (
    <>
      <NavbarComp initialCart={cart || []} initialWishlist={wishlist || []} />
    </>
  )
}
