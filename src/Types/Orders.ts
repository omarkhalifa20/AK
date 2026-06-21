export interface FinalOrder {
    id?: string;
    customer_info: {
      name: string;
      phone: number;
      phone2: number; 
      address: string;
      details: string;
    };
    items: {
      product_id: string;
      product_name: string;
      quantity: number;
      price_per_unit: number;
      subtotal: number;
      image: string;
      details: {
        color: string;
        size: string;
      }[];
    }[];
    total_amount: number;
    order_date: string;
  }