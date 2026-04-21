export type Category =
  | 'middle-eastern'
  | 'produce'
  | 'meat'
  | 'dairy-bakery'
  | 'pantry'
  | 'coffee-tea'
  | 'hookah'
  | 'sweets';

export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  category: Category;
  subcategory?: string;
  price: number; // USD
  unit: string; // e.g., "lb", "ea", "16 oz"
  stock: number;
  badges?: string[]; // e.g., "halal", "organic", "imported"
  emoji: string;
  gradient: string; // tailwind gradient classes for card art
  origin?: string;
}

export interface Recipe {
  id: string;
  name: string;
  nameAr?: string;
  cuisine: string;
  description: string;
  servings: number;
  cookTimeMin: number;
  difficulty: 'easy' | 'medium' | 'hard';
  emoji: string;
  gradient: string;
  steps: string[];
  // product ids + quantity text (e.g., "2 cups")
  ingredients: { productId: string; quantity: string; optional?: boolean }[];
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'packing'
  | 'out-for-delivery'
  | 'delivered'
  | 'canceled';

export type DeliveryType = 'next-day' | 'same-day';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  emoji: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  phone: string;
  address: string;
  lat: number;
  lng: number;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  deliveryType: DeliveryType;
  deliveryWindow: string; // e.g., "Tomorrow 9am-12pm"
  status: OrderStatus;
  notes?: string;
  driverId?: string | null;
  createdAt: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  color: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}
