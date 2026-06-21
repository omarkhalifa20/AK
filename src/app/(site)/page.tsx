"use server"
import { getProducts } from "@/Action/GetProducts";
import { getWishlist } from "@/Action/Wishlist";
import AboutComp from "@/components/About/AboutComp";
import CategoriesHome from "@/components/Categories/CategoriesHome";
import ContactsHome from "@/components/Contacts/ContactsHome";
import HomeComp from "@/components/Home/HomeComp";
import MarqueeComp from "@/components/Marquee/MarqueeComp";
import ProductHome from "@/components/Products/ProductHome";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form"

export default async function Home() {
  const [products, wishlist] = await Promise.all([
    getProducts(),
    getWishlist()
    
  ]);
 
  return (
    <>
     <HomeComp/>
     <MarqueeComp/>
     <AboutComp/>
     <MarqueeComp/>
     <CategoriesHome/>
     <MarqueeComp/>
     <ProductHome initialProducts={products || []} 
        initialWishlist={wishlist || []}/>
     <ContactsHome/>
    </>
  );
}
