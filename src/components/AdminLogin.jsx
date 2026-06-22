import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock } from 'lucide-react';

export default function AdminLogin({ isOpen, onClose, setIsAdmin }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (id === 'admin' && password === 'admin') {
      setIsAdmin(true);
      onClose();
      // Reset form
      setId('');
      setPassword('');
      setError('');
    } else {
      setError('Invalid ID or Password');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-[#050505] border border-white/10 p-8 rounded-2xl w-full max-w-sm shadow-[0_0_50px_rgba(212,175,55,0.15)]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-neonOrange/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-neonOrange/20">
                <Lock className="w-5 h-5 text-neonOrange" />
              </div>
              <h2 className="font-cyber font-bold text-xl text-white uppercase tracking-widest">Admin Portal</h2>
              <p className="font-sans text-xs text-neutral-500 mt-2">Enter credentials to manage the gallery.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block font-sans text-[10px] text-neutral-400 uppercase tracking-widest mb-1.5">Admin ID</label>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white text-base md:text-sm focus:border-neonOrange focus:outline-none transition-colors"
                  placeholder="Enter ID"
                />
              </div>
              <div>
                <label className="block font-sans text-[10px] text-neutral-400 uppercase tracking-widest mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white text-base md:text-sm focus:border-neonOrange focus:outline-none transition-colors"
                  placeholder="Enter Password"
                />
              </div>

              {error && <p className="text-red-500 text-xs text-center font-sans mt-2">{error}</p>}

              <button
                type="submit"
                className="w-full bg-neonOrange text-black font-cyber font-bold uppercase tracking-widest text-xs py-3 rounded-lg hover:bg-white transition-colors mt-6"
              >
                Login
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
