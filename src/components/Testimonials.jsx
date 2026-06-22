import { motion } from 'framer-motion';
import { Quote, Star, ExternalLink } from 'lucide-react';

const MAPS_LINK = "https://www.google.com/maps/place/New+Look+ladies+beauty+Parlour/@13.0114012,77.4726155,12z/data=!4m12!1m2!2m1!1snew+look+salon+bangalore+lingarajapuram!3m8!1s0x3bae178985ac7289:0xf74808b806c215!8m2!3d13.0114012!4d77.6250508!9m1!1b1!15sCiduZXcgbG9vayBzYWxvbiBiYW5nYWxvcmUgbGluZ2FyYWphcHVyYW1aKSInbmV3IGxvb2sgc2Fsb24gYmFuZ2Fsb3JlIGxpbmdhcmFqYXB1cmFtkgEMYmVhdXR5X3NhbG9umgFEQ2k5RFFVbFJRVU52WkVOb2RIbGpSamx2VDJ0S2RWSXdTbXBXYkU0eFlsUldkMUZZUmpCTVdHUnhXbXhzU21Fell4QULgAQD6AQQIRBAp!16s%2Fg%2F11gtz9p47g?entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D";

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 bg-darkBg overflow-hidden border-t border-white/5">
      {/* Background glow orb */}
      <div className="glow-orb w-[400px] h-[400px] bg-neonOrange/5 top-1/4 left-1/4" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        
        {/* Section Header */}
        <div className="mb-16">
          <span className="font-cyber tracking-[0.4em] text-[10px] text-neonOrange uppercase block mb-3">Prestige Reviews</span>
          <h2 className="font-cyber font-black text-3xl md:text-5xl uppercase tracking-wider text-white">
            GUEST EXPERIENCES
          </h2>
          <div className="w-16 h-[2px] bg-neonOrange mx-auto mt-6" />
        </div>

        {/* Testimonial Link Card */}
        <div className="relative flex flex-col justify-center items-center">
          <div className="absolute top-0 text-neonOrange/15">
            <Quote className="w-20 h-20 rotate-180" />
          </div>

          <motion.a
            href={MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03, y: -8 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mt-12 relative w-full max-w-2xl mx-auto p-12 rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#12100c]/90 via-[#0a0907]/95 to-[#050505]/98 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.85),0_0_15px_rgba(212,175,55,0.02)] hover:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.9),0_0_25px_rgba(212,175,55,0.15)] hover:border-[#D4AF37]/50 flex flex-col items-center cursor-pointer group transition-all duration-500 backdrop-blur-md overflow-hidden"
          >
            {/* Ambient internal card glow */}
            <div className="absolute -right-12 -bottom-12 w-32 h-32 rounded-full bg-[#D4AF37]/5 blur-2xl group-hover:bg-[#D4AF37]/15 group-hover:scale-125 transition-all duration-700 pointer-events-none z-0" />

            {/* Elegant decorative background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.02] group-hover:opacity-[0.04] transition-opacity duration-500 z-0 pointer-events-none" />

            {/* Animated Shimmer Overlay */}
            <div className="absolute inset-0 -translate-x-[150%] skew-x-12 bg-gradient-to-r from-transparent via-[#D4AF37]/5 to-transparent group-hover:animate-shimmer z-0 pointer-events-none" />

            {/* Corner bracket decorations */}
            <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-[#D4AF37]/15 group-hover:border-[#D4AF37]/65 transition-all duration-500 rounded-tl-xl z-10" />
            <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-[#D4AF37]/15 group-hover:border-[#D4AF37]/65 transition-all duration-500 rounded-tr-xl z-10" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-[#D4AF37]/15 group-hover:border-[#D4AF37]/65 transition-all duration-500 rounded-bl-xl z-10" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-[#D4AF37]/15 group-hover:border-[#D4AF37]/65 transition-all duration-500 rounded-br-xl z-10" />

            {/* Stars */}
            <div className="flex items-center space-x-1.5 mb-8 relative z-10">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-neonOrange text-neonOrange text-glow" />
              ))}
            </div>

            {/* Review Text */}
            <h3 className="font-cyber font-bold tracking-widest text-lg md:text-xl uppercase text-white mb-4 flex items-center gap-3 relative z-10">
              Press this card to view reviews
              <ExternalLink className="w-6 h-6 text-neonOrange group-hover:translate-x-1 transition-transform duration-300" />
            </h3>
            
            <p className="font-sans text-neutral-400 group-hover:text-neutral-300 transition-colors duration-300 text-sm md:text-base tracking-[0.03em] font-light max-w-md relative z-10">
              Read what our lovely guests have to say about their luxury experiences at New Look Beauty Parlour on Google.
            </p>
          </motion.a>

        </div>

      </div>
    </section>
  );
}
