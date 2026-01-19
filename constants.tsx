
import { Product, Category } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'NeoWave Noise Cancelling Headphones',
    description: 'ইন্ডাস্ট্রি-লিডিং নয়েজ ক্যান্সেলেশন প্রযুক্তির সাথে ইমার্সিভ সাউন্ড।',
    price: 35999,
    category: Category.ELECTRONICS,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=500',
    rating: 4.8,
    reviewsCount: 1250,
    tags: ['audio', 'wireless', 'premium']
  },
  {
    id: '2',
    name: 'Lumina Smart Watch Series 5',
    description: 'আপনার স্বাস্থ্য ও ফিটনেস ট্র্যাক করুন এবং চলতে চলতে কানেক্টেড থাকুন।',
    price: 41999,
    category: Category.ELECTRONICS,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=500',
    rating: 4.6,
    reviewsCount: 890,
    tags: ['wearable', 'tech', 'health']
  },
  {
    id: '3',
    name: 'Terra Peak Hiking Backpack',
    description: 'আপনার পরবর্তী অ্যাডভেঞ্চারের জন্য হালকা, টেকসই এবং জলরোধী ব্যাগ।',
    price: 12000,
    category: Category.OUTDOOR,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=500',
    rating: 4.9,
    reviewsCount: 430,
    tags: ['hiking', 'travel', 'rugged']
  },
  {
    id: '4',
    name: 'Suede Minimalist Sneakers',
    description: 'ক্লাসিক আরাম এবং আধুনিক স্ট্রিট স্টাইল এখন প্রতি পদক্ষেপে।',
    price: 10200,
    category: Category.FASHION,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=500',
    rating: 4.5,
    reviewsCount: 2100,
    tags: ['shoes', 'fashion', 'comfortable']
  },
  {
    id: '5',
    name: 'Ceramic Artisan Coffee Set',
    description: 'হস্তশিল্পের ৪টি মগ এবং একটি ম্যাচিং কফি ড্রিপার সেট।',
    price: 7799,
    category: Category.HOME,
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&q=80&w=500',
    rating: 4.7,
    reviewsCount: 156,
    tags: ['kitchen', 'decor', 'artisan']
  },
  {
    id: '6',
    name: 'Quantum Mechanical Keyboard',
    description: 'আল্ট্রা-ফাস্ট ট্যাকটাইল সুইচ সহ RGB ব্যাকলিট মেকানিক্যাল কীবোর্ড।',
    price: 19000,
    category: Category.ELECTRONICS,
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=500',
    rating: 4.8,
    reviewsCount: 742,
    tags: ['gaming', 'peripheral', 'coding']
  },
  {
    id: '7',
    name: 'Bamboo Eco-Friendly Table Lamp',
    description: 'পরিবেশবান্ধব বাঁশ দিয়ে তৈরি আধুনিক ইন্টেরিয়র লাইটিং ডিজাইন।',
    price: 5400,
    category: Category.HOME,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=500',
    rating: 4.4,
    reviewsCount: 88,
    tags: ['lighting', 'sustainable', 'home']
  },
  {
    id: '8',
    name: 'AeroCore Fitness Mat',
    description: 'সর্বোচ্চ সাপোর্ট প্রদানের জন্য অতিরিক্ত পুরু এবং স্লিপ-প্রুফ যোগ ম্যাট।',
    price: 4799,
    category: Category.OUTDOOR,
    image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&q=80&w=500',
    rating: 4.6,
    reviewsCount: 320,
    tags: ['fitness', 'health', 'yoga']
  },
  {
    id: '9',
    name: 'Zen Floating Shelf Decor',
    description: 'ট্রপিক্যাল সবুজের ছোঁয়া ও হাতে তৈরি ফুলের সাথে একটি মার্জিত ভাসমান শেলফ ডেকোর।',
    price: 12000,
    category: Category.HOME,
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=500',
    rating: 5.0,
    reviewsCount: 1,
    tags: ['decor', 'home', 'zen', 'artisan']
  }
];
