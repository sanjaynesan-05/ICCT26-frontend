import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

interface CricketLoaderProps {
  onComplete?: () => void;
}

export default function CricketLoader({ onComplete }: CricketLoaderProps) {
  const [stage, setStage] = useState(0); // 0: Welcome/Progress, 1: Countdown, 2: Get Ready
  const [countdownNum, setCountdownNum] = useState(3);
  const [progress, setProgress] = useState(0);
  const [showFlash, setShowFlash] = useState(false);

  // Stage 0: Progress animation before countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStage(1); // Move to countdown stage
          return 100;
        }
        return prev + 1;
      });
    }, 45); // ~4.5 seconds to complete

    return () => clearInterval(interval);
  }, []);

  // Stage 1: Cricket Countdown (4.5 seconds total) - 3 to 1 with cricket themes
  // 1.5 seconds per number: 1s countdown + 0.5s icon display
  useEffect(() => {
    if (stage === 1) {
      setCountdownNum(3);
      const interval = setInterval(() => {
        setCountdownNum((prev) => {
          if (prev === 1) {
            setTimeout(() => setStage(2), 100);
            return 0;
          }
          return prev - 1;
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [stage]);

  // Stage 2: GET READY (final 1 second)
  useEffect(() => {
    if (stage === 2) {
      const timer = setTimeout(() => {
        setShowFlash(true);
        if (onComplete) {
          setTimeout(() => onComplete(), 500);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [stage, onComplete]);

  // Generate floating sparks with stable keys and random properties
  const sparks = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        key: `spark-${i}`,
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 2,
      })),
    []
  );

  return (
    <AnimatePresence mode="wait">
      {(!showFlash) ? (
        <motion.div
          key="loader-content"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#001C40] via-[#002B5C] to-[#0D1B2A] overflow-hidden z-50"
        >
          {/* Animated stadium backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#002B5C]/30 via-[#001C40]/50 to-[#0D1B2A] opacity-60" />
          
          {/* Floodlight effects */}
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

          {/* Floating golden sparks */}
          {sparks.map((spark) => (
            <motion.div
              key={spark.key}
              initial={{
                x: spark.x,
                y: spark.y,
                opacity: 0
              }}
              animate={{
                y: spark.y - 200,
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: spark.duration,
                repeat: Infinity,
                delay: spark.delay,
                ease: "linear"
              }}
              className="absolute w-1 h-1 bg-[#FFCC29] rounded-full shadow-[0_0_8px_#FFCC29]"
            />
          ))}

          {/* Main content container */}
          <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8">
            {/* STAGE 0: WELCOME/PROGRESS BAR */}
            {stage === 0 && (
              <>
                {/* Church Name - Top Highlighted */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="mb-6 sm:mb-8 md:mb-10 flex flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8"
                >
                  {/* Church Logo */}
                  <motion.img
                    src="/churchlogo.png"
                    alt="Church Logo"
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex-shrink-0"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                  />

                  {/* Text Block */}
                  <div className="flex flex-col items-center text-center">
                    <motion.div
                      className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bebas tracking-wider whitespace-nowrap mb-1"
                    >
                      <motion.span
                        style={{
                          textShadow: "0 0 20px rgba(255, 204, 41, 0.8), 0 0 40px rgba(255, 204, 41, 0.6), 0 0 60px rgba(255, 204, 41, 0.4)",
                          background: "linear-gradient(45deg, #FFD65C, #FFCC29, #FFD65C)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text"
                        }}
                        animate={{
                          textShadow: [
                            "0 0 20px rgba(255, 204, 41, 0.8), 0 0 40px rgba(255, 204, 41, 0.6)",
                            "0 0 25px rgba(255, 204, 41, 1), 0 0 50px rgba(255, 204, 41, 0.8)",
                            "0 0 20px rgba(255, 204, 41, 0.8), 0 0 40px rgba(255, 204, 41, 0.6)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        CSI St. Peter's Church
                      </motion.span>
                    </motion.div>
                    <motion.div
                      className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bebas tracking-wider whitespace-nowrap"
                    >
                      <motion.span
                        style={{
                          textShadow: "0 0 20px rgba(255, 204, 41, 0.8), 0 0 40px rgba(255, 204, 41, 0.6), 0 0 60px rgba(255, 204, 41, 0.4)",
                          background: "linear-gradient(45deg, #FFD65C, #FFCC29, #FFD65C)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text"
                        }}
                        animate={{
                          textShadow: [
                            "0 0 20px rgba(255, 204, 41, 0.8), 0 0 40px rgba(255, 204, 41, 0.6)",
                            "0 0 25px rgba(255, 204, 41, 1), 0 0 50px rgba(255, 204, 41, 0.8)",
                            "0 0 20px rgba(255, 204, 41, 0.8), 0 0 40px rgba(255, 204, 41, 0.6)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        Youth Fellowship
                      </motion.span>
                    </motion.div>
                  </div>

                  {/* Adonai Logo */}
                  <motion.img
                    src="/adonailogo.png"
                    alt="Adonai Logo"
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex-shrink-0"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                  />
                </motion.div>

                {/* Logo with glow effect */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="relative mb-6 sm:mb-8 md:mb-10"
                >
                  {/* Glow behind logo */}
                  <div className="absolute inset-0 bg-[#FFCC29] blur-3xl opacity-20 scale-150" />

                  {/* ICCT26 Logo */}
                  <div className="relative text-center">
                    <motion.h1
                      className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bebas font-black bg-gradient-to-br from-[#FFD65C] via-[#FFCC29] to-[#D4A017] bg-clip-text text-transparent tracking-wider"
                      style={{
                        textShadow: "0 0 50px rgba(255, 204, 41, 0.6), 0 0 30px rgba(255, 204, 41, 0.4), 0 0 80px rgba(255, 204, 41, 0.3)"
                      }}
                    >
                      ICCT'26
                    </motion.h1>
                    <motion.p
                      className="text-white/80 text-xs sm:text-sm md:text-base font-quicksand tracking-[0.2em] sm:tracking-[0.3em] text-center mt-2 leading-tight"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <span className="block sm:inline">INTER CHURCH</span>
                      <span className="block sm:inline sm:ml-2">CRICKET TOURNAMENT</span>
                    </motion.p>
                  </div>
                </motion.div>

                {/* Progress bar container */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mb-6 sm:mb-8"
                >
                  {/* Progress bar background */}
                  <div className="relative h-3 sm:h-4 bg-[#0D1B2A] rounded-full overflow-hidden shadow-lg border border-[#FFCC29]/20">
                    {/* Animated progress fill */}
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#FFCC29] via-[#FFD65C] to-[#FFCC29] rounded-full"
                      style={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    >
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.div>

                    {/* Energy sparks following the ball */}
                    {progress > 5 && (
                      <motion.div
                        className="absolute top-1/2 -translate-y-1/2"
                        style={{ left: `${progress}%` }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                      >
                        <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-[#FFD65C] fill-[#FFD65C] drop-shadow-[0_0_6px_#FFD65C]" />
                      </motion.div>
                    )}
                  </div>

                  {/* Rolling cricket ball */}
                  <motion.div
                    className="absolute -top-6 sm:-top-8"
                    animate={{
                      left: `${progress}%`,
                      rotate: progress * 7.2 // Full rotation every ~50%
                    }}
                    transition={{ type: "spring", stiffness: 90, damping: 12 }}
                  >
                    {/* Ball glow */}
                    <div className="absolute inset-0 bg-[#FFD65C] blur-xl opacity-50 scale-150" />

                    {/* Cricket ball SVG */}
                    <svg
                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 relative drop-shadow-[0_0_12px_#FFD65C]"
                      viewBox="0 0 100 100"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Ball body */}
                      <defs>
                        <radialGradient id="ballGradient" cx="35%" cy="35%">
                          <stop offset="0%" stopColor="#FF6B6B" />
                          <stop offset="70%" stopColor="#C92A2A" />
                          <stop offset="100%" stopColor="#8B1C1C" />
                        </radialGradient>
                      </defs>
                      <circle cx="50" cy="50" r="48" fill="url(#ballGradient)" />

                      {/* Stitching */}
                      <path
                        d="M 30 20 Q 50 30 70 20"
                        stroke="#FFF"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 30 80 Q 50 70 70 80"
                        stroke="#FFF"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <line x1="28" y1="22" x2="26" y2="26" stroke="#FFF" strokeWidth="1.5" />
                      <line x1="50" y1="18" x2="50" y2="22" stroke="#FFF" strokeWidth="1.5" />
                      <line x1="72" y1="22" x2="74" y2="26" stroke="#FFF" strokeWidth="1.5" />
                      <line x1="28" y1="78" x2="26" y2="74" stroke="#FFF" strokeWidth="1.5" />
                      <line x1="50" y1="82" x2="50" y2="78" stroke="#FFF" strokeWidth="1.5" />
                      <line x1="72" y1="78" x2="74" y2="74" stroke="#FFF" strokeWidth="1.5" />

                      {/* Shine effect */}
                      <ellipse cx="38" cy="35" rx="12" ry="8" fill="white" opacity="0.3" />
                    </svg>

                    {/* Motion trail */}
                    {progress > 0 && (
                      <motion.div
                        className="absolute top-1/2 right-full w-12 sm:w-16 h-1 bg-gradient-to-l from-[#FFD65C] to-transparent blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.6, 0.3, 0.6] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                </motion.div>

                {/* Percentage counter */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-center mb-4 sm:mb-6"
                >
                  <motion.p
                    key={progress}
                    initial={{ scale: 1 }}
                    animate={{ scale: progress % 10 === 0 ? [1, 1.1, 1] : 1 }}
                    className="text-[#FFCC29] font-bold text-2xl sm:text-3xl md:text-4xl tracking-widest font-bebas"
                    style={{
                      textShadow: "0 0 20px rgba(255, 204, 41, 0.8), 0 0 40px rgba(255, 204, 41, 0.4)"
                    }}
                  >
                    {progress}%
                  </motion.p>
                </motion.div>

                {/* Warming up tagline */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-white/80 text-sm sm:text-base md:text-lg font-quicksand font-medium tracking-wide text-center px-4"
                >
                  Warming up the pitch...
                </motion.p>
              </>
            )}

            {/* STAGE 1: CRICKET COUNTDOWN - 4.5 SECONDS */}
            {stage === 1 && (
              <motion.div
                key={`countdown-${countdownNum}`}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="flex flex-col items-center justify-center w-full h-full"
              >
                {/* Number 3 - BATTING */}
                {countdownNum === 3 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="relative flex flex-col items-center justify-center"
                  >
                    {/* Impact Number */}
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{
                        scale: [0, 1.3, 1],
                        rotate: [45, -5, 0],
                        y: [0, -10, 0]
                      }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{
                        duration: 0.4,
                        times: [0, 0.6, 1],
                        ease: [0.34, 1.56, 0.64, 1]
                      }}
                      className="text-[12rem] sm:text-[16rem] md:text-[20rem] font-black leading-none"
                      style={{
                        color: '#FFCC29',
                        textShadow: '0 0 60px rgba(255, 204, 41, 1), 0 0 100px rgba(255, 204, 41, 0.6), 0 10px 40px rgba(0, 0, 0, 0.8)',
                        WebkitTextStroke: '3px rgba(255, 215, 0, 0.5)',
                      }}
                    >
                      3
                    </motion.div>

                    {/* Batting Icon Image */}
                    <motion.img
                      src="/intro/batting.png"
                      alt="Batting"
                      initial={{ x: -200, opacity: 0, scale: 0.5 }}
                      animate={{ x: 0, opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
                      className="absolute -top-20 w-80 h-80 sm:w-[28rem] sm:h-[28rem] md:w-[32rem] md:h-[32rem] object-contain z-10"
                    />

                    {/* Batting Streak Effect */}
                    <motion.div
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute w-96 h-2 bg-gradient-to-r from-transparent via-[#FFCC29] to-transparent"
                    />
                  </motion.div>
                )}

                {/* Number 2 - BOWLING */}
                {countdownNum === 2 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="relative flex flex-col items-center justify-center"
                  >
                    {/* Impact Number */}
                    <motion.div
                      initial={{ scale: 0, rotate: 45 }}
                      animate={{
                        scale: [0, 1.3, 1],
                        rotate: [-45, 5, 0],
                        y: [0, -10, 0]
                      }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{
                        duration: 0.4,
                        times: [0, 0.6, 1],
                        ease: [0.34, 1.56, 0.64, 1]
                      }}
                      className="text-[12rem] sm:text-[16rem] md:text-[20rem] font-black leading-none"
                      style={{
                        color: '#FFCC29',
                        textShadow: '0 0 60px rgba(255, 204, 41, 1), 0 0 100px rgba(255, 204, 41, 0.6), 0 10px 40px rgba(0, 0, 0, 0.8)',
                        WebkitTextStroke: '3px rgba(255, 215, 0, 0.5)',
                      }}
                    >
                      2
                    </motion.div>

                    {/* Bowling Icon Image */}
                    <motion.img
                      src="/intro/bowling.png"
                      alt="Bowling"
                      initial={{ x: 200, opacity: 0, scale: 0.5 }}
                      animate={{ x: 0, opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
                      className="absolute -top-20 w-80 h-80 sm:w-[28rem] sm:h-[28rem] md:w-[32rem] md:h-[32rem] object-contain z-10"
                    />

                    {/* Ball Whoosh Effect */}
                    <motion.div
                      initial={{ x: -200, opacity: 0, scaleX: 2 }}
                      animate={{ x: 200, opacity: [0, 1, 0], scaleX: [2, 1, 2] }}
                      transition={{ duration: 0.6, ease: "linear" }}
                      className="absolute w-32 h-32 bg-[#FFCC29] rounded-full blur-xl opacity-40"
                    />
                  </motion.div>
                )}

                {/* Number 1 - WICKET KEEPING */}
                {countdownNum === 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="relative flex flex-col items-center justify-center"
                  >
                    {/* Impact Number */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{
                        scale: [0, 1.5, 1],
                        y: [0, -15, 0]
                      }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{
                        duration: 0.4,
                        times: [0, 0.5, 1],
                        ease: [0.34, 1.56, 0.64, 1]
                      }}
                      className="text-[12rem] sm:text-[16rem] md:text-[20rem] font-black leading-none"
                      style={{
                        color: '#FFCC29',
                        textShadow: '0 0 60px rgba(255, 204, 41, 1), 0 0 100px rgba(255, 204, 41, 0.6), 0 10px 40px rgba(0, 0, 0, 0.8)',
                        WebkitTextStroke: '3px rgba(255, 215, 0, 0.5)',
                      }}
                    >
                      1
                    </motion.div>

                    {/* Wicket Keeping Icon Image */}
                    <motion.img
                      src="/intro/wicketkeeping.png"
                      alt="Wicket Keeper"
                      initial={{ y: -200, opacity: 0, scale: 0.5 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
                      className="absolute -top-20 w-80 h-80 sm:w-[28rem] sm:h-[28rem] md:w-[32rem] md:h-[32rem] object-contain z-10"
                    />

                    {/* Explosion Ring Effect */}
                    <motion.div
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: [0, 3], opacity: [1, 0] }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute w-64 h-64 border-4 border-[#FFCC29] rounded-full"
                    />
                    <motion.div
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: [0, 2.5], opacity: [1, 0] }}
                      transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                      className="absolute w-64 h-64 border-4 border-[#FFCC29] rounded-full"
                    />
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* STAGE 2: GET READY */}
            {stage === 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex flex-col items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{
                    scale: [0, 1.2, 1],
                    rotate: [-10, 5, 0]
                  }}
                  transition={{
                    duration: 0.5,
                    times: [0, 0.6, 1],
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                  className="text-center"
                >
                  <div
                    className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-wider"
                    style={{
                      color: '#FFCC29',
                      textShadow: '0 0 80px rgba(255, 204, 41, 1), 0 0 120px rgba(255, 204, 41, 0.8), 0 15px 50px rgba(0, 0, 0, 0.9)',
                      WebkitTextStroke: '2px rgba(255, 215, 0, 0.6)',
                    }}
                  >
                    GET READY
                  </div>
                </motion.div>

                {/* Explosive Flash Effect */}
                <motion.div
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: [0, 4], opacity: [0.8, 0] }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute w-96 h-96 bg-[#FFCC29] rounded-full blur-3xl"
                />
              </motion.div>
            )}
          </div>

          {/* Bottom light sweep */}
          <motion.div
            className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#FFCC29] to-transparent opacity-30"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      ) : null}

      {/* White flash transition */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            key="flash-transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-white z-[60]"
          />
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
