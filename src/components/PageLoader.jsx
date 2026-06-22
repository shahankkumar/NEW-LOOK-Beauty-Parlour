import { motion } from 'framer-motion';

export default function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030303]"
    >
      {/* Background Ambient Glow */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-neonOrange/5 blur-[120px] pointer-events-none" />

      <div className="relative flex flex-col items-center">
        {/* Luxury Gold Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
          className="w-24 h-24 rounded-full border border-t-neonOrange border-r-neonOrange/30 border-b-transparent border-l-transparent"
        />

        {/* Outer slow counter-rotating ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
          className="absolute -inset-2 rounded-full border border-b-cyberOrange/20 border-l-cyberOrange/20 border-t-transparent border-r-transparent"
        />

        {/* Brand Logo & Name */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-cyber font-light tracking-[0.3em] text-xs text-white uppercase text-center"
          >
            NL
          </motion.span>
        </div>
      </div>

      {/* Brand Typography */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-8 text-center"
      >
        <h1 className="font-cyber font-bold tracking-[0.25em] text-lg text-white uppercase text-gradient">
          NEW LOOK
        </h1>
        <p className="font-sans text-[10px] tracking-[0.4em] text-neutral-500 uppercase mt-2">
          Beauty Parlour &amp; Spa
        </p>
      </motion.div>
    </motion.div>
  );
}
