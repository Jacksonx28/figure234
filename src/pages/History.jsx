import { motion } from "framer-motion";

export default function History() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-4xl mx-auto px-8 py-24"
    >
      <header className="mb-20 border-b border-white/5 pb-12">
        <span className="text-[10px] text-[#D4AF37] uppercase tracking-[0.5em] font-bold">Volume 01 / Origins</span>
        <h1 className="text-6xl md:text-8xl font-serif italic text-white uppercase tracking-tighter mt-4 leading-none">
          The Art of <br/> <span className="text-[#D4AF37]">The Toy</span>
        </h1>
      </header>

      <article className="space-y-16 text-gray-400 leading-relaxed font-light text-lg">
        <section className="group">
          <h2 className="text-white uppercase font-bold tracking-[0.3em] text-xs mb-6 flex items-center gap-4">
            <span className="w-8 h-[1px] bg-[#D4AF37]"></span> KAWS & The Companion
          </h2>
          <p className="mb-6">
            Brian Donnelly, a former Disney animator, disrupted the art world by bringing "The Companion" to life. 
            By subverting the most recognizable icons of pop culture and adding his signature <span className="text-white italic">"X"</span> marks, 
            he turned vinyl toys into high-stakes investment pieces.
          </p>
          <p>
            Today, a KAWS figure isn't just a figurine; it’s a statement of cultural literacy that sits comfortably in the world's most 
            exclusive galleries and private homes.
          </p>
        </section>

        <div className="py-12 px-8 bg-white/5 border-l-2 border-[#D4AF37] italic font-serif text-3xl text-white">
          "The most interesting art happens when the line between high and low culture is completely erased."
        </div>

        <section>
          <h2 className="text-white uppercase font-bold tracking-[0.3em] text-xs mb-6 flex items-center gap-4">
            <span className="w-8 h-[1px] bg-[#D4AF37]"></span> The Bearbrick Legacy
          </h2>
          <p>
            Originating from Japan's Medicom Toy, the BE@RBRICK has become the ultimate blank canvas. 
            Through limited-edition collaborations with brands like Chanel and artists like Jackson Pollock, 
            the simple bear silhouette has become a global currency for collectors.
          </p>
        </section>
      </article>
    </motion.div>
  );
}