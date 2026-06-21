"use server"
import { getProducts } from '@/Action/GetProducts'
import { getUsersCount } from '@/Action/Getuser'
import { getOrders } from '@/Action/Orders'
import { getWishlist } from '@/Action/Wishlist'
import HomeDash from '@/components/Dashboard/HomeDash'

import { Boxes, Inbox, Shirt, User } from 'lucide-react'
import React from 'react'

export default async function page() {
  const [products, usersCount , waitingOrders, doneOrders] = await Promise.all([
    getProducts(),
    getUsersCount(),
    getOrders("Orders_Waiting"),
    getOrders("Orders_Done")
  ]);
  return (
    <HomeDash waitingOrders={waitingOrders || []}  doneOrders={doneOrders || []} initialProducts={products || []}  usersCount={usersCount} />
  )
}
