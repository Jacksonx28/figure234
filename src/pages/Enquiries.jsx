import { motion } from "framer-motion";
import { useState } from "react";

export default function Enquiries() {
  const whatsappNumber = "2348077778313";

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const name = formData.get("name");
    const email = formData.get("email");
    const interest = formData.get("interest");
    const message = formData.get("message");

    // Luxury formatted message for your WhatsApp
    const structuredMessage = 
      `*FIGURE234 ARCHIVE REQUEST*%0A%0A` +
      `*Client:* ${name}%0A` +
      `*Email:* ${email}%0A` +
      `*Interest:* ${interest}%0A%0A` +
      `*Message:*%0A${message}`;

    window.open(`https://wa.me/${whatsappNumber}?text=${structuredMessage}`, "_blank");
  };

  return (
    <div className="max-w-3xl mx-auto px-8 py-40">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-serif italic text-white uppercase tracking-tighter">
          Private <span className="text-[#D4AF37]">Acquisition</span>
        </h2>
        <p className="text-gray-500 text-[10px] font-mono tracking-[0.3em] uppercase mt-4">
          Contact our concierge for worldwide sourcing & logistics
        </p>
      </motion.div>

      {/* Added onSubmit handler */}
      <form onSubmit={handleWhatsAppSubmit} className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Name Input - Added name="name" */}
          <div className="relative group">
            <input 
              required
              name="name"
              type="text" 
              placeholder="Full Name"
              className="w-full bg-transparent border-b border-white/10 py-3 text-sm outline-none focus:border-[#D4AF37] transition-colors placeholder:text-gray-700 uppercase tracking-widest text-white"
            />
          </div>

          {/* Email Input - Added name="email" */}
          <div className="relative group">
            <input 
              required
              name="email"
              type="email" 
              placeholder="Email Address"
              className="w-full bg-transparent border-b border-white/10 py-3 text-sm outline-none focus:border-[#D4AF37] transition-colors placeholder:text-gray-700 uppercase tracking-widest text-white"
            />
          </div>
        </div>

        {/* Interest Selection - Added name="interest" */}
        <div className="relative group">
          <select 
            name="interest"
            className="w-full bg-transparent border-b border-white/10 py-3 text-sm outline-none focus:border-[#D4AF37] transition-colors text-gray-500 uppercase tracking-widest appearance-none cursor-pointer"
          >
            <option className="bg-black text-white" value="Collectibles">Interest: Collectibles</option>
            <option className="bg-black text-white" value="Art Decor">Interest: Art Decor</option>
            <option className="bg-black text-white" value="Sourcing Request">Interest: Sourcing Request</option>
          </select>
        </div>

        {/* Message - Added name="message" */}
        <div className="relative group">
          <textarea 
            required
            name="message"
            rows="4"
            placeholder="How can we assist your collection?"
            className="w-full bg-transparent border-b border-white/10 py-3 text-sm outline-none focus:border-[#D4AF37] transition-colors placeholder:text-gray-700 uppercase tracking-widest resize-none text-white"
          ></textarea>
        </div>

        <motion.button 
          type="submit"
          whileHover={{ scale: 1.01, backgroundColor: "#D4AF37" }}
          whileTap={{ scale: 0.99 }}
          className="w-full bg-white text-black font-black py-5 uppercase tracking-[0.5em] text-[10px] transition-all"
        >
          Submit to Archive
        </motion.button>
      </form>

      <div className="mt-24 grid grid-cols-2 gap-8 border-t border-white/5 pt-12 text-center">
        <div>
          <p className="text-[8px] text-gray-600 uppercase tracking-widest mb-2">Direct Line</p>
          <a href={`https://wa.me/${whatsappNumber}`} className="text-[10px] text-[#D4AF37] uppercase font-bold hover:text-white transition-colors">+234 807 777 8313</a>
        </div>
        <div>
          <p className="text-[8px] text-gray-600 uppercase tracking-widest mb-2">Concierge Email</p>
          <p className="text-[10px] text-white uppercase font-bold">info@figure234.com</p>
        </div>
      </div>
    </div>
  );
}