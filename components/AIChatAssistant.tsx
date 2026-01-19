
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { Product, Message } from '../types';

interface AIChatAssistantProps {
  products: Product[];
}

const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: "স্বাগতম! আমি আপনার 'হঠাৎ পাওয়া' এআই অ্যাসিস্ট্যান্ট। আপনি কি কোনো নির্দিষ্ট পণ্য খুঁজছেন? আপনি চাইলে ছবি তুলেও আমাকে পাঠাতে পারেন!",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, selectedImage]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!inputValue.trim() && !selectedImage) || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputValue;
    const currentImage = selectedImage;
    
    setInputValue('');
    setSelectedImage(null);
    setIsLoading(true);

    const history = messages.slice(-5).map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    const response = await geminiService.getShoppingAdvice(currentInput, products, history, currentImage || undefined);

    const aiMsg: Message = {
      role: 'model',
      content: response.text,
      timestamp: new Date(),
      sources: response.sources
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${isOpen ? 'bg-slate-800 rotate-90' : 'bg-blue-600 bg-gradient-to-tr from-blue-600 to-indigo-600'}`}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[550px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">হ</div>
              <div>
                <h3 className="font-bold text-sm">হঠাৎ পাওয়া এআই অ্যাসিস্ট্যান্ট</h3>
                <p className="text-[10px] text-slate-400">Visual search enabled</p>
              </div>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50"
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none'}`}>
                  {msg.image && (
                    <img src={msg.image} alt="Sent" className="rounded-lg mb-2 max-h-48 object-cover w-full shadow-inner" />
                  )}
                  {msg.content}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Sources:</p>
                      <div className="flex flex-wrap gap-1">
                        {msg.sources.map((s, i) => s.web && (
                          <a 
                            key={i} 
                            href={s.web.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[10px] text-blue-500 hover:underline bg-blue-50 px-1.5 py-0.5 rounded"
                          >
                            {s.web.title || 'Link'}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 bg-white">
            {selectedImage && (
              <div className="relative mb-3 inline-block">
                <img src={selectedImage} alt="Preview" className="w-20 h-20 object-cover rounded-xl border-2 border-blue-500 shadow-md" />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleImageSelect}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-slate-100 text-slate-500 p-2 rounded-xl hover:bg-slate-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="অ্যাসিস্ট্যান্টকে কিছু জিজ্ঞাসা করুন..."
                className="flex-grow bg-slate-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatAssistant;
