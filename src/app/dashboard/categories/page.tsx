import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import CategoriesAdd from '@/components/Categories/CategoriesAdd'

export default function page() {
  return (
    <>
    <div className='container pt-4 w-[90%] mx-auto '>
      <div className='mb-9'>
      <h3 className='text-center text-[24px] Playpen font-medium pt-5 mb-10'>المجموعات</h3>
       <CategoriesAdd/>
      </div>
      <div className=' border border-[#B8C2CC] rounded-2xl shadow-md overflow-hidden'>
        <Table className='bg-white    '>
      
      <TableHeader className='bg-[#F0F3F6]  '>
        <TableRow >
        <TableHead className="text-center"></TableHead>
          <TableHead className="text-center">عدد المنتجات</TableHead>
          <TableHead className="text-center">الحاله</TableHead>
          <TableHead className="text-center">الوصف</TableHead>
          <TableHead className="text-center">أسم المجموعه</TableHead>
          <TableHead className="text-center">المجموعه</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
      
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="text-center"></TableCell>
          <TableCell className="text-center"></TableCell>
          <TableCell className="text-center"></TableCell>
          <TableCell className="text-center"></TableCell>
          <TableCell className="text-center"></TableCell>
          <TableCell className="text-center"></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
      </div>
      
    </div>
    
    </>
  )
}
