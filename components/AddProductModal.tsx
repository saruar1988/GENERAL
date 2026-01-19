
import React, { useState, useRef } from 'react';
import { Product, Category } from '../types';

interface AddProductModalProps {
  onAdd: (product: Product) => void;
  onClose: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: Category.ELECTRONICS,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=500'
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB Limit check
        alert("ছবিটি ১ মেগাবাইটের বেশি বড়! দয়া করে ছোট সাইজের ছবি ব্যবহার করুন।");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData(prev => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      category: formData.category,
      image: formData.image,
      rating: 5.0,
      reviewsCount: 0,
      tags: [formData.category.toLowerCase(), 'new']
    };
    onAdd(newProduct);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">নতুন পণ্য যোগ করুন</h2>
            <p className="text-sm text-slate-500">আপনার শপে নতুন কি আসলো তা সবার সাথে শেয়ার করুন।</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto">
          {/* Image Upload Area */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">পণ্যের ছবি</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer w-full aspect-video bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center overflow-hidden"
            >
              {imagePreview || (formData.image && !formData.image.includes('unsplash')) ? (
                <>
                  <img 
                    src={imagePreview || formData.image} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-sm">
                    ছবি পরিবর্তন করুন
                  </div>
                </>
              ) : (
                <div className="text-center p-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-slate-500 text-xs font-medium">কম্পিউটার থেকে ছবি দিন</p>
                  <p className="text-[10px] text-slate-400 mt-1">সর্বোচ্চ ১ মেগাবাইট (JPG, PNG)</p>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">পণ্যের নাম</label>
            <input 
              required
              type="text" 
              placeholder="যেমন: লেদার মানিব্যাগ"
              className="w-full bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">দাম (টাকা)</label>
              <input 
                required
                type="number" 
                step="0.01"
                placeholder="৫০০"
                className="w-full bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">ক্যাটাগরি</label>
              <select 
                className="w-full bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as Category})}
              >
                {Object.values(Category).filter(c => c !== Category.ALL).map(cat => (
                  <option key={cat} value={cat}>
                    {cat === Category.ELECTRONICS ? 'ইলেকট্রনিক্স' :
                     cat === Category.FASHION ? 'ফ্যাশন' :
                     cat === Category.HOME ? 'হোম ও লিভিং' : 'আউটডোর'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">বিবরণ (Description)</label>
            <textarea 
              required
              placeholder="পণ্যের গুণাগুণ সম্পর্কে কিছু লিখুন..."
              rows={3}
              className="w-full bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 resize-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <details className="cursor-pointer group">
            <summary className="text-[10px] font-bold uppercase tracking-widest text-slate-300 group-hover:text-slate-400 transition-colors list-none flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              অ্যাডভান্সড: ইমেজ লিংক ব্যবহার করুন
            </summary>
            <div className="mt-2">
              <input 
                type="url" 
                placeholder="ইমেজ ইউআরএল পেস্ট করুন..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[11px] focus:ring-1 focus:ring-blue-500/20"
                value={formData.image.startsWith('data:') ? '' : formData.image}
                onChange={e => {
                  setFormData({...formData, image: e.target.value});
                  setImagePreview(null);
                }}
              />
            </div>
          </details>

          <button 
            type="submit"
            className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] mt-4"
          >
            পণ্যটি শপে অ্যাড করুন
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
