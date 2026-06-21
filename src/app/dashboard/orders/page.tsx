"use server"

import { getOrders } from '@/Action/Orders';
import OrderDash from '@/components/Dashboard/OrderDash'
import React from 'react'

export default async function page() {
    const [ waitingOrders, doneOrders] = await Promise.all([
      getOrders("Orders_Waiting"),
      getOrders("Orders_Done")
    ]);
  return (
    <>
    <OrderDash waitingOrders={waitingOrders || []}  doneOrders={doneOrders || []} />
    </>
  )
}
