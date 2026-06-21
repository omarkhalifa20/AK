export interface ProductVariant {
  id: string;
  color: string;
  size: string;
  quantity: number;
}

export interface Productmod {
  id: string; 
  created_at: string; 
  name: string; 
  description: string | null; 
  price: number; 
  quantity: number; 
  images: string[]; 
  variants: ProductVariant[]; 
  category: string[]; 
  status: string; 
}