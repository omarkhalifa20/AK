export interface DashboardOrder {
    id: string;
    user_id: string;
    product_id: string;
    ProductName: string;
    description: string | null;
    price_per_unit: number;
    images: string[];
    quantity: number;
    PersonName: string;
    subtotal: number;
    total_amount: number;
    Productsdetails: { color: string; size: string }[];
    PersonAddress: string;
    PersonNumber: number;
    PersonNumber2: number | null;
    created_at: string;
    Products?: { status: string };
  }