"use server"

import { revalidatePath } from 'next/cache';
import { createClient } from "@/lib/server";
import { Productmod } from "@/Types/Productmod"
import { FinalOrder } from '@/Types/Orders';
import { DashboardOrder } from '@/Types/DashboardOrder';
export interface ProductVariant {
  id?: string;
  size?: string;
  color?: string;
  quantity: number;
}

export interface OrderProductDetail {
  size?: string;
  color?: string;
}


export async function AddOrders(orderData: FinalOrder , userId: string | null , ordersname: string) {
    const supabase = await createClient();
    const ordersToInsert = orderData.items.map((item) => ({
        user_id: userId,
        product_id: item.product_id,
        ProductName: item.product_name,
        description: orderData.customer_info.details || null, 
        price_per_unit: item.price_per_unit,
        images: [item.image], 
        quantity: item.quantity,
        PersonName: orderData.customer_info.name,
        subtotal: item.subtotal,
        total_amount: orderData.total_amount,
        Productsdetails: item.details, 
        PersonAddress: orderData.customer_info.address,
        PersonNumber: Number(orderData.customer_info.phone),
        PersonNumber2: orderData.customer_info.phone2 ? Number(orderData.customer_info.phone2) : null,
    }));
    const { data, error } = await supabase
    .from(ordersname)
    .insert(ordersToInsert); 

if (error) {
    console.error("Error saving orders:", error);
    return { success: false, error: error.message }; 
}

return { success: true, data };

}




export async function getOrders(ordersname: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return []; 
 
  const { data , error } = await supabase
      .from(ordersname)
      .select('*')
     
      .order('created_at', { ascending: false });
  
  if (error) {
      console.error("Error fetching orders:", JSON.stringify(error, null, 2));
      return [];
  }
  
  return data;
}



export async function removeFromOrders(OrdersItemId: string , ordersname: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { success: false, message: 'Unauthorized' };
   
    const { error } = await supabase
        .from(ordersname)
        .delete()
        .eq('id', OrdersItemId)
        .eq('user_id', user.id); 
    
    if (error) {
        console.error("Error deleting from cart:", error);
        return { success: false, message: error.message };
    }
    
    
    revalidatePath('/cart'); 
    return { success: true };
}

async function updateProductStock(
  productId: string, 
  orderQuantity: number, 
  productsDetails: OrderProductDetail[], 
  operation: "decrease" | "increase"
) {
  const supabase = await createClient();

  const { data: product, error: fetchError } = await supabase
    .from("Products")
    .select("quantity, variants")
    .eq("id", productId)
    .single();

  if (fetchError || !product) {
    console.error("Product not found or fetch error:", fetchError);
    return false;
  }

  let newTotalQuantity = Number(product.quantity || 0);
  if (operation === "decrease") {
    newTotalQuantity = Math.max(0, newTotalQuantity - orderQuantity);
  } else {
    newTotalQuantity = newTotalQuantity + orderQuantity;
  }

  let updatedVariants: ProductVariant[] = product.variants 
    ? (product.variants as ProductVariant[]) 
    : [];
  
  const requestedSize = productsDetails?.[0]?.size;
  const requestedColor = productsDetails?.[0]?.color;

  if (requestedSize || requestedColor) {
    updatedVariants = updatedVariants.map((variant: ProductVariant) => { 
      
      if (variant.size === requestedSize && variant.color === requestedColor) {
        let currentVariantQty = Number(variant.quantity || 0);
        
        if (operation === "decrease") {
          currentVariantQty = Math.max(0, currentVariantQty - orderQuantity);
        } else {
          currentVariantQty = currentVariantQty + orderQuantity;
        }

        return { ...variant, quantity: currentVariantQty };
      }
      return variant; 
    });
  }

  const { error: updateError } = await supabase
    .from("Products")
    .update({ 
      quantity: newTotalQuantity, 
      variants: updatedVariants 
    })
    .eq("id", productId);

  if (updateError) {
    console.error("Error updating stock:", updateError.message);
    return false;
  }

  return true;
}



export async function moveOrderToDone(order: DashboardOrder) {
  const supabase = await createClient();
  const targetId = String(order.id);
  
  const orderDataToInsert = { ...order };
  Reflect.deleteProperty(orderDataToInsert, 'Products'); 

  const { error: deleteError } = await supabase
    .from("Orders_Waiting")
    .delete()
    .match({ id: targetId }); 

  if (deleteError) {
    console.error("Delete Error:", deleteError);
    return { success: false, error: "مشكلة في الحذف: " + deleteError.message };
  }

  const { error: insertError } = await supabase
    .from("Orders_Done")
    .insert(orderDataToInsert);

  if (insertError) {
    return { success: false, error: "مشكلة في الإضافة: " + insertError.message };
  }

  await updateProductStock(order.product_id, order.quantity, order.Productsdetails as OrderProductDetail[], "decrease");

  revalidatePath('/dashboard/orders');
  return { success: true };
}


export async function moveOrderToWaiting(order: DashboardOrder) {
  const supabase = await createClient();
  const targetId = String(order.id);
  
  const orderDataToInsert = { ...order };
  Reflect.deleteProperty(orderDataToInsert, 'Products');

  const { error: deleteError } = await supabase
    .from("Orders_Done")
    .delete()
    .match({ id: targetId });

  if (deleteError) return { success: false, error: deleteError.message };

  const { error: insertError } = await supabase
    .from("Orders_Waiting")
    .insert(orderDataToInsert);

  if (insertError) return { success: false, error: insertError.message };

  await updateProductStock(order.product_id, order.quantity, order.Productsdetails as OrderProductDetail[], "increase");

  revalidatePath('/dashboard/orders');
  return { success: true };
}


export async function deleteOrderPermanently(orderId: string, table: "Orders_Waiting" | "Orders_Done") {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from(table)
    .delete()
    .match({ id: String(orderId) });
  
  if (error) return { success: false, error: error.message };

  revalidatePath('/dashboard/orders');
  return { success: true };
}