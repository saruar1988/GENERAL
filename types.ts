
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviewsCount: number;
  tags: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  image?: string; // Base64 image data
  sources?: { web: { uri: string; title: string } }[];
}

export enum Category {
  ALL = 'All',
  ELECTRONICS = 'Electronics',
  FASHION = 'Fashion',
  HOME = 'Home & Living',
  OUTDOOR = 'Outdoor',
}
