import { motion } from 'framer-motion';
import { Instagram, Calendar, Sparkles } from 'lucide-react';

const stylists = [
  {
    name: 'Samantha Hayes',
    role: 'Master Hair Couturier',
    experience: '12 Years Experience',
    bio: 'Specializes in precision French cuts, custom balayage blends, and prestige hair health therapies.',
    image: '/stylist_samantha.png',
    instagram: '@samantha_couture'
  },
  {
    name: 'Victoria Sterling',
    role: 'Elite Aesthetician & Skincare Expert',
    experience: '10 Years Experience',
    bio: 'Expert in dermal rejuvenation, cell-active facials, and organic peel restoration treatments.',
    image: '/stylist_victoria.png',
    instagram: '@victoria_skin'
  },
  {
    name: 'Marcus Vance',
    role: 'Royal Bridal & Celebrity Artist',
    experience: '14 Years Experience',
    bio: 'Crafts flawless HD airbrush bridal makeups and signature high-fashion runway looks.',
    image: '/stylist_marcus.png',
    instagram: '@marcus_glam'
  }
];

export default function Stylists() {
  return (
    <section id="stylists" className="relative py-24 bg-darkBg overflow-hidden border-t border-white/5">
      {/* Background Glow */}
      <div className="glow-orb w-[450px] h-[450px] bg-neonOrange/5 top-1/3 right-1/4 animate-float" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="font-cyber tracking-[0.4em] text-[10px] text-neonOrange uppercase block mb-3">The Artisans</span>
          <h2 className="font-cyber font-black text-3xl md:text-5xl uppercase tracking-wider text-white">
            MASTER STYLISTS &amp; ARTISTS
          </h2>
          <p className="font-sans text-neutral-500 text-xs md:text-sm tracking-wide mt-4 max-w-xl mx-auto">
            Meet the award-winning professionals dedicated to sculpting your signature look with precision and care.
          </p>
          <div className="w-16 h-[2px] bg-neonOrange mx-auto mt-6" />
        </div>

        {/* Stylists Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {stylists.map((stylist, index) => (
            <motion.div
              key={stylist.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.15 }}
              className="group relative h-[450px] rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_80px_rgba(212,175,55,0.25)] hover:border-neonOrange/50 flex flex-col justify-end transition-all duration-500 backdrop-blur-md"
              whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.4, ease: 'easeOut' } }}
            >
              {/* Animated Shimmer Overlay */}
              <div className="absolute inset-0 -translate-x-[150%] skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer z-20 pointer-events-none" />
              {/* Profile Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                style={{ backgroundImage: `url('${stylist.image}')` }}
              />
              
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-[#030303]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Card Footer Detail */}
              <div className="relative p-6 z-10 transition-transform duration-500 translate-y-24 group-hover:translate-y-0">
                
                {/* Meta details */}
                <div className="flex items-center space-x-2 text-neonOrange text-[9px] tracking-widest font-cyber uppercase mb-2">
                  <Sparkles className="w-3 h-3" />
                  <span>{stylist.experience}</span>
                </div>

                {/* Name & Role */}
                <h3 className="font-cyber font-bold tracking-widest text-sm uppercase text-white mb-1">
                  {stylist.name}
                </h3>
                <p className="font-sans text-[11px] text-neutral-300 font-light mb-4">
                  {stylist.role}
                </p>

                {/* Hidden content that reveals on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  <p className="font-sans text-neutral-400 text-xs leading-relaxed mb-6 font-light">
                    {stylist.bio}
                  </p>

                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <a 
                      href={stylist.instagram}
                      className="flex items-center space-x-1.5 text-neutral-400 hover:text-neonOrange text-xs transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                      <span className="font-sans text-[11px] font-light">{stylist.instagram}</span>
                    </a>
                    
                    <a
                      href="#contact"
                      className="flex items-center space-x-1.5 text-white hover:text-neonOrange text-xs font-cyber tracking-wider uppercase transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book</span>
                    </a>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
