
import React, { useState, useMemo, useEffect } from 'react';
import { Product, CartItem, Category } from './types';
import { PRODUCTS as INITIAL_PRODUCTS } from './constants';
import ProductCard from './components/ProductCard';
import AIChatAssistant from './components/AIChatAssistant';
import Cart from './components/Cart';
import AddProductModal from './components/AddProductModal';

// নতুন নাম অনুযায়ী স্টোরেজ কি পরিবর্তন
const STORAGE_KEY = 'hothat_pawa_v2_products';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved products", e);
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(Category.ALL);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      alert("মেমোরি ফুল হয়ে গেছে! দয়া করে ছোট সাইজের ছবি আপলোড করুন।");
    }
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = activeCategory === Category.ALL || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, products]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    setIsAddModalOpen(false);
    setActiveCategory(Category.ALL); // নতুন পণ্য দেখতে 'All' এ নিয়ে যাওয়া
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const adminWhatsApp = "8801719372423";

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-green-600 text-white px-6 py-3 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 flex items-center gap-2 font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          পণ্যটি সফলভাবে যোগ করা হয়েছে!
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl">হ</div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800">হঠাৎ পাওয়া<span className="text-blue-600">.</span></h1>
          </div>

          <div className="hidden md:flex flex-grow max-w-xl">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="প্রিমিয়াম পণ্য খুঁজুন..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="p-2.5 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-2xl transition-all group"
              title="নতুন পণ্য যোগ করুন"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {totalItems}
                </span>
              )}
            </button>
            <div className="hidden sm:block w-10 h-10 rounded-full bg-slate-200 overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500/50 transition-all">
              <img src="https://picsum.photos/seed/user123/100/100" alt="User" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-10">
        {/* Hero Section */}
        <section className="relative rounded-[2rem] bg-slate-900 overflow-hidden mb-16 p-8 md:p-16 flex flex-col md:flex-row items-center gap-12">
          <div className="relative z-10 flex-grow text-center md:text-left">
            <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase rounded-full mb-6">New Collection 2025</span>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">ভবিষ্যতের কেনাকাটা <br/><span className="text-blue-500 italic">হঠাৎ পাওয়া</span> এখন হাতের মুঠোয়।</h2>
            <p className="text-slate-400 text-lg mb-8 max-w-md">আমাদের নেক্সট-জেন আর্টিফিশিয়াল ইন্টেলিজেন্সের সাহায্যে সেরা প্রিমিয়াম পণ্যগুলো খুঁজে নিন।</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/30">এখনই কিনুন</button>
              <a 
                href={`https://wa.me/${adminWhatsApp}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-bold transition-all backdrop-blur-sm flex items-center gap-2"
              >
                অ্যাডমিনের সাথে কথা বলুন
              </a>
            </div>
          </div>
          <div className="relative w-full max-w-md aspect-square rounded-[3rem] overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-700 hidden lg:block">
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800" 
              alt="Hero" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
          </div>
        </section>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-3 mb-12">
          {Object.values(Category).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-2xl font-semibold transition-all ${activeCategory === cat ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-slate-100'}`}
            >
              {cat === Category.ALL ? 'সব পণ্য' : 
               cat === Category.ELECTRONICS ? 'ইলেকট্রনিক্স' :
               cat === Category.FASHION ? 'ফ্যাশন' :
               cat === Category.HOME ? 'হোম ও লিভিং' : 'আউটডোর'}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <h3 className="text-2xl font-bold text-slate-400">আপনার ফিল্টারের সাথে মিলে এমন কোনো পণ্য পাওয়া যায়নি।</h3>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory(Category.ALL); }}
                className="mt-4 text-blue-600 font-bold hover:underline"
              >
                সব ফিল্টার মুছুন
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
             <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-lg">হ</div>
                <h2 className="text-xl font-black tracking-tight text-slate-800">হঠাৎ পাওয়া<span className="text-blue-600">.</span></h2>
              </div>
              <p className="text-slate-500 max-w-sm mb-8">স্মার্ট এআই এবং প্রিমিয়াম কালেকশনের মাধ্যমে আপনার শপিং অভিজ্ঞতাকে আরও উন্নত করছি।</p>
              <div className="flex gap-4">
                <a href={`https://wa.me/${adminWhatsApp}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-white hover:bg-green-600 transition-colors shadow-lg">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72 1.041 3.44 1.59 5.23 1.59h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
              </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-6 uppercase text-xs tracking-widest">শপ</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="hover:text-blue-600 transition-colors cursor-pointer">ইলেকট্রনিক্স</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">ফ্যাশন</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">হোম ও লিভিং</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">অফার</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-6 uppercase text-xs tracking-widest">সাপোর্ট</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="hover:text-blue-600 transition-colors cursor-pointer">হেল্প সেন্টার</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">শিপিং</li>
              <li onClick={() => window.open(`https://wa.me/${adminWhatsApp}`)} className="hover:text-blue-600 transition-colors cursor-pointer">হোয়াটসঅ্যাপ সাপোর্ট</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">রিটার্ন পলিসি</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-xs">© 2026 হঠাৎ পাওয়া AI. সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex gap-8 text-xs text-slate-400 uppercase tracking-widest font-semibold">
            <span className="hover:text-slate-600 cursor-pointer">প্রাইভেসি</span>
            <span className="hover:text-slate-600 cursor-pointer">টার্মস</span>
            <span className="hover:text-slate-600 cursor-pointer">কুকিজ</span>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/${adminWhatsApp}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-green-500 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 hover:bg-green-600 animate-bounce"
        title="Chat with Admin"
      >
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72 1.041 3.44 1.59 5.23 1.59h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>

      {/* Modals & AI */}
      <AIChatAssistant products={products} />
      
      {isCartOpen && (
        <Cart 
          items={cartItems} 
          onClose={() => setIsCartOpen(false)}
          onRemove={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
        />
      )}

      {isAddModalOpen && (
        <AddProductModal 
          onAdd={handleAddProduct}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
