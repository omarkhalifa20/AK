"use server"

import { createClient } from "@/lib/server";
import { supabase } from "@/lib/supabaseClient"
import { revalidatePath } from "next/cache";

export async function getProducts(categoryName?: string) {
  let query = supabase.from("Products").select("*");
  
  if (categoryName) {
    
    query = query.contains("category", JSON.stringify([categoryName]));
  }

  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching products:", JSON.stringify(error, null, 2));
    return [];
  }
  
  return data;
}

export async function getProductById(productId: string) { 
    const { data, error } = await supabase
      .from("Products") 
      .select("*")      
      .eq("id", productId) 
      .single()        
  
    if (error) {
      console.error("فشل في جلب المنتج:", error.message)
      return null
    }
  
    return data 
  }

  export async function removeProduct(ProductId: string) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return { success: false, message: 'Unauthorized' };
     
      const { error } = await supabase
          .from("Products")
          .delete()
          .eq('id', ProductId)
          
      
      if (error) {
          console.error("Error deleting from cart:", error);
          return { success: false, message: error.message };
      }
      
      
      revalidatePath('/dashboard/products'); 
      return { success: true };
  }
  
  export async function updateProduct(formData: FormData) {
    const supabaseServer = await createClient(); 
    const { data: { user } } = await supabaseServer.auth.getUser();
  
    if (!user) return { success: false, message: 'Unauthorized' };
  
    const productId = formData.get("id") as string;
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const quantity = Number(formData.get("quantity"));
    const category = JSON.parse(formData.get("category") as string);
    const description = formData.get("description") as string;
    
    const variants = JSON.parse(formData.get("variants") as string);
    
    let imageUrls = JSON.parse(formData.get("oldImages") as string) as string[];
    
    const newImageFiles = formData.getAll("newImages") as File[];
  
    if (newImageFiles && newImageFiles.length > 0 && newImageFiles[0].size > 0) {
      imageUrls = []; 
      
      for (const file of newImageFiles) {
        const fileName = `${crypto.randomUUID()}-${file.name}`;
  
        const { error: uploadError } = await supabaseServer.storage
          .from("product-images")
          .upload(fileName, file);
  
        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          return { success: false, message: 'حدث خطأ أثناء رفع الصور' };
        }
  
        const { data: urlData } = supabaseServer.storage.from("product-images").getPublicUrl(fileName);
        imageUrls.push(urlData.publicUrl);
      }
    }
  
    const { error } = await supabaseServer
      .from("Products")
      .update({
        name,
        price,
        quantity,
        category,
        description,
        images: imageUrls,
        variants 
      })
      .eq('id', productId);
    
  
    if (error) {
      console.error("Error updating product:", error);
      return { success: false, message: error.message };
    }
  
    revalidatePath('/dashboard/products');
    return { success: true, message: 'تم تحديث المنتج بنجاح' };
  }