import { motion } from "framer-motion";

const ART_PIECES = [
  { 
    id: 1, 
    name: "KAWS BLUSH POSTER", 
    price: "₦35,000", 
    cat: "Wall Art", 
    img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop" 
  },
  { 
    id: 2, 
    name: "MINIMALIST SCULPTURE", 
    price: "₦120,000", 
    cat: "Decor", 
    img: "https://images.unsplash.com/photo-1554188248-986adbb73be4?q=80&w=1000&auto=format&fit=crop" 
  },
];

export default function ArtDecor({ whatsappNumber }) {
  return (
    <div className="max-w-7xl mx-auto px-8 py-16">
      {/* Page Header */}
      <header className="mb-20">
        <h2 className="text-5xl font-serif italic text-white uppercase tracking-tighter">
          Art <span className="text-[#D4AF37]">Decor</span>
        </h2>
        <p className="text-gray-500 text-[10px] font-mono tracking-[0.3em] uppercase mt-4">
          Curated aesthetics for the modern space
        </p>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {ART_PIECES.map((piece) => (
          <motion.div key={piece.id} whileHover={{ y: -10 }} className="group">
            <div className="relative aspect-square overflow-hidden bg-[#0a0a0a] border border-white/5 shadow-2xl">
              <img 
                src={piece.img} 
                alt={piece.name} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            <div className="mt-8 flex justify-between items-end border-b border-white/10 pb-6">
              <div>
                <h3 className="text-3xl font-serif italic text-white/90 group-hover:text-[#D4AF37] transition-colors uppercase">
                  {piece.name}
                </h3>
                <p className="text-[#D4AF37] font-mono mt-2 tracking-tighter">{piece.price}</p>
              </div>
              <a 
                href={`https://wa.me/${whatsappNumber}?text=Enquiring about: ${piece.name}`}
                className="text-[10px] font-black tracking-[0.3em] border border-white/20 px-6 py-3 hover:bg-white hover:text-black transition-all uppercase"
              >
                Inquire
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}