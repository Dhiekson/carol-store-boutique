
import { Database } from './schema';

export type ProfileType = Database['public']['Tables']['profiles']['Row'];
export type ProductType = Database['public']['Tables']['products']['Row'];
export type CategoryType = Database['public']['Tables']['categories']['Row'];
export type OrderType = Database['public']['Tables']['orders']['Row'];
export type OrderItemType = Database['public']['Tables']['order_items']['Row'];
export type ShippingMethodType = Database['public']['Tables']['shipping_methods']['Row'];
export type ShoppingCartType = Database['public']['Tables']['shopping_cart']['Row'];
export type ContactMessageType = Database['public']['Tables']['contact_messages']['Row'];

export type ShoppingCartWithProduct = ShoppingCartType & {
  product: ProductType;
};

export type OrderWithItems = OrderType & {
  items: (OrderItemType & {
    product: ProductType;
  })[];
};
