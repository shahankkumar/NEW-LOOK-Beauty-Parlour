import { Sparkles, Instagram, Facebook, ArrowUp } from 'lucide-react';

const footerLinks = [
  { name: 'Philosophy', href: '#philosophy' },
  { name: 'About Us', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Journey', href: '#journey' },
  { name: 'Stylists', href: '#stylists' },
  { name: 'Contact & Booking', href: '#contact' },
];

export default function Footer({ onAdminClick, isAdmin }) {
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#020202] border-t border-white/5 pt-16 pb-8 overflow-hidden">
      {/* Background Glow */}
      <div className="glow-orb w-[300px] h-[300px] bg-neonOrange/5 bottom-0 left-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-12 border-b border-white/5">
          
          {/* Brand Signature Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <a href="#home" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-neonOrange to-[#F3E5AB] flex items-center justify-center p-[1px] transition-transform duration-500 group-hover:rotate-180">
                <div className="w-full h-full rounded-full bg-darkBg flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-neonOrange" />
                </div>
              </div>
              <div>
                <span className="font-cyber font-bold tracking-[0.2em] text-sm text-white group-hover:text-glow transition-all duration-300">
                  NEW LOOK
                </span>
                <span className="block text-[8px] tracking-[0.35em] text-neutral-400 uppercase font-light">
                  Beauty Parlour
                </span>
              </div>
            </a>
            
            <p className="font-sans text-neutral-500 text-xs md:text-sm leading-relaxed max-w-sm font-light">
              Crafting bespoke hairstyles, restorative skincare rituals, and award-winning bridal transformations. Welcome to the signature home of prestige beauty and couture styling.
            </p>
          </div>

          {/* Navigation Links (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-cyber font-bold tracking-widest text-[11px] uppercase text-white">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="font-sans text-xs text-neutral-400 hover:text-neonOrange transition-colors font-light"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Join Club (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-cyber font-bold tracking-widest text-[11px] uppercase text-white">
              The Prestige Club
            </h4>
            <p className="font-sans text-neutral-500 text-xs font-light">
              Subscribe to receive VIP access to styling tutorials, product updates, and priority scheduling.
            </p>
            
            <form onSubmit={(e) => e.preventDefault()} className="flex space-x-2">
              <input
                type="email"
                required
                placeholder="vip@youraddress.com"
                className="glass-card px-4 py-2.5 rounded-xl border border-white/5 text-base md:text-xs text-white placeholder-neutral-600 focus:border-neonOrange/85 focus:ring-1 focus:ring-neonOrange/30 transition-all duration-300 w-full"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-neonOrange text-black font-cyber font-bold tracking-widest text-[9px] uppercase hover:bg-white transition-colors duration-300 shrink-0"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        {/* Bottom copyright details */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 mt-4 text-center sm:text-left gap-4">
          <p className="font-sans text-[10px] text-neutral-600 tracking-widest uppercase flex items-center justify-center sm:justify-start flex-wrap gap-2">
            <span>&copy; {new Date().getFullYear()} NEW LOOK BEAUTY PARLOUR. ALL RIGHTS RESERVED.</span>
            {!isAdmin ? (
              <button onClick={onAdminClick} className="hover:text-neonOrange transition-colors cursor-pointer ml-1">
                [Admin]
              </button>
            ) : (
              <span className="text-neonOrange ml-1">[Admin Active]</span>
            )}
          </p>

          <div className="flex items-center space-x-6">
            {/* Social Links */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-neonOrange transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-neonOrange transition-colors">
              <Facebook className="w-4 h-4" />
            </a>

            {/* Scroll to Top */}
            <a
              href="#home"
              onClick={scrollToTop}
              className="w-8 h-8 rounded-full border border-white/5 hover:border-neonOrange/40 hover:bg-neonOrange/5 flex items-center justify-center text-neutral-500 hover:text-white transition-all duration-300 ml-4"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
