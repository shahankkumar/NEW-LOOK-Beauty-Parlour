import { motion } from 'framer-motion';
import { Calendar, Scissors, Coffee, Eye } from 'lucide-react';

const steps = [
  {
    icon: Calendar,
    step: '01',
    title: 'Prestige Consultation',
    desc: 'Begin with a complimentary cup of premium herbal tea or coffee. Sit down with your personal stylist to map out your goals, assess hair/skin profile, and curate your bespoke package.'
  },
  {
    icon: Coffee,
    step: '02',
    title: 'Selection & Preparation',
    desc: 'Our artists select and custom-blend premium serums, active enzymes, or high-fashion hair coloring pigments. Rest and unwind in our plush pre-session seating area.'
  },
  {
    icon: Scissors,
    step: '03',
    title: 'Prestige Treatment',
    desc: 'The core transformation. Whether it is a hair makeover, facial glow, or bridal draping, relax under the hands of our master technicians using luxury international products.'
  },
  {
    icon: Eye,
    step: '04',
    title: 'Reveal & Styling Tips',
    desc: 'We present your completed look in our signature mirror gallery. Your stylist outlines a personalized home-care routine, complete with product recommendations, to extend your glow.'
  }
];

export default function Timeline() {
  return (
    <section id="journey" className="relative py-24 bg-deepSpace overflow-hidden border-t border-white/5">
      {/* Background orbs */}
      <div className="glow-orb w-[300px] h-[300px] bg-cyberOrange/5 top-10 left-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <span className="font-sans tracking-[0.4em] text-[10px] text-[#D4AF37] uppercase mb-4 font-medium px-4 py-1.5 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 shadow-[0_0_20px_rgba(212,175,55,0.1)] inline-block">
            The Guest Experience
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-white leading-tight mt-4">
            The Ritual of <br/>
            <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF1C5] to-[#D4AF37]">
              Transformation
            </span>
          </h2>
          <p className="font-sans text-neutral-400 text-xs md:text-sm leading-relaxed mt-6 max-w-xl mx-auto font-light">
            From the moment you cross our threshold to your final radiant reveal, follow the bespoke steps of the Prestige experience.
          </p>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-8" />
        </div>

        {/* Timeline Path container */}
        <div className="relative">
          {/* Vertical center line (Desktop only) with Gold glow fade */}
          <div className="absolute left-[30px] md:left-1/2 top-0 bottom-0 w-[2.5px] bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/45 to-transparent -translate-x-1/2 z-0 shadow-[0_0_10px_rgba(212,175,55,0.2)]" />

          <div className="space-y-6 md:space-y-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <div 
                  key={step.step}
                  className={`flex flex-col md:flex-row items-start group-timeline-item ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Left/Right space taker for alignment */}
                  <div className="hidden md:block w-1/2" />

                  {/* Luxury double-ring gold medallion indicator */}
                  <div className="absolute left-[30px] md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#FFF1C5] to-[#D4AF37] p-[1.5px] z-10 shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:scale-110 transition-transform duration-500">
                    <div className="w-full h-full rounded-full bg-[#030303] flex items-center justify-center">
                      <Icon className="w-4.5 h-4.5 text-[#D4AF37]" />
                    </div>
                  </div>

                  {/* Content Card Container */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                    className="w-full md:w-1/2 pl-16 md:pl-0 md:px-12"
                  >
                    <div className="p-8 rounded-2xl flex flex-col justify-between group relative overflow-hidden border border-[#D4AF37]/20 bg-gradient-to-br from-[#12100c]/90 via-[#0a0907]/95 to-[#050505]/98 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.85),0_0_15px_rgba(212,175,55,0.02)] hover:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.9),0_0_25px_rgba(212,175,55,0.15)] hover:border-[#D4AF37]/50 backdrop-blur-md transition-all duration-500 cursor-pointer">
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

                      {/* Step Number */}
                      <span className="font-serif italic text-4xl text-[#D4AF37]/5 absolute top-4 right-6 select-none group-hover:text-[#D4AF37]/10 transition-colors z-10 font-bold">
                        {step.step}
                      </span>
                      
                      <div className="relative z-10 flex flex-col h-full">
                        <span className="font-serif italic text-xs text-[#D4AF37]/80 block mb-2">
                          Phase {step.step}
                        </span>
                        
                        <h3 className="font-serif text-base md:text-lg text-white group-hover:bg-gradient-to-r group-hover:from-neonOrange group-hover:via-[#FFF1C5] group-hover:to-neonOrange group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500 mb-4 tracking-wide font-normal">
                          {step.title}
                        </h3>
                        
                        <p className="font-sans text-neutral-400 group-hover:text-neutral-300 transition-colors duration-500 text-xs md:text-sm leading-relaxed font-light">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
