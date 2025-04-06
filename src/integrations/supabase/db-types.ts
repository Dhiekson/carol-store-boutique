
// Types for Supabase database tables

export interface ProductType {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  stock: number;
  category: string;
  subcategory: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileType {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
  preferences?: {
    notifications?: boolean;
    newsletter?: boolean;
    theme?: string;
  } | null;
}

export interface OrderType {
  id: string;
  user_id: string;
  status: string;
  total: number;
  shipping_fee: number;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip_code: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
  items?: OrderItemType[];
}

export interface OrderItemType {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: ProductType;
}

export interface CategoryType {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ShippingMethodType {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  price_per_kg: number;
  estimated_days: string;
  active: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface CartItemType {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: ProductType;
}

export interface ContactMessageType {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}
