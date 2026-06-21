export interface CartMod {
    id: string; // ID الخاص بجدول السلة
    user_id: string; // ID الخاص بالعميل
    product_id: string; // ID الخاص بالمنتج الأصلي
    name: string;
    price: number;
    quantity: number; // الكمية الإجمالية اللي العميل هيطلبها في السلة
    category: string[];
    description: string | null;
    images: string[];
    
    // المصفوفة الشاملة اللي هتقرأ منها السلة (فيها كل الألوان والمقاسات وكمياتها)
    variants: {
      id: string;
      color: string;
      size: string;
      quantity: number;
    }[];
    
    created_at?: string;
  
    // دي عشان الـ Badge بتاع متاح / غير متاح يقرأ من جدول المنتجات الأساسي
    Products?: {
      status: string;
    };
  }