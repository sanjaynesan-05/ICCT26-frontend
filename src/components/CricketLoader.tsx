/**
 * ICCT'27 cinematic intro — "Matchday" theme, ~6s, skippable, once per session.
 *
 *   0.00s  OPEN     letterbox, floodlights bang on one by one, "presents" card
 *   0.70s  BALL     fireball delivery from deep in the stadium, camera tremor
 *   1.90s  IMPACT   white-out, double shockwave, sparks, hard shake, broadcast slashes
 *   2.25s  MONTAGE  THE SPIRIT · THE SKILL · THE GLORY — full-screen trailer cuts
 *   3.55s  TITLE    3D ICCT'27 slams in from blur, shockwave, lens flare, light sweep
 *   5.45s  EXIT     letterbox retracts, fly-through zoom → site
 *
 * Always on: film grain, vignette, rising embers, perspective pitch grid.
 * "Reduce motion" users get a calm 0.9s logo fade.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

interface CricketLoaderProps {
  onComplete?: () => void
}

type Stage = 'open' | 'ball' | 'impact' | 'montage' | 'title' | 'exit'

const T = { ball: 700, impact: 1900, montage: 2250, title: 3550, exit: 5450, done: 6000 }
const T_REDUCED = { exit: 700, done: 900 }
const MONTAGE = [
  { word: 'THE SPIRIT', panel: 'bg-gold', text: 'text-ink-900' },
  { word: 'THE SKILL', panel: 'bg-flame', text: 'text-white' },
  { word: 'THE GLORY', panel: 'bg-ink-950', text: 'text-gold' },
]
const CUT_MS = (T.title - T.montage) / MONTAGE.length

// 3D extrusions — stacked shadows darken with depth
const GOLD_EXTRUDE = [
  '0 1px 0 #F2B500', '0 2px 0 #E5A800', '0 3px 0 #D69C00', '0 4px 0 #C68F00', '0 5px 0 #B58200',
  '0 6px 0 #A37400', '0 7px 0 #8F6600', '0 8px 0 #7A5700', '0 9px 0 #664800', '0 10px 0 #523A00',
  '0 24px 34px rgba(0,0,0,0.6)', '0 0 80px rgba(255,194,26,0.35)',
].join(', ')
const WHITE_EXTRUDE = [
  '0 1px 0 #D9DEE8', '0 2px 0 #C3CAD8', '0 3px 0 #AEB6C7', '0 4px 0 #98A2B6', '0 5px 0 #838EA4',
  '0 6px 0 #6F7A92', '0 7px 0 #5B6680', '0 20px 30px rgba(0,0,0,0.6)',
].join(', ')

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.9'/></svg>\")"

const SHAKE_HARD = { x: [0, -16, 14, -11, 9, -6, 4, -2, 0], y: [0, 10, -12, 8, -6, 4, -3, 1, 0] }
const SHAKE_SOFT = { x: [0, -3, 3, -2, 2, 0], y: [0, 2, -2, 1, -1, 0] }

/* ================================================================== */
/* Atmosphere                                                          */
/* ================================================================== */

const PitchGrid = () => (
  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] overflow-hidden [perspective:420px]">
    <div
      className="absolute -inset-x-1/2 bottom-[-20%] h-[160%] origin-bottom"
      style={{
        transform: 'rotateX(72deg)',
        backgroundImage:
          'linear-gradient(rgba(255,194,26,0.4) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(255,194,26,0.2) 1.5px, transparent 1.5px)',
        backgroundSize: '64px 64px',
        animation: 'icct-grid 0.45s linear infinite',
        maskImage: 'linear-gradient(to top, black 10%, transparent 85%)',
        WebkitMaskImage: 'linear-gradient(to top, black 10%, transparent 85%)',
      }}
    />
    <div
      className="absolute bottom-[-20%] left-1/2 h-[160%] w-28 origin-bottom"
      style={{
        transform: 'translateX(-50%) rotateX(72deg)',
        background: 'linear-gradient(to top, rgba(31,164,99,0.5), rgba(31,164,99,0) 80%)',
      }}
    />
  </div>
)

/** Four floodlight towers that bang on one after another, then sweep. */
const Floodlights = () => {
  const towers = [
    { left: '6%', delay: 0.05, side: -1 },
    { left: '28%', delay: 0.2, side: -1 },
    { left: '72%', delay: 0.35, side: 1 },
    { left: '94%', delay: 0.5, side: 1 },
  ]
  return (
    <>
      {towers.map((t, i) => (
        // Static wrapper does the centring; the inner beam only rotates
        <div
          key={i}
          className="pointer-events-none absolute top-[-25%] h-[135%] w-[34vw] min-w-[180px] -translate-x-1/2"
          style={{ left: t.left }}
        >
          <motion.div
            className="h-full w-full mix-blend-screen blur-2xl"
            style={{
              transformOrigin: 'top center',
              background: 'linear-gradient(to bottom, rgba(255,244,214,0.7), rgba(255,244,214,0) 72%)',
              clipPath: 'polygon(42% 0, 58% 0, 100% 100%, 0 100%)',
            }}
            initial={{ opacity: 0, rotate: t.side * 22 }}
            animate={{ opacity: [0, 1, 0.75, 0.55], rotate: [t.side * 22, t.side * 22, t.side * -8, t.side * 4] }}
            transition={{ duration: 3.2, delay: t.delay, times: [0, 0.04, 0.45, 1], ease: 'easeInOut' }}
          />
        </div>
      ))}
      {towers.map((t, i) => (
        <motion.span
          key={`lamp-${i}`}
          className="pointer-events-none absolute top-5 h-2.5 w-14 -translate-x-1/2 rounded-full bg-white shadow-[0_0_50px_16px_rgba(255,244,214,0.8)]"
          style={{ left: t.left }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.3, 1] }}
          transition={{ duration: 0.35, delay: t.delay, times: [0, 0.2, 0.5, 1] }}
        />
      ))}
    </>
  )
}

/** Glowing embers drifting upward for the whole intro. */
const Embers = () => {
  const embers = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => ({
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 2.6 + Math.random() * 2.4,
        delay: Math.random() * 2.5,
        drift: (Math.random() - 0.5) * 120,
        gold: i % 3 !== 0,
      })),
    []
  )
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {embers.map((e, i) => (
        <motion.span
          key={i}
          className={`absolute bottom-[-10px] rounded-full ${e.gold ? 'bg-gold' : 'bg-flame-light'}`}
          style={{
            left: `${e.left}%`,
            width: e.size,
            height: e.size,
            boxShadow: `0 0 ${e.size * 3}px ${e.size}px ${e.gold ? 'rgba(255,194,26,0.6)' : 'rgba(255,90,102,0.6)'}`,
          }}
          initial={{ y: 0, x: 0, opacity: 0 }}
          animate={{ y: '-110vh', x: e.drift, opacity: [0, 1, 1, 0] }}
          transition={{ duration: e.duration, delay: e.delay, repeat: Infinity, ease: 'easeOut', times: [0, 0.1, 0.7, 1] }}
        />
      ))}
    </div>
  )
}

/** Cinematic letterbox bars — retract on exit. */
const Letterbox = ({ open }: { open: boolean }) => (
  <>
    {(['top', 'bottom'] as const).map((side) => (
      <motion.div
        key={side}
        className={`pointer-events-none absolute inset-x-0 z-30 h-[9vh] bg-black ${side === 'top' ? 'top-0' : 'bottom-0'}`}
        initial={{ y: 0 }}
        animate={{ y: open ? (side === 'top' ? '-100%' : '100%') : 0 }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
      />
    ))}
  </>
)

/* ================================================================== */
/* Shots                                                               */
/* ================================================================== */

/** OPEN — the "presents" card. */
const PresentsCard = () => (
  <motion.div
    className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center"
    exit={{ opacity: 0, scale: 1.08, filter: 'blur(6px)', transition: { duration: 0.25 } }}
  >
    <div>
      <motion.p
        className="font-display text-2xl text-white md:text-4xl"
        initial={{ opacity: 0, letterSpacing: '0.6em', filter: 'blur(8px)' }}
        animate={{ opacity: 1, letterSpacing: '0.18em', filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        CSI ST. PETER'S CHURCH
      </motion.p>
      <motion.p
        className="mt-2 text-[11px] font-bold uppercase tracking-[0.4em] text-gold md:text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        Youth Fellowship · presents
      </motion.p>
    </div>
  </motion.div>
)

/** BALL — fireball delivery from deep in the stadium. */
const FIREBALL_PATH = {
  initial: { x: '45vw', y: '-38vh', scale: 0.04, opacity: 0 },
  animate: { x: 0, y: 0, scale: 1, opacity: 1 },
}

const Ball = () => (
  <motion.div
    className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
    exit={{ opacity: 0, transition: { duration: 0.12 } }}
  >
    {/* Fire trail: copies following the same path a beat behind */}
    {[5, 4, 3, 2, 1].map((n) => (
      <motion.div
        key={n}
        className="absolute h-28 w-28 rounded-full blur-xl md:h-36 md:w-36"
        style={{
          background: n % 2 ? 'radial-gradient(circle, #FFC21A 0%, #E63946 60%, transparent 75%)' : 'radial-gradient(circle, #FF5A66 0%, #C1121F 60%, transparent 75%)',
          opacity: 0.85 - n * 0.13,
        }}
        initial={FIREBALL_PATH.initial}
        animate={{ ...FIREBALL_PATH.animate, scale: 1 - n * 0.08, opacity: 0.85 - n * 0.13 }}
        transition={{ duration: 1.15, delay: n * 0.045, ease: [0.4, 0.05, 0.3, 1] }}
      />
    ))}

    <motion.div
      className="relative h-28 w-28 md:h-36 md:w-36"
      initial={FIREBALL_PATH.initial}
      animate={FIREBALL_PATH.animate}
      transition={{ duration: 1.15, ease: [0.4, 0.05, 0.3, 1] }}
    >
      {/* heat halo */}
      <motion.div
        className="absolute -inset-6 rounded-full bg-flame/50 blur-2xl"
        animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 0.3, repeat: Infinity }}
      />
      <div
        className="relative h-full w-full overflow-hidden rounded-full"
        style={{
          background: 'radial-gradient(circle at 32% 28%, #FF9AA0 0%, #E63946 22%, #B3101C 55%, #4A040C 100%)',
          boxShadow:
            'inset -12px -16px 28px rgba(0,0,0,0.6), inset 6px 8px 16px rgba(255,255,255,0.2), 0 0 60px 10px rgba(230,57,70,0.55)',
        }}
      >
        <motion.div
          className="absolute inset-y-[-4%] left-1/2 w-[34%] -translate-x-1/2"
          animate={{ scaleX: [1, -1, 1] }}
          transition={{ duration: 0.3, repeat: Infinity, ease: 'linear' }}
        >
          <div className="h-full w-full rounded-[50%] border-x-[3px] border-dashed border-white/90" />
        </motion.div>
        <span className="absolute left-[20%] top-[14%] h-[22%] w-[30%] rotate-[-25deg] rounded-full bg-white/50 blur-[3px]" />
      </div>
    </motion.div>
  </motion.div>
)

/** Shockwave rings + sparks, anchored at screen centre. */
const Shockwave = ({ sparks = 22, rings = 2 }: { sparks?: number; rings?: number }) => {
  const pts = useMemo(
    () =>
      Array.from({ length: sparks }, (_, i) => {
        const a = (i / sparks) * Math.PI * 2 + Math.random() * 0.2
        const d = 180 + Math.random() * 220
        return { x: Math.cos(a) * d, y: Math.sin(a) * d, gold: i % 2 === 0, len: 16 + Math.random() * 22 }
      }),
    [sparks]
  )
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-0 w-0">
      {Array.from({ length: rings }, (_, r) => (
        <motion.div
          key={r}
          className={`absolute -left-24 -top-24 h-48 w-48 rounded-full ${r === 0 ? 'border-[6px] border-gold' : 'border-2 border-white'}`}
          initial={{ scale: 0.2, opacity: 1 }}
          animate={{ scale: r === 0 ? 7 : 10, opacity: 0 }}
          transition={{ duration: 0.8, delay: r * 0.08, ease: 'easeOut' }}
        />
      ))}
      {pts.map((s, i) => (
        <motion.span
          key={i}
          className={`absolute -top-[3px] h-1.5 rounded-full ${s.gold ? 'bg-gold' : 'bg-flame-light'}`}
          style={{
            width: s.len,
            left: -s.len / 2,
            rotate: `${(Math.atan2(s.y, s.x) * 180) / Math.PI}deg`,
            boxShadow: s.gold ? '0 0 12px rgba(255,194,26,0.9)' : '0 0 12px rgba(255,90,102,0.9)',
          }}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ x: s.x, y: s.y, opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

/** Landing shockwave for the title slam — mounts when the logo hits (~0.42s in). */
const TitleShockwave = () => {
  const [hit, setHit] = useState(false)
  useEffect(() => {
    const id = window.setTimeout(() => setHit(true), 420)
    return () => clearTimeout(id)
  }, [])
  return hit ? <Shockwave sparks={16} rings={2} /> : null
}

/** IMPACT — white-out, shockwave, slashes. */
const Impact = () => (
  <>
    <motion.div
      className="pointer-events-none absolute inset-0 z-20 bg-white"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    />
    <Shockwave />
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {[
        { color: 'bg-gold', delay: 0, top: '24%', h: 'h-20 md:h-28' },
        { color: 'bg-flame', delay: 0.04, top: '44%', h: 'h-12 md:h-16' },
        { color: 'bg-white', delay: 0.08, top: '60%', h: 'h-3 md:h-4' },
        { color: 'bg-gold', delay: 0.11, top: '68%', h: 'h-6 md:h-8' },
      ].map((b, i) => (
        <motion.div
          key={i}
          className={`absolute -left-1/4 w-[150%] ${b.h} ${b.color}`}
          style={{ top: b.top, rotate: '-12deg' }}
          initial={{ x: '-110%' }}
          animate={{ x: ['-110%', '0%', '110%'] }}
          transition={{ duration: 0.35, delay: b.delay, times: [0, 0.45, 1], ease: 'easeInOut' }}
        />
      ))}
    </div>
  </>
)

/** MONTAGE — full-screen trailer cuts: THE SPIRIT · THE SKILL · THE GLORY. */
const Montage = () => {
  const [cut, setCut] = useState(0)
  useEffect(() => {
    const ids = MONTAGE.slice(1).map((_, i) => window.setTimeout(() => setCut(i + 1), CUT_MS * (i + 1)))
    return () => ids.forEach(clearTimeout)
  }, [])
  const shot = MONTAGE[cut]

  return (
    <div className="absolute inset-0 z-20 overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={cut}
          className={`absolute inset-0 flex items-center justify-center ${shot.panel}`}
          initial={{ clipPath: 'polygon(0 0, 0 0, -20% 100%, -20% 100%)' }}
          animate={{ clipPath: 'polygon(0 0, 120% 0, 100% 100%, -20% 100%)' }}
          exit={{ opacity: 1, transition: { duration: 0.16 } }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
        >
          {/* speed lines */}
          <div
            className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'repeating-linear-gradient(-12deg, transparent 0 22px, rgba(255,255,255,0.35) 22px 24px)' }}
          />
          <motion.h2
            className={`relative px-4 text-center font-display leading-none ${shot.text} text-[4.2rem] xs:text-[5rem] sm:text-[8rem] md:text-[11rem]`}
            style={{ textShadow: shot.panel === 'bg-ink-950' ? GOLD_EXTRUDE : '0 10px 30px rgba(0,0,0,0.35)' }}
            initial={{ scale: 1.9, opacity: 0, filter: 'blur(14px)', letterSpacing: '0.2em' }}
            animate={{ scale: [1.9, 0.96, 1.04], opacity: 1, filter: 'blur(0px)', letterSpacing: '0.04em' }}
            transition={{ duration: CUT_MS / 1000, times: [0, 0.35, 1], ease: 'easeOut' }}
          >
            {shot.word}
          </motion.h2>
        </motion.div>
      </AnimatePresence>
      {/* cut flash */}
      <motion.div
        key={`flash-${cut}`}
        className="pointer-events-none absolute inset-0 bg-white"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      />
    </div>
  )
}

/** TITLE — 3D ICCT'27 slam, lens flare, light sweep. */
const Title = () => (
  <div className="relative z-10 flex flex-col items-center px-4 text-center [perspective:900px]">
    {/* heat glow behind the logo */}
    <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
      <motion.div
        className="h-[60vh] w-[90vw] shrink-0 rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(255,194,26,0.35) 0%, rgba(230,57,70,0.18) 35%, transparent 70%)' }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 1, 0.75], scale: [0.6, 1.1, 1] }}
        transition={{ duration: 1.2, delay: 0.25 }}
      />
    </div>

    <motion.h1
      className="relative font-display leading-[0.82] text-[5.5rem] xs:text-[6.5rem] sm:text-[9rem] md:text-[13rem]"
      style={{ transformStyle: 'preserve-3d' }}
      initial={{ rotateX: 70, scale: 3.2, opacity: 0, filter: 'blur(18px)' }}
      animate={{ rotateX: [70, -6, 0], scale: [3.2, 0.94, 1], opacity: 1, filter: ['blur(18px)', 'blur(0px)', 'blur(0px)'] }}
      transition={{ duration: 0.55, ease: [0.5, 0, 0.3, 1], times: [0, 0.75, 1] }}
    >
      <span className="text-white" style={{ textShadow: WHITE_EXTRUDE }}>
        ICCT
      </span>
      <span className="text-gold" style={{ textShadow: GOLD_EXTRUDE }}>
        '27
      </span>

      {/* light sweep */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-clip-text text-transparent"
        style={{
          backgroundImage: 'linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.95) 50%, transparent 62%)',
          backgroundSize: '250% 100%',
          WebkitBackgroundClip: 'text',
        }}
        initial={{ backgroundPosition: '130% 0' }}
        animate={{ backgroundPosition: ['130% 0', '-130% 0', '-130% 0', '130% 0', '-130% 0'] }}
        transition={{ delay: 0.7, duration: 1.6, times: [0, 0.4, 0.55, 0.56, 1], ease: 'easeInOut' }}
      >
        ICCT'27
      </motion.span>
    </motion.h1>

    {/* anamorphic lens flare */}
    <motion.div
      className="pointer-events-none absolute left-1/2 top-[42%] h-[3px] w-[160vw]"
      style={{
        marginLeft: '-80vw',
        background: 'linear-gradient(90deg, transparent, rgba(255,194,26,0.0) 20%, rgba(255,244,214,1) 50%, rgba(255,194,26,0) 80%, transparent)',
        boxShadow: '0 0 24px 6px rgba(255,194,26,0.55)',
      }}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0] }}
      transition={{ delay: 0.45, duration: 0.9, times: [0, 0.3, 1] }}
    />

    <motion.div
      className="mt-6 flex items-center gap-3"
      initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ delay: 0.75, duration: 0.45 }}
    >
      <span className="h-0.5 w-8 bg-flame md:w-16" />
      <span className="font-display text-xl tracking-[0.1em] text-white md:text-4xl">Inter Church Cricket Tournament</span>
      <span className="h-0.5 w-8 bg-flame md:w-16" />
    </motion.div>

    <div className="mt-5 flex items-center gap-2">
      {['Season 4', 'Coimbatore', '2027'].map((label, i) => (
        <motion.span
          key={label}
          className={`rounded-md px-3 py-1 font-display text-lg tracking-wider md:text-2xl ${
            i === 0 ? 'bg-gold text-ink-900' : i === 1 ? 'bg-flame text-white' : 'border border-white/40 text-white'
          }`}
          initial={{ opacity: 0, y: 20, scale: 0.6 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1 + i * 0.12, type: 'spring', stiffness: 380, damping: 16 }}
        >
          {label}
        </motion.span>
      ))}
    </div>
  </div>
)

/* ================================================================== */
/* Loader                                                              */
/* ================================================================== */

export default function CricketLoader({ onComplete }: CricketLoaderProps) {
  const reduceMotion = useReducedMotion()
  const [stage, setStage] = useState<Stage>(reduceMotion ? 'title' : 'open')
  const [progress, setProgress] = useState(0)

  // Keep the latest callback without restarting the timeline when the parent re-renders
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete
  const finished = useRef(false)
  const finish = () => {
    if (finished.current) return
    finished.current = true
    onCompleteRef.current?.()
  }

  useEffect(() => {
    const timers: number[] = []
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms))

    if (reduceMotion) {
      at(T_REDUCED.exit, () => setStage('exit'))
      at(T_REDUCED.done, finish)
    } else {
      at(T.ball, () => setStage('ball'))
      at(T.impact, () => setStage('impact'))
      at(T.montage, () => setStage('montage'))
      at(T.title, () => setStage('title'))
      at(T.exit, () => setStage('exit'))
      at(T.done, finish)
    }

    const total = reduceMotion ? T_REDUCED.exit : T.exit
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / total)
      setProgress(p)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      timers.forEach(clearTimeout)
      cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion])

  const showTitle = stage === 'title' || stage === 'exit'

  // Camera shake: tremor while the ball approaches, hard hit on impact and title slam
  const shake =
    stage === 'impact'
      ? { ...SHAKE_HARD, transition: { duration: 0.45 } }
      : stage === 'title'
        ? { ...SHAKE_HARD, transition: { duration: 0.45, delay: 0.42 } }
        : stage === 'ball'
          ? { ...SHAKE_SOFT, transition: { duration: 0.25, delay: 0.85, repeat: 1 } }
          : { x: 0, y: 0 }

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden bg-ink-950"
      animate={stage === 'exit' ? { opacity: 0, scale: reduceMotion ? 1 : 1.25 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.55, ease: 'easeIn' }}
      role="status"
      aria-label="Loading ICCT'27"
    >
      <style>{`
        @keyframes icct-grid { from { background-position: 0 0; } to { background-position: 0 64px; } }
        @keyframes icct-grain {
          0% { transform: translate(0,0) } 25% { transform: translate(-3%,2%) }
          50% { transform: translate(2%,-3%) } 75% { transform: translate(-2%,-1%) } 100% { transform: translate(0,0) }
        }
      `}</style>

      <motion.div className="absolute inset-0" animate={shake}>
        {/* Stadium atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,#1C427D_0%,#0A1F44_45%,#040D1F_100%)]" />
        <div className="absolute inset-0 bg-stripes opacity-60" />
        {!reduceMotion && (
          <>
            <Floodlights />
            <PitchGrid />
            <Embers />
          </>
        )}

        {/* Shots */}
        <AnimatePresence>
          {stage === 'open' && <PresentsCard key="open" />}
          {stage === 'ball' && <Ball key="ball" />}
        </AnimatePresence>
        {stage === 'impact' && <Impact />}
        {stage === 'montage' && <Montage />}

        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence>{showTitle && <Title key="title" />}</AnimatePresence>
        </div>
        {stage === 'title' && !reduceMotion && <TitleShockwave />}
      </motion.div>

      {/* Film look: vignette + grain */}
      <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.75)_100%)]" />
      {!reduceMotion && (
        <div
          className="pointer-events-none absolute -inset-[10%] z-20 opacity-[0.09] mix-blend-overlay"
          style={{ backgroundImage: GRAIN, animation: 'icct-grain 0.5s steps(4) infinite' }}
        />
      )}

      {!reduceMotion && <Letterbox open={stage === 'exit'} />}

      {/* Progress + skip (above the letterbox) */}
      <div className="absolute inset-x-0 bottom-0 z-40 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-md items-center gap-4 px-6">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-gradient-to-r from-flame via-gold to-gold"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <button
            type="button"
            onClick={finish}
            className="rounded-lg border border-white/25 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white/85 transition-colors hover:border-gold hover:text-gold"
          >
            Skip
          </button>
        </div>
      </div>
    </motion.div>
  )
}
