import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Sun, Sparkles, Wand2 } from 'lucide-react';

const serviceCategories = [
  {
    id: 'hair',
    name: 'Hair Couture',
    icon: Scissors,
    services: [
      { name: 'Signature Haute Haircut', desc: 'Precision cut tailored to facial structure, includes luxurious wash and blowout.' },
      { name: 'Balayage Artisan Color', desc: 'Bespoke hand-painted highlights for natural, sun-kissed dimensions.' },
      { name: 'Royal Keratin Therapy', desc: 'Premium smoothing treatment to eliminate frizz and infuse high-gloss shine.' },
      { name: 'Elixir Hair & Scalp Ritual', desc: 'Deep botanical conditioning treatment paired with active micro-circulation massage.' }
    ]
  },
  {
    id: 'skin',
    name: 'Skin Rituals',
    icon: Sun,
    services: [
      { name: 'Ocular Glow Hydrafacial', desc: 'Multi-step skin resurfacing treatment combining vacuum extraction and peptide infusion.' },
      { name: 'Bio-Organic Lift Facial', desc: 'Advanced contouring massage using natural enzymes and marine collagen masks.' },
      { name: 'Gold Leaf Rejuvenation', desc: 'Pure 24k gold leaf skin facial designed for cellular renewal and luxury radiance.' },
      { name: 'Micro-Dermabrasion Glow', desc: 'Intense mechanical exfoliation to eliminate dead skin cells and reveal fresh tone.' }
    ]
  },
  {
    id: 'bridal',
    name: 'Bridal Artistry',
    icon: Sparkles,
    services: [
      { name: 'Empress Bridal Makeup', desc: 'HD and Airbrush bridal application including trial, contour, and false lashes.' },
      { name: 'Imperial Bridal Hairstyle', desc: 'Prestige hairdressing, veil draping, and placement of bridal hair accessories.' },
      { name: 'Pre-Bridal Glow Package', desc: 'Multi-session full body massage, customized facial, and deep conditioning salon hair spa.' },
      { name: 'Royal Bridal Companion', desc: 'Full-day stylist assistance for touch-ups, outfit changes, and hair transitions.' }
    ]
  },
  {
    id: 'makeup',
    name: 'Glamour Makeup',
    icon: Wand2,
    services: [
      { name: 'Red Carpet Glamour', desc: 'High-contrast fashion makeup for special galas, proms, and upscale photography.' },
      { name: 'Airbrush Perfection', desc: 'Flawless, water-resistant base makeup with ultra-thin weightless coverage.' },
      { name: 'Editorial Fashion Look', desc: 'Creative, thematic face design tailored to fashion runways and magazines.' },
      { name: 'Prestige Lash & Brow Tint', desc: 'Semi-permanent styling, shaping, and premium tinting for fuller eyes.' }
    ]
  }
];

export default function Services() {
  const [activeCategory, setActiveCategory] = useState('hair');

  const activeData = serviceCategories.find((cat) => cat.id === activeCategory);

  return (
    <section id="services" className="relative py-24 bg-darkBg overflow-hidden border-t border-white/5">
      {/* Glow effect */}
      <div className="glow-orb w-[400px] h-[400px] bg-neonOrange/5 bottom-0 left-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-cyber tracking-[0.4em] text-[10px] text-[#D4AF37] uppercase block mb-3">Our Services</span>
          <h2 className="font-cyber font-black text-3xl md:text-5xl uppercase tracking-wider text-white">
            THE PLATINUM SERVICES MENU
          </h2>
          <p className="font-sans text-neutral-500 text-xs md:text-sm tracking-wide mt-4 max-w-xl mx-auto">
            Indulge in a curated selection of premium salons offerings. Select a category below to explore our signature treatments.
          </p>
          <div className="w-16 h-[2px] bg-neonOrange mx-auto mt-6" />
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {serviceCategories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-3 px-6 py-3.5 rounded-full border text-xs font-cyber tracking-widest uppercase transition-all duration-500 relative ${
                  isActive
                    ? 'border-neonOrange bg-gradient-to-r from-neonOrange/20 to-cyberOrange/15 text-white shadow-[0_0_20px_rgba(212,175,55,0.25)]'
                    : 'border-white/5 bg-white/[0.01] text-neutral-400 hover:border-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'text-neonOrange scale-110' : 'text-neutral-400'}`} />
                <span>{category.name}</span>
                {isActive && (
                  <span className="absolute -inset-[1px] rounded-full border border-gradient-to-r from-neonOrange to-cyberOrange pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>

        {/* Services List Panel */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid md:grid-cols-2 gap-8"
            >
              {activeData.services.map((service, idx) => (
                <motion.div
                  key={service.name}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="p-8 rounded-2xl flex flex-col justify-between group relative overflow-hidden border border-[#D4AF37]/20 bg-gradient-to-br from-[#12100c]/90 via-[#0a0907]/95 to-[#050505]/98 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.85),0_0_15px_rgba(212,175,55,0.02)] hover:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.9),0_0_25px_rgba(212,175,55,0.15)] hover:border-[#D4AF37]/50 backdrop-blur-md transition-all duration-500 cursor-pointer"
                >
                  {/* Ambient internal card glow */}
                  <div className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-[#D4AF37]/5 blur-2xl group-hover:bg-[#D4AF37]/15 group-hover:scale-125 transition-all duration-700 pointer-events-none z-0" />

                  {/* Elegant decorative background pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.02] group-hover:opacity-[0.04] transition-opacity duration-500 z-0 pointer-events-none" />

                  {/* Animated Shimmer Overlay */}
                  <div className="absolute inset-0 -translate-x-[150%] skew-x-12 bg-gradient-to-r from-transparent via-[#D4AF37]/5 to-transparent group-hover:animate-shimmer z-0 pointer-events-none" />

                  {/* Corner bracket decorations */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-[#D4AF37]/15 group-hover:border-[#D4AF37]/65 transition-all duration-500 rounded-tl-xl z-10" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-[#D4AF37]/15 group-hover:border-[#D4AF37]/65 transition-all duration-500 rounded-tr-xl z-10" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-[#D4AF37]/15 group-hover:border-[#D4AF37]/65 transition-all duration-500 rounded-bl-xl z-10" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-[#D4AF37]/15 group-hover:border-[#D4AF37]/65 transition-all duration-500 rounded-br-xl z-10" />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Top Accent & Numbering */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-serif italic text-sm text-[#D4AF37]/50 group-hover:text-[#D4AF37] transition-all duration-500 font-medium">
                        {(idx + 1).toString().padStart(2, '0')}
                      </span>
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]/20 group-hover:text-[#D4AF37] transition-all duration-500 transform group-hover:rotate-12" />
                    </div>

                    {/* Elegant Serif Title with Metallic Gold Gradient on Hover */}
                    <h3 className="font-serif text-base md:text-lg text-white group-hover:bg-gradient-to-r group-hover:from-neonOrange group-hover:via-[#FFF1C5] group-hover:to-neonOrange group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500 mb-3 tracking-wide font-normal">
                      {service.name}
                    </h3>

                    {/* Description */}
                    <p className="font-sans text-neutral-400 group-hover:text-neutral-300 transition-colors duration-500 text-xs md:text-sm leading-relaxed font-light mt-1">
                      {service.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Note subtext */}
        <div className="text-center mt-16">
          <p className="font-sans text-[9px] md:text-[10px] tracking-[0.3em] text-[#D4AF37]/60 uppercase max-w-xl mx-auto leading-relaxed">
            * All experiences are bespoke. Complimentary private styling and consultations are provided to curate your personalized wellness journey.
          </p>
        </div>

      </div>
    </section>
  );
}

