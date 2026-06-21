export interface ProductVariant {
  id: string;
  color: string;
  size: string;
  quantity: number;
}
export interface Wishlistmod {
    id: string;               
    product_id: string;       
    user_id: string;          
    name: string;             
    description: string;      
    price: number;            
    quantity: number;         
    category: string[];       
    color: string[];          
    size: string[];           
    images: string[];         
    created_at: string; 
    status : string;   
    Products?: {
      status: string;        
  };  
  variants?: ProductVariant[]
  }