"use server"
import { revalidatePath } from 'next/cache';
import { createClient } from "@/lib/server";
import { Productmod } from "@/Types/Productmod"


export async function AddToWishlist(product: Productmod , userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("Wishlist").insert({
        user_id: userId,
        product_id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        images: product.images,
        
    }) 
    
    if (error) {
        console.error("Error adding to cart:", error)
        return { success: false, error: error.message } 
    }
    
    return { success: true, data }

}




export async function getWishlist() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return []; 
   
    const { data , error } = await supabase
        .from("Wishlist")
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

export async function removeFromWishlist(cartItemId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { success: false, message: 'Unauthorized' };
   
    const { error } = await supabase
        .from("Wishlist")
        .delete()
        .eq('id', cartItemId)
        .eq('user_id', user.id); 
    
    if (error) {
        console.error("Error deleting from Wishlist:", error);
        return { success: false, message: error.message };
    }
    
    
    revalidatePath('/wishlist'); 
    return { success: true };
}