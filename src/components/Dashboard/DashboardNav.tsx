'use client'

import {
  Boxes,
  ChartColumnBig,
  House,
  Inbox,
  LogOut,
  Shirt,
  User
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardNav() {
  const pathname = usePathname()

  // تم تعديل التنسيقات لتناسب الهاتف (شريط سفلي) والكمبيوتر (شريط جانبي)
  const baseStyle =
    'flex md:w-full py-2 md:py-1 justify-center md:justify-end md:pe-8 text-[11px] md:text-[18px] flex-col md:flex-row items-center gap-1 md:gap-5 md:border-r-4 duration-300 flex-1 md:flex-none rounded-lg md:rounded-none'

  const activeStyle =
    'bg-[#3E2A69] text-[#fafa09] border-transparent md:border-[#fafa09]'

  const inactiveStyle =
    'text-white border-transparent md:border-[#2A1473] hover:text-[#fafa09] hover:bg-[#3E2A69] hover:border-[#fafa09]'

  return (
    <div className="fixed flex flex-row md:flex-col justify-around md:justify-between md:gap-7 right-0 bottom-0 md:top-0 w-full md:w-[15%] h-[75px] md:h-screen py-2 md:py-8 bg-[#2A1473] z-50 rounded-t-2xl md:rounded-none shadow-[0_-4px_10px_rgba(0,0,0,0.1)] md:shadow-none">
      
      {/* إخفاء اللوجو في الهاتف وإظهاره في الكمبيوتر */}
      <img className="w-[90px] mx-auto hidden md:block" src="/2.png" alt="" />

      <div className="w-full flex md:gap-6 flex-row md:flex-col items-center md:items-end px-2 md:px-0">
        <Link
          href="/dashboard"
          className={`${baseStyle} ${
            pathname === '/dashboard' ? activeStyle : inactiveStyle
          }`}
        >
          <span className="md:hidden block">الرئيسية</span>
          <span className="hidden md:block">الرئيسية</span> <House size={22} />
        </Link>

        <Link
          href="/dashboard/products"
          className={`${baseStyle} ${
            pathname.startsWith('/dashboard/products')
              ? activeStyle
              : inactiveStyle
          }`}
        >
          <span className="md:hidden block">المنتجات</span>
          <span className="hidden md:block">اداره المنتجات</span> <Shirt size={22} />
        </Link>

        <Link
          href="/dashboard/orders"
          className={`${baseStyle} ${
            pathname.startsWith('/dashboard/orders')
              ? activeStyle
              : inactiveStyle
          }`}
        >
          <span className="md:hidden block">الطلبات</span>
          <span className="hidden md:block">الطلبات</span> <Inbox size={22} />
        </Link>

        {/* زر تسجيل الخروج للهاتف داخل نفس الـ div للحفاظ على التوزيع المتساوي */}
        <button
          className={`${baseStyle} md:hidden text-white border-transparent hover:text-[#fafa09] hover:bg-[#3E2A69]`}
        >
          <span>خروج</span> <LogOut size={22} />
        </button>
      </div>

      {/* زر تسجيل الخروج للشاشات الكبيرة */}
      <button
        className={`${baseStyle} hidden md:flex text-white border-[#2A1473] hover:text-[#fafa09] hover:bg-[#3E2A69] hover:border-[#fafa09]`}
      >
        تسجيل خروج <LogOut size={22} />
      </button>
    </div>
  )
}