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
export default function page() {
  return (
    <>
    <div className='container pt-4 w-[90%] mx-auto '>
      <div className='mb-9'>
      <h3 className='text-center text-[24px] Playpen font-medium pt-5 mb-10'>المستخدمين</h3>
       
      </div>
      <div className=' border border-[#B8C2CC] rounded-2xl shadow-md overflow-hidden'>
        <Table className='bg-white    '>
      
      <TableHeader className='bg-[#F0F3F6]  '>
        <TableRow >
        <TableHead className="text-center"></TableHead>
          <TableHead className="text-center">العنوان</TableHead>
          <TableHead className="text-center">رقم الهاتف</TableHead>
          <TableHead className="text-center">البريد الالكتروني</TableHead>
          <TableHead className="text-center">الاسم</TableHead>
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
        </TableRow>
      </TableFooter>
    </Table>
      </div>
      
    </div>
    
    </>
  )
}
