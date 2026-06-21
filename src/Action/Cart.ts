"use server"

import { revalidatePath } from 'next/cache';
import { createClient } from "@/lib/server";
import { Productmod } from "@/Types/Productmod"

export async function AddCart(product: Productmod, userId: string) {
    const supabase = await createClient();

    // مش محتاجين نستخرج ألوان أو مقاسات هنا خلاص
    // هنبعت الـ variants (أو الـ inventory حسب التسمية عندك) زي ما هي
    
    const { data, error } = await supabase.from("Cart").insert({
        user_id: userId,
        product_id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        images: product.images,
        
        // إرسال مصفوفة المتغيرات كاملة لجدول السلة
        // تأكد أن اسم العمود في جدول Cart هو variants أو inventory حسب ما سميته
        variants: product.variants, 
        
        // الكمية الافتراضية
        quantity: 1 
    }); 
    
    if (error) {
        console.error("Error adding to cart:", error);
        return { success: false, error: error.message };
    }
    
    return { success: true, data };
}



export async function getCart() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return []; 
   
    const { data , error } = await supabase
        .from("Cart")
        .select(`
            *,
            Products (
              status
            )
          `)
        .eq('user_id', user.id);
    
    if (error) {
        console.error("Error fetching products:", error);
        return [];
    }
    
    return data;
}



export async function removeFromCart(cartItemId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { success: false, message: 'Unauthorized' };
   
    const { error } = await supabase
        .from("Cart")
        .delete()
        .eq('id', cartItemId)
        .eq('user_id', user.id); 
    
    if (error) {
        console.error("Error deleting from cart:", error);
        return { success: false, message: error.message };
    }
    
    
    revalidatePath('/cart'); 
    return { success: true };
}

export async function clearUserCart() {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { success: false, message: 'Unauthorized' };
   
    const { error } = await supabase
        .from("Cart")
        .delete()
        .eq('user_id', user.id); 
    
    if (error) {
        console.error("Error clearing cart:", error);
        return { success: false, message: error.message };
    }
    
    revalidatePath('/cart'); 
    return { success: true };
}