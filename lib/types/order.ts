export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
  name: string;
}

export interface Order {
  id: number;
  customerId: number;
  items: OrderItem[];
  orderDate: string;
  status: string;
  totalAmount: number;
}

export interface OrderCreateDTO {
  customerId: number;
  items: OrderItem[];
  orderDate: string;
  status: string;
  totalAmount: number;
}