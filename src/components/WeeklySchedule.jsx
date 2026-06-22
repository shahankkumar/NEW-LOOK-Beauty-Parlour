import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, Lock, Save, Edit3, ShieldCheck } from 'lucide-react';

const defaultSchedule = [
  { day: 'Monday',    open: '10:00 AM', close: '8:00 PM',  closed: false },
  { day: 'Tuesday',   open: '10:00 AM', close: '8:00 PM',  closed: false },
  { day: 'Wednesday', open: '10:00 AM', close: '8:00 PM',  closed: false },
  { day: 'Thursday',  open: '10:00 AM', close: '8:00 PM',  closed: false },
  { day: 'Friday',    open: '10:00 AM', close: '8:00 PM',  closed: false },
  { day: 'Saturday',  open: '09:00 AM', close: '9:00 PM',  closed: false },
  { day: 'Sunday',    open: '11:00 AM', close: '6:00 PM',  closed: false },
];

const loadSchedule = () => {
  try {
    const saved = localStorage.getItem('newlook_schedule');
    return saved ? JSON.parse(saved) : defaultSchedule;
  } catch { return defaultSchedule; }
};

export default function WeeklySchedule() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const [schedule, setSchedule]     = useState(loadSchedule);
  const [editMode, setEditMode]     = useState(false);
  const [editData, setEditData]     = useState([]);
  const [showLogin, setShowLogin]   = useState(false);
  const [loginId, setLoginId]       = useState('');
  const [loginPass, setLoginPass]   = useState('');
  const [loginError, setLoginError] = useState('');
  const [saveFlash, setSaveFlash]   = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginId === 'admin' && loginPass === 'admin') {
      setLoginError(''); setLoginId(''); setLoginPass('');
      setShowLogin(false);
      setEditData(JSON.parse(JSON.stringify(schedule)));
      setEditMode(true);
    } else {
      setLoginError('Invalid ID or Password. Please try again.');
    }
  };

  const handleSave = () => {
    setSchedule(editData);
    localStorage.setItem('newlook_schedule', JSON.stringify(editData));
    setEditMode(false);
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 3000);
  };

  const updateRow = (i, field, value) => {
    const u = [...editData];
    u[i] = { ...u[i], [field]: value };
    setEditData(u);
  };

  const rows = editMode ? editData : schedule;

  return (
    <section id="schedule" className="relative py-24 bg-darkBg overflow-hidden border-t border-white/5">
      {/* Background glow */}
      <div className="glow-orb w-[400px] h-[400px] bg-neonOrange/5 top-1/2 right-10 -translate-y-1/2" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="font-cyber tracking-[0.4em] text-[10px] text-neonOrange uppercase block mb-3">Visit Us</span>
          <h2 className="font-cyber font-black text-3xl md:text-5xl uppercase tracking-wider text-white">
            WEEKLY SCHEDULE
          </h2>
          <p className="font-sans text-neutral-500 text-xs md:text-sm tracking-wide mt-4 max-w-sm mx-auto">
            Walk in or book in advance — we're open all week to serve you.
          </p>
          <div className="w-16 h-[2px] bg-neonOrange mx-auto mt-6" />
        </div>

        {/* Schedule Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#12100c]/90 via-[#0a0907]/95 to-[#050505]/98 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.85)] backdrop-blur-md overflow-hidden"
        >
          {/* Corner bracket decorations */}
          <div className="absolute top-0 left-0 w-5 h-5 border-l border-t border-[#D4AF37]/30 rounded-tl-2xl z-10" />
          <div className="absolute top-0 right-0 w-5 h-5 border-r border-t border-[#D4AF37]/30 rounded-tr-2xl z-10" />
          <div className="absolute bottom-0 left-0 w-5 h-5 border-l border-b border-[#D4AF37]/30 rounded-bl-2xl z-10" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-r border-b border-[#D4AF37]/30 rounded-br-2xl z-10" />

          {/* Card top bar */}
          <div className="flex items-center justify-between px-7 py-4 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-neonOrange" />
              <span className="font-cyber text-[9px] tracking-[0.35em] text-neutral-400 uppercase">Operating Hours</span>
            </div>
            {!editMode ? (
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => { setShowLogin(true); setLoginError(''); }}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 hover:border-neonOrange/50 hover:text-neonOrange text-neutral-500 transition-all duration-300 font-cyber text-[9px] tracking-widest uppercase"
              >
                <Edit3 className="w-3 h-3" />
                Edit
              </motion.button>
            ) : (
              <div className="flex items-center gap-2">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setEditMode(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 text-neutral-400 hover:text-white transition-all font-cyber text-[9px] tracking-widest uppercase">
                  <X className="w-3 h-3" /> Cancel
                </motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={handleSave}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-neonOrange/40 bg-neonOrange/10 text-neonOrange hover:bg-neonOrange/20 transition-all font-cyber text-[9px] tracking-widest uppercase shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                  <Save className="w-3 h-3" /> Save
                </motion.button>
              </div>
            )}
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/[0.04] px-2">
            {rows.map((row, i) => {
              const isToday = row.day === today;
              return (
                <motion.div
                  key={row.day}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  className={`relative flex items-center justify-between px-5 py-4 rounded-xl mx-0 my-1 transition-all duration-300 ${
                    isToday
                      ? 'bg-gradient-to-r from-neonOrange/10 to-transparent border border-neonOrange/20 shadow-[0_0_20px_rgba(212,175,55,0.07)]'
                      : 'hover:bg-white/[0.02]'
                  }`}
                >
                  {/* Day name */}
                  <div className="flex items-center gap-3">
                    {isToday && (
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neonOrange opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-neonOrange" />
                      </span>
                    )}
                    <span className={`font-cyber tracking-[0.2em] text-sm uppercase ${isToday ? 'text-neonOrange' : 'text-white/75'}`}>
                      {row.day}
                    </span>
                    {isToday && (
                      <span className="font-cyber text-[8px] tracking-widest text-neonOrange/70 border border-neonOrange/25 px-2 py-0.5 rounded-full">
                        Today
                      </span>
                    )}
                  </div>

                  {/* Right side: time or edit inputs */}
                  {editMode ? (
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={row.closed}
                          onChange={(e) => updateRow(i, 'closed', e.target.checked)}
                          className="accent-neonOrange w-3 h-3" />
                        <span className="font-cyber text-[8px] tracking-widest uppercase text-neutral-500">Closed</span>
                      </label>
                      {!row.closed && (
                        <div className="flex items-center gap-2">
                          <input type="text" value={row.open} onChange={(e) => updateRow(i, 'open', e.target.value)}
                            className="bg-black/50 border border-white/10 focus:border-neonOrange rounded-lg px-3 py-1.5 text-white text-xs w-24 focus:outline-none transition-colors text-center" />
                          <span className="text-neutral-600">—</span>
                          <input type="text" value={row.close} onChange={(e) => updateRow(i, 'close', e.target.value)}
                            className="bg-black/50 border border-white/10 focus:border-neonOrange rounded-lg px-3 py-1.5 text-white text-xs w-24 focus:outline-none transition-colors text-center" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      {row.closed ? (
                        <span className="font-cyber text-[9px] tracking-widest text-red-400/70 uppercase border border-red-400/15 px-3 py-1 rounded-full bg-red-400/5">
                          Closed
                        </span>
                      ) : (
                        <>
                          <span className={`font-sans text-sm tracking-wide tabular-nums ${isToday ? 'text-white' : 'text-neutral-400'}`}>
                            {row.open} – {row.close}
                          </span>
                          <div className={`w-2 h-2 rounded-full shrink-0 ${isToday ? 'bg-neonOrange shadow-[0_0_8px_rgba(212,175,55,0.9)]' : 'bg-emerald-500/40'}`} />
                        </>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Card footer */}
          <div className="flex items-center justify-between px-7 py-4 border-t border-white/5 mt-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-700" />
              <p className="font-sans text-[10px] text-neutral-600 tracking-wide">Hours may vary on public holidays.</p>
            </div>
            <AnimatePresence>
              {saveFlash && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="font-cyber text-[9px] tracking-widest text-neonOrange uppercase">
                  ✓ Schedule saved
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowLogin(false)} />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative bg-[#050505] border border-white/10 p-8 rounded-2xl w-full max-w-sm shadow-[0_0_50px_rgba(212,175,55,0.15)] overflow-hidden"
            >
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-[#D4AF37]/40 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-[#D4AF37]/40 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-[#D4AF37]/40 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-[#D4AF37]/40 rounded-br-2xl" />

              <button onClick={() => setShowLogin(false)}
                className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-neonOrange/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-neonOrange/20">
                  <Lock className="w-5 h-5 text-neonOrange" />
                </div>
                <h2 className="font-cyber font-bold text-xl text-white uppercase tracking-widest">Admin Portal</h2>
                <p className="font-sans text-xs text-neutral-500 mt-2">Enter credentials to edit the schedule.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block font-sans text-[10px] text-neutral-400 uppercase tracking-widest mb-1.5">Admin ID</label>
                  <input type="text" value={loginId} onChange={(e) => setLoginId(e.target.value)} autoFocus
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-neonOrange focus:outline-none transition-colors placeholder-neutral-700"
                    placeholder="Enter ID" />
                </div>
                <div>
                  <label className="block font-sans text-[10px] text-neutral-400 uppercase tracking-widest mb-1.5">Password</label>
                  <input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-neonOrange focus:outline-none transition-colors placeholder-neutral-700"
                    placeholder="Enter Password" />
                </div>

                <AnimatePresence>
                  {loginError && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="text-red-400 text-xs text-center font-sans">
                      {loginError}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-neonOrange to-cyberOrange text-black font-cyber font-bold text-xs uppercase tracking-widest shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] transition-all duration-300">
                  Unlock Editor
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
