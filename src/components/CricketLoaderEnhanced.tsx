import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

/**
 * ENHANCED CRICKET LOADER WITH SOUND (OPTIONAL)
 * 
 * This version includes optional stadium ambient sound.
 * To enable audio, add an audio file to public/stadium-ambient.mp3
 * 
 * Usage: Replace CricketLoader component with this version
 */

interface CricketLoaderProps {
  onComplete?: () => void;
  enableSound?: boolean;
}

export default function CricketLoaderEnhanced({ 
  onComplete,
  enableSound = false 
}: CricketLoaderProps = {}) {
  const [progress, setProgress] = useState(0);
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [showFlash, setShowFlash] = useState(false);

  const taglines = [
    "Warming up the pitch...",
    "Setting the field...",
    "Getting ready to bowl...",
    "Match starting soon!",
  ];

  useEffect(() => {
    // Optional: Play stadium ambient sound
    if (enableSound) {
      const audio = new Audio('/stadium-ambient.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Autoplay might be blocked
        console.log('Audio autoplay blocked by browser');
      });
      
      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    }
  }, [enableSound]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowFlash(true);
            onComplete?.();
          }, 200);
          return 100;
        }
        return prev + 1;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const taglineTimer = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 1500);

    return () => clearInterval(taglineTimer);
  }, []);

  // Generate more golden sparks
  const sparks = Array.from({ length: 20 }, (_, i) => i);

  return (
    <AnimatePresence>
      {progress < 100 || !showFlash ? (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#001C40] via-[#002B5C] to-[#0D1B2A] overflow-hidden z-50"
        >
          {/* Animated stadium backdrop with radial gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#002B5C]/30 via-[#001C40]/50 to-[#0D1B2A] opacity-60" />
          
          {/* Multiple floodlight effects for more depth */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-1/4 w-32 h-32 bg-[#FFCC29] rounded-full blur-[120px]"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-0 right-1/4 w-32 h-32 bg-[#FFD65C] rounded-full blur-[120px]"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#FFCC29] rounded-full blur-[150px]"
          />

          {/* Enhanced floating golden sparks */}
          {sparks.map((i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: window.innerHeight + 50,
                opacity: 0 
              }}
              animate={{
                y: -100,
                opacity: [0, 1, 1, 0],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "linear"
              }}
              className="absolute w-1 h-1 bg-[#FFCC29] rounded-full shadow-[0_0_8px_#FFCC29]"
            />
          ))}

          {/* Corner energy bursts */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={`corner-${i}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0],
                opacity: [0, 0.3, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeOut"
              }}
              className={`absolute w-20 h-20 bg-[#FFCC29] rounded-full blur-2xl ${
                i === 0 ? 'top-0 left-0' :
                i === 1 ? 'top-0 right-0' :
                i === 2 ? 'bottom-0 left-0' :
                'bottom-0 right-0'
              }`}
            />
          ))}

          {/* Main content container */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo with enhanced glow effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative mb-8 sm:mb-12"
            >
              {/* Multiple glow layers */}
              <div className="absolute inset-0 bg-[#FFCC29] blur-3xl opacity-20 scale-150" />
              <div className="absolute inset-0 bg-[#FFD65C] blur-2xl opacity-30 scale-125 animate-pulse" />
              
              {/* ICCT26 Logo */}
              <div className="relative">
                <motion.h1 
                  className="text-7xl sm:text-8xl md:text-9xl font-bebas font-bold bg-gradient-to-br from-[#FFD65C] via-[#FFCC29] to-[#D4A017] bg-clip-text text-transparent tracking-wider"
                  style={{
                    textShadow: "0 0 40px rgba(255, 204, 41, 0.5), 0 0 20px rgba(255, 204, 41, 0.3)"
                  }}
                  animate={{ 
                    filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ICCT26
                </motion.h1>
                <motion.p 
                  className="text-white/80 text-xs sm:text-sm font-quicksand tracking-[0.3em] text-center mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  CRICKET TOURNAMENT
                </motion.p>
              </div>
            </motion.div>

            {/* Progress bar container with enhanced effects */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative w-72 sm:w-80 md:w-96 mb-6"
            >
              {/* Outer glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#FFCC29]/20 via-[#FFD65C]/30 to-[#FFCC29]/20 rounded-full blur-md" />
              
              {/* Progress bar background */}
              <div className="relative h-3 sm:h-4 bg-[#0D1B2A] rounded-full overflow-hidden shadow-lg border border-[#FFCC29]/20">
                {/* Animated progress fill */}
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#FFCC29] via-[#FFD65C] to-[#FFCC29] rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                >
                  {/* Enhanced shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Secondary shimmer */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear", delay: 0.5 }}
                  />
                </motion.div>

                {/* Multiple energy sparks */}
                {progress > 5 && (
                  <>
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2"
                      style={{ left: `${progress}%` }}
                      transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    >
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-[#FFD65C] fill-[#FFD65C] drop-shadow-[0_0_6px_#FFD65C]" />
                    </motion.div>
                    {progress > 20 && (
                      <motion.div
                        className="absolute top-1/2 -translate-y-1/2"
                        style={{ left: `${progress - 5}%` }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                      >
                        <Zap className="w-2 h-2 sm:w-3 sm:h-3 text-[#FFCC29] fill-[#FFCC29] drop-shadow-[0_0_4px_#FFCC29] opacity-70" />
                      </motion.div>
                    )}
                  </>
                )}
              </div>

              {/* Rolling cricket ball with enhanced effects */}
              <motion.div
                className="absolute -top-6 sm:-top-8"
                animate={{ 
                  left: `${progress}%`,
                  rotate: progress * 7.2
                }}
                transition={{ type: "spring", stiffness: 90, damping: 12 }}
              >
                {/* Enhanced ball glow with pulse */}
                <motion.div 
                  className="absolute inset-0 bg-[#FFD65C] blur-xl opacity-50 scale-150"
                  animate={{ scale: [1.5, 1.8, 1.5], opacity: [0.5, 0.7, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                
                {/* Cricket ball SVG */}
                <svg
                  className="w-9 h-9 sm:w-12 sm:h-12 relative drop-shadow-[0_0_12px_#FFD65C]"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <radialGradient id="ballGradient" cx="35%" cy="35%">
                      <stop offset="0%" stopColor="#FF6B6B" />
                      <stop offset="70%" stopColor="#C92A2A" />
                      <stop offset="100%" stopColor="#8B1C1C" />
                    </radialGradient>
                  </defs>
                  <circle cx="50" cy="50" r="48" fill="url(#ballGradient)" />
                  <path d="M 30 20 Q 50 30 70 20" stroke="#FFF" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M 30 80 Q 50 70 70 80" stroke="#FFF" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <line x1="28" y1="22" x2="26" y2="26" stroke="#FFF" strokeWidth="1.5" />
                  <line x1="50" y1="18" x2="50" y2="22" stroke="#FFF" strokeWidth="1.5" />
                  <line x1="72" y1="22" x2="74" y2="26" stroke="#FFF" strokeWidth="1.5" />
                  <line x1="28" y1="78" x2="26" y2="74" stroke="#FFF" strokeWidth="1.5" />
                  <line x1="50" y1="82" x2="50" y2="78" stroke="#FFF" strokeWidth="1.5" />
                  <line x1="72" y1="78" x2="74" y2="74" stroke="#FFF" strokeWidth="1.5" />
                  <ellipse cx="38" cy="35" rx="12" ry="8" fill="white" opacity="0.3" />
                </svg>

                {/* Enhanced motion trail */}
                {progress > 0 && (
                  <>
                    <motion.div
                      className="absolute top-1/2 right-full w-16 h-1 bg-gradient-to-l from-[#FFD65C] to-transparent blur-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.6, 0.3, 0.6] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute top-1/2 right-full w-24 h-0.5 bg-gradient-to-l from-[#FFCC29]/50 to-transparent blur-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.4, 0.2, 0.4] }}
                      transition={{ duration: 0.7, repeat: Infinity, delay: 0.2 }}
                    />
                  </>
                )}
              </motion.div>
            </motion.div>

            {/* Percentage counter with impact effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center mb-4"
            >
              <motion.p
                key={progress}
                initial={{ scale: 1 }}
                animate={{ 
                  scale: progress % 10 === 0 && progress > 0 ? [1, 1.2, 1] : 1 
                }}
                className="text-[#FFCC29] font-bold text-3xl sm:text-4xl tracking-widest font-bebas"
                style={{
                  textShadow: "0 0 20px rgba(255, 204, 41, 0.8), 0 0 40px rgba(255, 204, 41, 0.4)"
                }}
              >
                {progress}%
              </motion.p>
            </motion.div>

            {/* Dynamic tagline with fade transition */}
            <AnimatePresence mode="wait">
              <motion.p
                key={taglineIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="text-white/80 text-sm sm:text-base font-quicksand font-medium tracking-wide text-center"
              >
                {taglines[taglineIndex]}
              </motion.p>
            </AnimatePresence>

            {/* Stadium ambience text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-[#FFCC29]/60 text-xs sm:text-sm font-manrope tracking-[0.2em] uppercase mt-8"
            >
              CSI St. Peter's Church
            </motion.p>
          </div>

          {/* Bottom light sweep */}
          <motion.div
            className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#FFCC29] to-transparent opacity-30"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />

          {/* Side light sweeps */}
          <motion.div
            className="absolute top-0 left-0 h-full w-2 bg-gradient-to-b from-transparent via-[#FFD65C] to-transparent opacity-20"
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 0.5 }}
          />
          <motion.div
            className="absolute top-0 right-0 h-full w-2 bg-gradient-to-b from-transparent via-[#FFD65C] to-transparent opacity-20"
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1.5 }}
          />
        </motion.div>
      ) : null}

      {/* Enhanced white flash transition with camera shake */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              scale: [1, 1.05, 1.1, 1]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, times: [0, 0.2, 0.5, 1] }}
            className="fixed inset-0 bg-white z-[60]"
          />
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
