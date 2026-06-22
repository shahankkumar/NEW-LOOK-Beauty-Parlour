import { motion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen w-full bg-[#050505] overflow-hidden flex items-center justify-center">
      
      {/* 
        ========================================
        LAYER 1: BACKGROUND (Gradient Fade)
        ========================================
      */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Full Color Background Image - Enhanced brightness and contrast for visibility */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-100 brightness-[1.3] contrast-[1.05] saturate-[1.1]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=2069')" }}
        />
        
        {/* Balanced Left-to-Right Gradient Fade for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/45 to-transparent w-full md:w-[60%]" />
        
        {/* Softened Top-Down Gradient to Protect Navbar while preserving top-right details */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/70 via-black/20 to-transparent z-10" />

        {/* Mobile-only Bottom-Up Gradient to Protect Bottom-Aligned Text */}
        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none md:hidden" />

        {/* Animated Glowing Orbs for Depth */}
        <div className="absolute top-[20%] left-[15%] w-[40vw] h-[40vw] rounded-full bg-[#D4AF37]/10 blur-[100px] animate-pulse-slow" />
      </div>

      {/* 
        ========================================
        LAYER 2: EDITORIAL TYPOGRAPHY (Left Aligned)
        ========================================
      */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex items-end md:items-center min-h-screen pb-24 md:pb-0 pt-32">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative w-full md:w-[550px] lg:w-[650px] text-left pt-10"
        >

          {/* Luxury Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="inline-flex items-center gap-3 px-5 py-2 mb-8 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-sans tracking-[0.4em] text-[9px] md:text-[10px] text-[#D4AF37] uppercase font-medium">
              Prestige Salon & Couture
            </span>
          </motion.div>
          
          {/* Rich Serif Typography */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="font-serif text-5xl md:text-7xl lg:text-[90px] leading-[1.05] text-white drop-shadow-2xl font-normal mb-6"
          >
            Reveal Your <br/>
            <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF1C5] to-[#D4AF37]">
              New Look
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="font-sans text-neutral-300 text-sm md:text-base leading-relaxed font-light mb-12 max-w-md"
          >
            A sensory journey into absolute luxury. We fuse avant-garde editorial styling with restorative botanical treatments to completely reinvent your personal aesthetic.
          </motion.p>
          
          {/* Shimmering Metallic Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <a 
              href="#contact"
              className="group relative inline-flex items-center justify-center px-10 py-5 overflow-hidden rounded-full border border-[#D4AF37]/50 bg-[#111] text-[#D4AF37] font-sans tracking-[0.2em] text-[11px] uppercase transition-all duration-500 hover:border-[#D4AF37] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-105"
            >
              {/* Animated Light Sweep */}
              <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] group-hover:animate-shimmer" />
              <span className="relative z-10 font-medium">Book The Experience</span>
            </a>
          </motion.div>

        </motion.div>
      </div>

      {/* 
        ========================================
        LAYER 3: SCROLL INDICATOR
        ========================================
      */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center justify-center pointer-events-auto">
        <a href="#services" className="w-12 h-12 rounded-full border border-white/20 bg-black/50 backdrop-blur-md flex items-center justify-center hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-500 group">
          <ArrowDown className="w-4 h-4 text-[#D4AF37] group-hover:translate-y-1 transition-transform duration-300" />
        </a>
      </div>

    </section>
  );
}
