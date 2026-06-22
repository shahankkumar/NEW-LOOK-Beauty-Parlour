import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MapPin, Clock, Sparkles, ExternalLink } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    date: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const message = `*New Appointment Request*
*Name:* ${formData.name}
*Phone:* ${formData.phone}
*Service:* ${formData.service || 'Not specified'}
*Date:* ${formData.date || 'Not specified'}
*Notes:* ${formData.message || 'None'}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/918310311290?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({ name: '', phone: '', service: '', date: '', message: '' });
    setSubmitted(false);
  };

  return (
    <section id="contact" className="relative py-24 bg-deepSpace overflow-hidden border-t border-white/5">
      {/* Background orbs */}
      <div className="glow-orb w-[500px] h-[500px] bg-neonOrange/5 bottom-0 right-0" />
      <div className="glow-orb w-[300px] h-[300px] bg-cyberOrange/5 top-10 left-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="font-cyber tracking-[0.4em] text-[10px] text-neonOrange uppercase block mb-3">Reservations</span>
          <h2 className="font-cyber font-black text-3xl md:text-5xl uppercase tracking-wider text-white">
            BOOKINGS &amp; CONTACT
          </h2>
          <div className="w-16 h-[2px] bg-neonOrange mx-auto mt-6" />
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Column 1: Contact Details & Hours (5 cols) - Appears second on mobile viewports */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 order-2 lg:order-1">
            <div className="space-y-6">
              <h3 className="font-cyber font-bold tracking-widest text-sm uppercase text-white mb-6">
                SALON ATELIER
              </h3>

              {/* Detail cards */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-center text-neonOrange shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-cyber text-[10px] tracking-wider text-neutral-400 uppercase">Address</span>
                  <p className="font-sans text-neutral-200 text-xs md:text-sm mt-1 leading-relaxed">
                    1st floor, balaji complex, 36, Hennur Main Rd, St Thomas Town, Kariyannapalya, Lingarajapuram, Bengaluru, Karnataka 560084
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-center text-neonOrange shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-cyber text-[10px] tracking-wider text-neutral-400 uppercase">Phone</span>
                  <p className="font-sans text-neutral-200 text-xs md:text-sm mt-1">
                    +91 83103 11290
                  </p>
                </div>
              </div>



            </div>

            {/* Dark Filtered Google Map Iframe */}
            <a 
              href="https://www.google.com/maps/place/New+Look+ladies+beauty+Parlour/@13.0101431,77.6248029,16z/data=!4m10!1m2!2m1!1s1st+floor,+balaji+complex,+36,+Hennur+Main+Rd,+St+Thomas+Town,+Kariyannapalya,+Lingarajapuram,+Bengaluru,+Karnataka+560084!3m6!1s0x3bae178985ac7289:0xf74808b806c215!8m2!3d13.0114012!4d77.6250508!15sCnoxc3QgZmxvb3IsIGJhbGFqaSBjb21wbGV4LCAzNiwgSGVubnVyIE1haW4gUmQsIFN0IFRob21hcyBUb3duLCBLYXJpeWFubmFwYWx5YSwgTGluZ2FyYWphcHVyYW0sIEJlbmdhbHVydSwgS2FybmF0YWthIDU2MDA4NFp0InIxc3QgZmxvb3IgYmFsYWppIGNvbXBsZXggMzYgaGVubnVyIG1haW4gcmQgc3QgdGhvbWFzIHRvd24ga2FyaXlhbm5hcGFseWEgbGluZ2FyYWphcHVyYW0gYmVuZ2FsdXJ1IGthcm5hdGFrYSA1NjAwODSSAQxiZWF1dHlfc2Fsb26aAURDaTlEUVVsUlFVTnZaRU5vZEhsalJqbHZUMnRLZFZJd1NtcFdiRTR4WWxSV2QxRllSakJNV0dSeFdteHNTbUV6WXhBQuABAPoBBAhEECk!16s%2Fg%2F11gtz9p47g?entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-56 rounded-2xl overflow-hidden border border-white/5 shadow-2xl relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-sm duration-300">
                <span className="bg-neonOrange text-black px-6 py-2 rounded-full font-cyber text-xs tracking-widest uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                  Open in Maps <ExternalLink className="w-4 h-4" />
                </span>
              </div>
              <iframe
                title="Salon Location Map"
                src="https://maps.google.com/maps?width=100%25&height=600&hl=en&q=New%20Look%20ladies%20beauty%20Parlour,%201st%20floor,%20balaji%20complex,%2036,%20Hennur%20Main%20Rd,%20Lingarajapuram,%20Bengaluru&t=&z=15&ie=UTF8&iwloc=B&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, pointerEvents: 'none' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </a>
          </div>

          {/* Column 2: Booking Form (7 cols) - Appears first on mobile viewports for quick booking */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="premium-card p-8 md:p-10 rounded-3xl relative overflow-hidden border border-neonOrange/20 hover:border-neonOrange shadow-2xl">
              {/* Background accent sheet */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-neonOrange/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyberOrange/5 rounded-full blur-2xl pointer-events-none" />

              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="border-b border-white/5 pb-4 mb-6">
                      <h3 className="font-cyber font-bold tracking-widest text-sm uppercase text-white">
                        RESERVE SESSION
                      </h3>
                      <p className="font-sans text-[11px] text-neutral-400 font-light mt-1">
                        Please fill in the coordinates below. Our booking manager will verify your session.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="flex flex-col">
                        <label className="font-cyber text-[9px] tracking-widest text-neutral-400 uppercase mb-2">Full Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="glass-card px-4 py-3 rounded-xl border border-white/10 hover:border-neonOrange/40 focus:border-neonOrange focus:ring-1 focus:ring-neonOrange/30 text-base md:text-xs text-white placeholder-neutral-600 transition-all duration-300"
                          placeholder="Elizabeth Windsor"
                        />
                      </div>

                      {/* Phone */}
                      <div className="flex flex-col">
                        <label className="font-cyber text-[9px] tracking-widest text-neutral-400 uppercase mb-2">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="glass-card px-4 py-3 rounded-xl border border-white/10 hover:border-neonOrange/40 focus:border-neonOrange focus:ring-1 focus:ring-neonOrange/30 text-base md:text-xs text-white placeholder-neutral-600 transition-all duration-300"
                          placeholder="+91 83103 11290"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Service Select */}
                      <div className="flex flex-col">
                        <label className="font-cyber text-[9px] tracking-widest text-neutral-400 uppercase mb-2">Selected Treatment</label>
                        <select
                          required
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className="glass-card px-4 py-3 rounded-xl border border-white/10 hover:border-neonOrange/40 focus:border-neonOrange focus:ring-1 focus:ring-neonOrange/30 text-base md:text-xs text-neutral-300 transition-all duration-300 bg-[#0c0a06]"
                        >
                          <option value="" disabled className="bg-[#0c0a06] text-neutral-500">Select a specialty...</option>
                          <option value="hair" className="bg-[#0c0a06] text-neutral-200">Hair Couture (Cuts, Styling, Color)</option>
                          <option value="skin" className="bg-[#0c0a06] text-neutral-200">Skin Rituals (Facials, Peels)</option>
                          <option value="bridal" className="bg-[#0c0a06] text-neutral-200">Bridal Artistry (Full Bridal)</option>
                          <option value="makeup" className="bg-[#0c0a06] text-neutral-200">Glamour Makeup (Red Carpet)</option>
                        </select>
                      </div>

                      {/* Date Picker */}
                      <div className="flex flex-col">
                        <label className="font-cyber text-[9px] tracking-widest text-neutral-400 uppercase mb-2">Preferred Session Date</label>
                        <input
                          type="date"
                          required
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="glass-card px-4 py-3 rounded-xl border border-white/10 hover:border-neonOrange/40 focus:border-neonOrange focus:ring-1 focus:ring-neonOrange/30 text-base md:text-xs text-white transition-all duration-300 bg-[#0c0a06]"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div className="flex flex-col">
                      <label className="font-cyber text-[9px] tracking-widest text-neutral-400 uppercase mb-2">Special Stylist Directives</label>
                      <textarea
                        rows="4"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="glass-card px-4 py-3 rounded-xl border border-white/10 hover:border-neonOrange/40 focus:border-neonOrange focus:ring-1 focus:ring-neonOrange/30 text-base md:text-xs text-white placeholder-neutral-600 transition-all duration-300 resize-none"
                        placeholder="Please note any skin sensitivities, specific styling ideas, or preferred artist..."
                      />
                    </div>

                    {/* Submit Button with Shimmer */}
                    <button
                      type="submit"
                      className="w-full relative overflow-hidden group flex items-center justify-center space-x-2 px-8 py-4 rounded-full bg-gradient-to-r from-neonOrange to-[#F3E5AB] text-black font-cyber font-bold tracking-widest text-[11px] uppercase shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:shadow-[0_4px_30px_rgba(212,175,55,0.6)] hover:scale-[1.01] transition-all duration-300"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Request Reservation</span>
                      {/* Button sweep reflection */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-neonOrange/10 border border-neonOrange flex items-center justify-center text-neonOrange mb-6 animate-glow">
                      <Sparkles className="w-6 h-6" />
                    </div>

                    <h3 className="font-cyber font-bold tracking-widest text-sm uppercase text-white mb-3">
                      RESERVATION REQUEST RECEIVED
                    </h3>
                    <p className="font-sans text-neutral-300 text-xs md:text-sm leading-relaxed max-w-sm font-light mb-8">
                      Thank you, <strong>{formData.name}</strong>. We have logged your request for a <strong>{formData.service.toUpperCase()}</strong> session on <strong>{formData.date}</strong>. Our luxury booking manager will call you shortly to confirm your VIP time slot.
                    </p>

                    <button
                      onClick={handleReset}
                      className="px-6 py-2.5 rounded-full border border-white/10 hover:border-neonOrange text-[11px] font-cyber tracking-widest uppercase text-white transition-all duration-300"
                    >
                      New Appointment
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
