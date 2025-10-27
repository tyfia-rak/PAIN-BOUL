import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Session {
  user: {
    name: string;
    email: string;
    id?: string;
    role?: string;
  };
}

export interface DashboardProps {
  session: Session;
}

// Category and Product types used by the menu page and dashboard
export interface Category {
  idCategory: number;
  nameCategory: string;
  // optional: backend might send slug or description
  slug?: string;
  description?: string;
}

export interface Product {
  idProduct: number;
  name: string;
  price: number;
  image?: string;
  categoryId?: number;
  categoryName?: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Customer {
  idCustomer?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
  productName?: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id?: number;
  customerId?: number;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryTime: string;
  notes?: string;
}
