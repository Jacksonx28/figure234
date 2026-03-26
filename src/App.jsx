import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

// PAGES
import Collectibles from "./pages/Collectibles"; 
import History from "./pages/History"; 
import Enquiries from "./pages/Enquiries";

// THE CART SIDEBAR
function CartSidebar({ isOpen, onClose, cart, setCart, whatsappNumber }) {
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  
  const handleCheckout = () => {
    const itemList = cart.map(i => 
      `- ${i.name} (${i.selectedHeight}, ${i.selectedColor})`
    ).join('%0A');
    
    const message = `Enquiry from Figure234:%0A${itemList}%0A%0ATotal: ₦${totalPrice.toLocaleString()}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]" 
          />
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }} 
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 z-[70] p-10 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-2xl font-serif italic uppercase tracking-tighter">My Bag</h2>
              <button onClick={onClose} className="text-[10px] tracking-widest uppercase text-gray-500 hover:text-white transition">
                Close [x]
              </button>
            </div>
            <div className="flex-grow overflow-y-auto space-y-6">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-4 border-b border-white/5 pb-4">
                  <img src={item.img} className="w-16 h-20 object-cover grayscale" alt={item.name} />
                  <div className="uppercase">
                    <h4 className="text-[10px] font-bold text-white">{item.name}</h4>
                    <p className="text-[8px] text-[#D4AF37]">{item.selectedHeight} / {item.selectedColor}</p>
                    <p className="text-[10px] text-gray-500 mt-1">₦{item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <button 
                onClick={handleCheckout} 
                className="mt-8 w-full bg-[#D4AF37] text-black font-black py-5 text-[10px] tracking-[0.5em] uppercase hover:bg-white transition-all"
              >
                Send Enquiry
              </button>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function App() {
  const [view, setView] = useState("home"); 
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const whatsappNumber = "2348077778313"; 

  // Prevent background scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
  }, [isMenuOpen]);

  const handleAddToCart = (item) => {
    setCart([...cart, item]);
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#D4AF37] flex flex-col">
      
      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-black z-[100] flex flex-col p-10 md:hidden"
          >
            <div className="flex justify-end mb-20">
              <button onClick={() => setIsMenuOpen(false)} className="text-[#D4AF37]">
                <X size={32} strokeWidth={1} />
              </button>
            </div>
            
            <div className="flex flex-col gap-10">
              {['home', 'collectibles', 'history', 'enquiries'].map((item, idx) => (
                <button
                  key={item}
                  onClick={() => { setView(item); setIsMenuOpen(false); }}
                  className="text-5xl font-serif italic text-left text-white hover:text-[#D4AF37] transition-all capitalize"
                >
                  <span className="text-[10px] font-mono not-italic text-gray-700 mr-4">0{idx + 1}</span>
                  {item === 'home' ? 'Index' : item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <nav className="p-8 flex justify-between items-center max-w-7xl mx-auto border-b border-white/10 w-full relative z-50">
        <div onClick={() => setView("home")} className="cursor-pointer group">
          <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">
            FIGURE<span className="text-[#D4AF37]">234</span>
          </h1>
          <p className="text-[8px] tracking-[0.4em] uppercase text-gray-500 font-bold mt-1 group-hover:text-white transition-colors">
            Premium Archive
          </p>
        </div>
        
        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center space-x-10 text-[11px] font-black uppercase tracking-tight text-gray-400">
          <button onClick={() => setView("collectibles")} className={`hover:text-white ${view === 'collectibles' ? 'text-white' : ''}`}>Collections</button>
          <button onClick={() => setView("history")} className={`hover:text-white ${view === 'history' ? 'text-white' : ''}`}>Archive</button>
          <button onClick={() => setView("enquiries")} className="text-[#D4AF37] border border-[#D4AF37]/30 px-4 py-2 hover:bg-[#D4AF37] hover:text-black transition-all">Enquire</button>
          <button 
            onClick={() => setIsCartOpen(true)} 
            className="flex items-center gap-2 bg-white text-black px-4 py-2 hover:bg-[#D4AF37] transition-all shadow-[4px_4px_0px_0px_rgba(212,175,55,0.3)]"
          >
            <span className="text-[10px] font-black uppercase">Bag</span>
            <span className="bg-black text-white text-[9px] px-2 py-0.5 font-mono">
              {cart.length.toString().padStart(2, '0')}
            </span>
          </button>
        </div>

        {/* MOBILE TRIGGER */}
        <div className="md:hidden flex items-center gap-6">
          <button onClick={() => setIsCartOpen(true)} className="text-white uppercase text-[10px] font-black tracking-widest">
            Bag ({cart.length})
          </button>
          <button onClick={() => setIsMenuOpen(true)} className="text-white">
            <Menu size={24} />
          </button>
        </div>
      </nav>

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {view === "home" && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-8 py-32 text-center max-w-5xl mx-auto">
              <div className="inline-block border border-[#D4AF37]/30 px-6 py-2 rounded-full mb-12">
                <p className="text-[10px] font-mono tracking-[0.5em] uppercase text-[#D4AF37]">Lagos — Worldwide</p>
              </div>
              <h2 className="text-7xl md:text-[10rem] font-serif font-light leading-[0.85] tracking-tighter uppercase">
                Bold <span className="italic text-[#D4AF37]">Art</span>,<br /> 
                Elite <span className="italic">Class</span>.
              </h2>
              <button onClick={() => setView("collectibles")} className="mt-20 text-[11px] font-bold tracking-[0.8em] text-gray-500 hover:text-white transition uppercase border-b border-transparent hover:border-white pb-2">
                Enter The Vault [ ↓ ]
              </button>
            </motion.div>
          )}

          {view === "collectibles" && (
            <motion.div key="coll" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Collectibles onAddToCart={handleAddToCart} />
            </motion.div>
          )}

          {view === "history" && (
            <motion.div key="hist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <History />
            </motion.div>
          )}

          {view === "enquiries" && <Enquiries />}
        </AnimatePresence>
      </main>

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        setCart={setCart} 
        whatsappNumber={whatsappNumber} 
      />
      
      <footer className="bg-black border-t border-white/5 px-8 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[8px] text-gray-600 uppercase tracking-[0.4em]">
            &copy; 2026 FIGURE234. ALL RIGHTS RESERVED.
          </p>
          <p className="text-[8px] text-gray-600 uppercase tracking-[0.4em]">
            DESIGNED BY JACKSON.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;