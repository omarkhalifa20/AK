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

  const baseStyle =
    'flex w-full py-1 justify-end pe-8 text-[18px] items-center gap-5 border-r-4 duration-300'

  const activeStyle =
    'bg-[#3E2A69] text-[#fafa09] border-[#fafa09]'

  const inactiveStyle =
    'text-white border-[#2A1473] hover:text-[#fafa09] hover:bg-[#3E2A69] hover:border-[#fafa09]'

  return (
    <div className="fixed flex flex-col justify-between gap-7 right-0 top-0 bottom-0 py-8 bg-[#2A1473] w-[15%] h-screen">
      <img className="w-[90px] mx-auto" src="/2.png" alt="" />

      <div className="w-full flex gap-6 flex-col items-end">
        <Link
          href="/dashboard"
          className={`${baseStyle} ${
            pathname === '/dashboard' ? activeStyle : inactiveStyle
          }`}
        >
          الرئيسية <House />
        </Link>

        <Link
          href="/dashboard/products"
          className={`${baseStyle} ${
            pathname.startsWith('/dashboard/products')
              ? activeStyle
              : inactiveStyle
          }`}
        >
          اداره المنتجات <Shirt />
        </Link>

        <Link
          href="/dashboard/categories"
          className={`${baseStyle} ${
            pathname.startsWith('/dashboard/categories')
              ? activeStyle
              : inactiveStyle
          }`}
        >
          اداره المجموعات <Boxes />
        </Link>

        <Link
          href="/dashboard/orders"
          className={`${baseStyle} ${
            pathname.startsWith('/dashboard/orders')
              ? activeStyle
              : inactiveStyle
          }`}
        >
          الطلبات <Inbox />
        </Link>

        <Link
          href="/dashboard/users"
          className={`${baseStyle} ${
            pathname.startsWith('/dashboard/users')
              ? activeStyle
              : inactiveStyle
          }`}
        >
          المستخدمين <User />
        </Link>

        <Link
          href="/dashboard/statistics"
          className={`${baseStyle} ${
            pathname.startsWith('/dashboard/statistics')
              ? activeStyle
              : inactiveStyle
          }`}
        >
          الاحصائيات <ChartColumnBig />
        </Link>
      </div>

      <button
        className={`${baseStyle} text-white border-[#2A1473] hover:text-[#fafa09] hover:bg-[#3E2A69] hover:border-[#fafa09]`}
      >
        تسجيل خروج <LogOut />
      </button>
    </div>
  )
}
