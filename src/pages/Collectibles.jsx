import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { client, urlFor } from "../lib/sanity";

export default function Collectibles({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = '*[_type == "product"]';
    client.fetch(query).then((data) => {
      const formattedData = data.map((item) => ({
        id: item._id,
        name: item.name,
        price: item.price,
        section: item.section?.toLowerCase() || "premium", 
        img: item.image ? urlFor(item.image).url() : "https://via.placeholder.com/400x500",
        heights: item.heights && item.heights.length > 0 ? item.heights : ["30cm"],
        colors: item.colors && item.colors.length > 0 ? item.colors : ["Black"]
      }));
      setProducts(formattedData);
      setLoading(false);
    }).catch(err => {
      console.error("Fetch error:", err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <p className="text-[10px] font-black uppercase tracking-[1em] text-[#D4AF37] animate-pulse">
          Accessing Archive...
        </p>
      </div>
    );
  }

  const premiumItems = products.filter(p => p.section === 'premium');
  const characterItems = products.filter(p => p.section === 'characters');
  const otherItems = products.filter(p => p.section !== 'premium' && p.section !== 'characters');

  return (
    <div className="pt-32 pb-20 px-8 max-w-7xl mx-auto min-h-screen bg-black text-white">
      
      {premiumItems.length > 0 && (
        <SectionWrapper title="Premium Archive">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {premiumItems.map((item) => (
              <ProductCard key={item.id} item={item} onAddToCart={onAddToCart} />
            ))}
          </div>
        </SectionWrapper>
      )}

      {characterItems.length > 0 && (
        <SectionWrapper title="Characters">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {characterItems.map((item) => (
              <ProductCard key={item.id} item={item} onAddToCart={onAddToCart} />
            ))}
          </div>
        </SectionWrapper>
      )}

      {otherItems.length > 0 && (
        <SectionWrapper title="Recent Arrivals">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {otherItems.map((item) => (
              <ProductCard key={item.id} item={item} onAddToCart={onAddToCart} />
            ))}
          </div>
        </SectionWrapper>
      )}

      {products.length === 0 && (
        <div className="py-40 text-center">
          <p className="text-[10px] uppercase tracking-widest opacity-30">No products found in the vault.</p>
        </div>
      )}
    </div>
  );
}

function SectionWrapper({ title, children }) {
  return (
    <section className="mb-24">
      <motion.h2 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="text-[11px] font-black uppercase tracking-[0.4em] mb-12 flex items-center gap-4 text-[#D4AF37]"
      >
        <span className="w-8 h-[1px] bg-[#D4AF37]"></span> {title}
      </motion.h2>
      {children}
    </section>
  );
}

function ProductCard({ item, onAddToCart }) {
  const [selectedHeight, setSelectedHeight] = useState(item.heights[0] || "30cm");
  const [selectedColor, setSelectedColor] = useState(item.colors[0] || "Black");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <div className="relative aspect-[4/5] bg-[#0a0a0a] overflow-hidden border border-white/5">
        <img 
          src={item.img} 
          alt={item.name} 
          className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
        />
        
        {/* OVERLAY CONTROLS:
          - Opacity is 100 on mobile (`opacity-100`) so users can actually see the buttons.
          - Opacity resets to 0 on desktop screens (`md:opacity-0`) and waits for a hover state (`md:group-hover:opacity-100`).
        */}
        <div className="absolute inset-0 bg-black/80 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4 md:p-6">
          
          {/* HEIGHT SELECTION */}
          <div className="mb-3 md:mb-4">
            <p className="text-[7px] md:text-[8px] uppercase tracking-widest text-gray-500 mb-1 md:mb-2">Select Size</p>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {item.heights.map((h) => (
                <button
                  key={h}
                  onClick={() => setSelectedHeight(h)}
                  className={`px-2 md:px-3 py-1 text-[8px] md:text-[9px] border transition-all ${
                    selectedHeight === h ? "border-[#D4AF37] text-[#D4AF37]" : "border-white/10 text-white hover:border-white/40"
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          {/* COLOR SELECTION */}
          <div className="mb-4 md:mb-6">
            <p className="text-[7px] md:text-[8px] uppercase tracking-widest text-gray-500 mb-1 md:mb-2">Select Color</p>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {item.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`px-2 md:px-3 py-1 text-[8px] md:text-[9px] border transition-all ${
                    selectedColor === c ? "border-[#D4AF37] text-[#D4AF37]" : "border-white/10 text-white hover:border-white/40"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* ADD TO BAG BUTTON */}
          <button 
            onClick={() => onAddToCart({ ...item, selectedHeight, selectedColor })}
            className="w-full bg-white text-black py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] transition-colors"
          >
            Add to Bag
          </button>
        </div>
      </div>

      <div className="mt-6 md:mt-8 flex justify-between items-start">
        <div>
          <h3 className="text-[11px] md:text-[13px] font-black uppercase tracking-tight mb-1">{item.name}</h3>
          <p className="text-[8px] md:text-[9px] text-[#D4AF37] uppercase tracking-[0.2em]">{item.section}</p>
        </div>
        <p className="font-mono text-[10px] md:text-[12px] font-bold">₦{item.price?.toLocaleString()}</p>
      </div>
    </motion.div>
  );
}