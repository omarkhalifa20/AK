"use client"
import { CircleUserRound, Heart, Menu, ShoppingBag, User, UserRound } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useAuth } from '@/app/(site)/(auth)/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { Wishlistmod } from '@/Types/Wishlistmod';
import { CartMod } from '@/Types/Cartmod';
import { useStore } from '@/useStore';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface ProductHomeProps {
  initialCart: CartMod[];
  initialWishlist: Wishlistmod[];
}

export default function NavbarComp({ initialCart, initialWishlist }: ProductHomeProps) {
  const { cartCount, wishlistCount, setInitialCounts } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const { user, userName, role } = useAuth(); 
  
  const path = ["/product" , "/cart" , "/wishlist" , "/login" , "/register" , "/emailconfirm" , "/mens" ,"/womens","/olds","/childs"]
  
  useEffect(() => {
    if (user) {
      setInitialCounts(initialCart.length, initialWishlist.length);
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
      setInitialCounts(guestCart.length, guestWishlist.length);
    }
  }, [user, initialCart.length, initialWishlist.length, setInitialCounts]);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100 || path.some(p => pathname.startsWith(p))) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    handleScroll()
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname, path]);

  const handleScrollTo = (e: React.MouseEvent<HTMLButtonElement>, targetId: string) => {
    e.preventDefault();
    
    if (pathname !== '/') {
      router.push(`/#${targetId}`);
      return;
    }

    const element = document.getElementById(targetId);
    if (element) {
      const navbarHeight = 90; 
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: "smooth"
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <>
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 1.7,
        ease: "easeOut",
      }}
      className='container mx-auto z-[9999] fixed top-0 lg:px-6 left-[50%] translate-x-[-50%] w-[90%]'>
    <nav className={`${scrolled ? "w-full Orbitron hidden lg:flex scale-[1] mx-auto  items-center justify-between transition-all duration-500 ease-out transform bg-[#0000009a] px-5 rounded-b-3xl" :"w-full Orbitron hidden lg:flex transition-all duration-500 ease-out transform scale-[0.99] mx-auto  items-center xl:px-5 justify-between"}`}>
    <div className="text-white text-xl lg:text-2xl font-bold"><Link href='/'>AK STORE</Link></div>
      <div className={`${scrolled ? 
  'flex text-[12px] lg:text-[14px] font-bold items-center justify-center px-4 lg:px-13 py-4 pt-5 scale-100 gap-3 md:gap-5 lg:gap-9' :
  'flex text-[12px] lg:text-[14px] font-bold items-center justify-center px-4 lg:px-13 rounded-b-[30px] py-4 pt-5 bg-[#0000009a] gap-3 md:gap-5 lg:gap-9'
}`}>
        <Link href="/" className=" text-white cursor-pointer hover:opacity-80 transition-opacity ">Home</Link>
        <button onClick={(e) => handleScrollTo(e, 'about')} className="text-white cursor-pointer hover:opacity-80 transition-opacity">About</button>
        <button onClick={(e) => handleScrollTo(e, 'products')} className="text-white cursor-pointer hover:opacity-80 transition-opacity">Products</button>
        <button onClick={(e) => handleScrollTo(e, 'groups')} className="text-white cursor-pointer hover:opacity-80 transition-opacity">Groups</button>
        <button onClick={(e) => handleScrollTo(e, 'contact')} className="text-white cursor-pointer hover:opacity-80 transition-opacity">Contact</button>
      </div>
      <div className='flex gap-5 text-white'>
        <div className='relative'>
          <Link href="/cart" className="text-white "><ShoppingBag /></Link>
          <span className='Marhey absolute top-[-6] right-[-10] text-[11px] bg-[#ffffff] text-black rounded-full font-medium px-1 '>{cartCount}</span>
        </div>
        <div className='relative' >
          <Link href="/wishlist" className="text-white "><Heart /></Link>
          <span className='Marhey absolute top-[-6] right-[-10] text-[11px] bg-[#ffffff] text-black rounded-full font-medium px-1 '>{wishlistCount}</span>
        </div>
      
      <Popover>  
          <PopoverTrigger className='cursor-pointer w-fit rounded-md'><UserRound className='w-[20px] md:w-[32px]' /></PopoverTrigger>
          <PopoverContent className='p-2 w-45 md:w-50 mt-5 mr-4'> 
            {user ? (
              <>
                <div className='flex Orbitron flex-col z-50 mb-2 p-2 rounded-lg border border-[#999999] bg-[#ececec41] items-center'>
                  <CircleUserRound className='mb-2' />
                  <p className='text-[12px] md:text-[16px] text-center font-medium'>Hi ! <br /> {userName.split(" ").slice(0,2).join(" ") }</p>
                </div>
               
                <div className='flex flex-col Orbitron font-medium gap-2'>
                  
                  {/* هنا الشرط اللي بيخلي الزرار يظهر للأدمن بس */}
                  {role === 'admin' && (
                    <Link href='/dashboard' className='block text-center cursor-pointer text-[12px] md:text-[14px] py-1 bg-transparent border border-[#999999] hover:bg-[#f1f1f1] hover:text-black duration-400 rounded-lg'>
                      Dashboard
                    </Link>
                  )}

                  <button onClick={handleLogout} className='cursor-pointer text-center text-[12px] md:text-[14px] py-1 bg-transparent border border-[#999999] hover:bg-[#f1f1f1] hover:text-black duration-400 rounded-lg'>
                    LogOut
                  </button>
                </div>
              </>
            ) : (
              <div className='flex flex-col Orbitron font-medium gap-2'>
                <Link href='/login' className='block py-1 text-[12px] md:text-[14px] bg-transparent border text-center border-[#999999] hover:bg-[#f1f1f1] hover:text-black duration-400 rounded-lg'>
                  LogIn
                </Link>
                <Link href='/register' className='block py-1 text-[12px] md:text-[14px] bg-transparent text-center border border-[#999999] hover:bg-[#f1f1f1] hover:text-black duration-400 rounded-lg'>
                  Register
                </Link>
              </div>
            )}
          </PopoverContent>
        </Popover>
   
      </div>
    </nav>

    <nav className="w-full Orbitron py-3 lg:hidden flex scale-[1] mx-auto items-center justify-between transition-all duration-500 ease-out transform bg-[#0000009a] px-5 rounded-b-3xl">
  <div className="text-white text-xl lg:text-2xl font-bold"><Link href='/'>AK STORE</Link></div>
  
  <div className="flex gap-5 text-white items-center">
    
    {user ? (
      <>
        <div className="relative">
          <Link href="/cart" className="text-white">
            <ShoppingBag />
          </Link>
          <span className="Marhey absolute top-[-6] right-[-10] text-[11px] bg-[#ffffff] text-black rounded-full font-medium px-1">
            {cartCount}
          </span>
        </div>
        <div className="relative">
          <Link href="/wishlist" className="text-white">
            <Heart />
          </Link>
          <span className="Marhey absolute top-[-6] right-[-10] text-[11px] bg-[#ffffff] text-black rounded-full font-medium px-1">
            {wishlistCount}
          </span>
        </div>
      </>
    ) : (
      <Popover>
        <PopoverTrigger className="cursor-pointer w-fit rounded-md">
          <UserRound className="w-[20px] md:w-[32px]" />
        </PopoverTrigger>
        <PopoverContent className="p-2 w-45 md:w-50 mt-5 mr-4 z-50">
          <div className="flex flex-col Orbitron font-medium gap-2">
            <Link href="/login" className="block py-1 text-[12px] md:text-[14px] bg-transparent border text-center border-[#999999] hover:bg-[#f1f1f1] hover:text-black duration-400 rounded-lg">
              LogIn
            </Link>
            <Link href="/register" className="block py-1 text-[12px] md:text-[14px] bg-transparent text-center border border-[#999999] hover:bg-[#f1f1f1] hover:text-black duration-400 rounded-lg">
              Register
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    )}
    <Sheet>
      <SheetTrigger>
        <Menu color="#ffff" />
      </SheetTrigger>
      <SheetContent className="z-[9999999] Orbitron text-center">
        <SheetHeader>
          <SheetTitle className="text-[24px]">AK STORE</SheetTitle>
          <SheetDescription className="text-[12px]">YOUR FAV STORE</SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col text-[14px] text-black font-bold items-center justify-center px-4 lg:px-13 py-4 pt-5 scale-100 gap-9">
          <Link href="/" className="hover:bg-black duration-300 hover:text-white border border-black w-full py-1 rounded-lg cursor-pointer transition-opacity">Home</Link>
          <button onClick={(e) => handleScrollTo(e, 'about')} className="hover:bg-black duration-300 hover:text-white border border-black w-full py-1 rounded-lg cursor-pointer transition-opacity">About</button>
          <button onClick={(e) => handleScrollTo(e, 'products')} className="hover:bg-black duration-300 hover:text-white border border-black w-full py-1 rounded-lg cursor-pointer transition-opacity">Products</button>
          <button onClick={(e) => handleScrollTo(e, 'groups')} className="hover:bg-black duration-300 hover:text-white border border-black w-full py-1 rounded-lg cursor-pointer transition-opacity">Groups</button>
          <button onClick={(e) => handleScrollTo(e, 'contact')} className="hover:bg-black duration-300 hover:text-white border border-black w-full py-1 rounded-lg cursor-pointer transition-opacity">Contact</button>
        </div>

        <div className="flex gap-5 justify-center items-center mt-7 text-black">
          {!user ? (
            <>
              <div className="relative">
                <Link href="/cart" className="">
                  <ShoppingBag />
                </Link>
                <span className="Marhey absolute top-[-6] right-[-10] text-[11px] bg-[#d4d4d4] text-black rounded-full font-medium px-1">
                  {cartCount}
                </span>
              </div>
              <div className="relative">
                <Link href="/wishlist" className="">
                  <Heart />
                </Link>
                <span className="Marhey absolute top-[-6] right-[-10] text-[11px] bg-[#cfcfcf] text-black rounded-full font-medium px-1">
                  {wishlistCount}
                </span>
              </div>
            </>
          ) : (
            <Popover>
              <PopoverTrigger className="cursor-pointer w-fit rounded-md">
                <UserRound className="w-[20px] md:w-[32px]" />
              </PopoverTrigger>
              <PopoverContent className="p-2 z-[99999999] w-45 md:w-50 mt-5 mr-4">
                <div className="flex Orbitron flex-col z-50 mb-2 p-2 rounded-lg border border-[#999999] bg-[#ececec41] items-center">
                  <CircleUserRound className="mb-2" />
                  <p className="text-[12px] md:text-[16px] text-center font-medium">
                    Hi ! <br /> {userName?.split(" ").slice(0, 2).join(" ")}
                  </p>
                </div>

                <div className="flex flex-col Orbitron font-medium gap-2">
                  {role === 'admin' && (
                    <Link href="/dashboard" className="block text-center cursor-pointer text-[12px] md:text-[14px] py-1 bg-transparent border border-[#999999] hover:bg-[#f1f1f1] hover:text-black duration-400 rounded-lg">
                      Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="cursor-pointer text-center text-[12px] md:text-[14px] py-1 bg-transparent border border-[#999999] hover:bg-[#f1f1f1] hover:text-black duration-400 rounded-lg">
                    LogOut
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

      </SheetContent>
    </Sheet>
  </div>
</nav>

    </motion.div>
    
    </>
  )
}