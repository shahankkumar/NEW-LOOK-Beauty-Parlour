import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, Phone } from 'lucide-react';

const navLinks = [
  { name: 'Philosophy', href: '#philosophy' },
  { name: 'About', href: '#about' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Services', href: '#services' },
  { name: 'Journey', href: '#journey' },
  { name: 'Stylists', href: '#stylists' },
  { name: 'Reviews', href: '#testimonials' },
  { name: 'Schedule', href: '#schedule' },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Section highlighters based on scroll intersection
      const sections = ['home', 'philosophy', 'about', 'gallery', 'services', 'journey', 'stylists', 'testimonials', 'schedule', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-black/70 backdrop-blur-xl border-b border-[#D4AF37]/30 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.85)]' 
            : 'bg-black/45 backdrop-blur-xl border-b border-white/10 py-4 md:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo / Monogram */}
          <a href="#home" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-neonOrange to-[#F3E5AB] flex items-center justify-center p-[1px] transition-transform duration-500 group-hover:rotate-180">
              <div className="w-full h-full rounded-full bg-darkBg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-neonOrange group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="font-cyber font-bold tracking-[0.2em] text-sm text-white group-hover:text-glow transition-all duration-300">
                NEW LOOK
              </span>
              <span className="block text-[8px] tracking-[0.35em] text-neutral-300 uppercase font-light">
                Beauty Parlour
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navLinks.map((link) => {
              const id = link.href.substring(1);
              const isActive = activeSection === id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className="relative px-4 py-2.5 font-cyber tracking-widest text-[10px] uppercase transition-all duration-300 z-10 flex items-center justify-center rounded-full hover:text-white"
                  style={{ color: isActive ? '#D4AF37' : 'rgba(255, 255, 255, 0.8)' }}
                >
                  <span className="relative z-10">{link.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicatorGlass"
                      className="absolute inset-0 bg-white/[0.06] backdrop-blur-md border border-[#D4AF37]/35 rounded-full -z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_4px_15px_rgba(212,175,55,0.12)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Booking CTA Button */}
          <div className="hidden lg:flex items-center">
            <a
              href="#contact"
              className="relative overflow-hidden group flex items-center space-x-2 px-5 py-2.5 rounded-full border border-neonOrange/40 bg-neonOrange/5 text-[11px] font-cyber tracking-widest uppercase text-white hover:border-neonOrange transition-all duration-500 shadow-[0_0_15px_rgba(212,175,55,0.05)] hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]"
            >
              <Phone className="w-3.5 h-3.5 text-neonOrange group-hover:rotate-12 transition-transform" />
              <span>Book Appointment</span>
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-neutral-400 hover:text-white p-1 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            />

            {/* Content Drawer - styled as a luxury mobile-app interface */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[80%] max-w-sm bg-gradient-to-b from-[#12100c] via-[#050505] to-[#030303] border-l border-[#D4AF37]/30 p-8 flex flex-col justify-between shadow-[0_0_60px_rgba(0,0,0,0.95)] lg:hidden overflow-hidden"
            >
              {/* Luxury background decorations */}
              <div className="absolute -right-20 bottom-10 w-44 h-44 rounded-full bg-[#D4AF37]/5 blur-[60px] pointer-events-none z-0" />
              <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.02] pointer-events-none z-0" />

              <div className="relative z-10">
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                    <span className="font-cyber font-bold tracking-widest text-sm text-white">
                      NEW LOOK
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-neutral-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex flex-col space-y-6 mt-10">
                  {navLinks.map((link) => {
                    const id = link.href.substring(1);
                    const isActive = activeSection === id;
                    return (
                      <a
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="font-cyber tracking-[0.2em] text-sm uppercase transition-all duration-300 flex items-center justify-between py-1.5"
                        style={{ color: isActive ? '#D4AF37' : '#e5e7eb' }}
                      >
                        <span>{link.name}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicatorMobile"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
                          </motion.div>
                        )}
                      </a>
                    );
                  })}
                </nav>
              </div>

              <div className="border-t border-white/5 pt-6 relative z-10">
                <a
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3.5 rounded-full border border-neonOrange/30 bg-neonOrange/10 text-xs font-cyber tracking-widest uppercase text-white hover:bg-neonOrange/20 transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                >
                  <Phone className="w-4 h-4 text-[#D4AF37]" />
                  <span>Reserve Online</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
