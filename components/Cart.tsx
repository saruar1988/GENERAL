
import React from 'react';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onRemove, onUpdateQuantity, onClose }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Your Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p>Your cart is empty.</p>
              <button 
                onClick={onClose}
                className="mt-4 text-blue-600 font-semibold hover:underline"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-slate-800 text-sm">{item.name}</h3>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-blue-600 font-bold text-sm mb-2">৳{item.price.toLocaleString('en-IN')}</div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="px-2 py-1 bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-semibold">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="px-2 py-1 bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-500">Subtotal</span>
              <span className="text-xl font-bold text-slate-800">৳{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]">
              Checkout Now
            </button>
            <p className="text-center text-[10px] text-slate-400 mt-4">
              Taxes and shipping calculated at checkout.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
