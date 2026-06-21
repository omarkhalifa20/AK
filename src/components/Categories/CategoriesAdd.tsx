import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Plus } from 'lucide-react'
export default function CategoriesAdd() {
    
  return (
    <>
<Dialog>
  <DialogTrigger className='flex items-center py-1 px-4 rounded-xl  text-[#ffffff] bg-linear-to-r from-[#6E38FF] to-[#AF38FF] katibeh text-[22px] gap-2 cursor-pointer justify-center'><Plus size={20}  /> <p className='mb-2'>اضافه مجموعه </p></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
    </>
  )
}
