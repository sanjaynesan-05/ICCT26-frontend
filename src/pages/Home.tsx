import { Link } from 'react-router-dom'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, animate, useInView } from 'framer-motion'
import {
  ArrowRight,
  ClipboardList,
  QrCode,
  BadgeCheck,
  CalendarDays,
  MapPin,
  Clock,
  Users,
  Trophy,
} from 'lucide-react'
import SEO from '../components/SEO'
import { apiService } from '../services/api'
import { TOURNAMENT } from '../data/home'
import { TITLE_SPONSOR } from '../data/sponsors'
import { VENUE } from '../data/contact'
import ImageCarousel from '../components/ImageCarousel'
import ChampionsCarousel from '../components/ChampionsCarousel'
import RulebookButton from '../components/RulebookButton'
import { useCountdown } from '../hooks/useCountdown'
import { Badge, ButtonLink, SectionHeader } from '../components/ui'
import { cn } from '../lib/utils'

// Set to true to show the Trophy Sponsor memorial in the Sponsors section
const SHOW_TROPHY_SPONSOR = false

const API_URL = import.meta.env.VITE_API_URL || 'https://icct26-backend.onrender.com'

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.45 },
}

/* ================================================================== */
/* Hero                                                                */
/* ================================================================== */

interface CountdownCardProps {
  title: string
  target: string
  dateLabel: string
  badge: ReactNode
  doneText: string
  accent: 'gold' | 'flame'
}

const CountdownCard = ({ title, target, dateLabel, badge, doneText, accent }: CountdownCardProps) => {
  const parts = useCountdown(target)
  const units = [
    { label: 'Days', value: parts.days },
    { label: 'Hrs', value: parts.hours },
    { label: 'Min', value: parts.minutes },
    { label: 'Sec', value: parts.seconds },
  ]

  return (
    <div
      className={cn(
        'flex h-full w-full flex-col items-center rounded-2xl border bg-ink-900/75 px-4 py-6 backdrop-blur-sm',
        accent === 'flame' ? 'border-flame/40' : 'border-gold/40'
      )}
    >
      <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
        {badge}
        <span className="text-eyebrow uppercase text-white">{title}</span>
      </div>
      {parts.done ? (
        <p className="py-3 font-display text-4xl text-white">{doneText}</p>
      ) : (
        <div className="flex items-start gap-1.5 sm:gap-3">
          {units.map((u, i) => (
            <div key={u.label} className="flex items-start gap-1.5 sm:gap-3">
              <div className="flex w-12 flex-col items-center sm:w-14">
                <span
                  className={cn(
                    'font-display text-5xl leading-none tabular-nums',
                    accent === 'flame' ? 'text-flame-light' : 'text-gold'
                  )}
                >
                  {String(u.value).padStart(2, '0')}
                </span>
                <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">{u.label}</span>
              </div>
              {i < units.length - 1 && <span className="font-display text-4xl leading-none text-white/25">:</span>}
            </div>
          ))}
        </div>
      )}
      <p className="mt-4 flex items-center gap-1.5 text-xs text-muted">
        <CalendarDays className="h-3.5 w-3.5" /> {dateLabel}
      </p>
    </div>
  )
}

const RegistrationCountdownCard = () => {
  const reg = useCountdown(TOURNAMENT.registrationCloses)
  return (
    <CountdownCard
      title="Registration closes in"
      target={TOURNAMENT.registrationCloses}
      dateLabel={formatDateTime(TOURNAMENT.registrationCloses)}
      badge={reg.done ? <Badge tone="neutral">Closed</Badge> : <Badge tone="live">Open</Badge>}
      doneText="Registration closed"
      accent="flame"
    />
  )
}

const MatchCountdownCard = () => (
  <CountdownCard
    title="First ball in"
    target={TOURNAMENT.firstBall}
    dateLabel={formatDate(TOURNAMENT.firstBall)}
    badge={<Badge tone="gold">Match</Badge>}
    doneText="Tournament underway"
    accent="gold"
  />
)

const TitleSponsorCard = () => (
  <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-5 backdrop-blur-sm">
    <p className="text-eyebrow uppercase text-gold">Title Sponsor</p>
    <div className="mt-3 flex h-40 w-full max-w-[20rem] items-center justify-center rounded-xl bg-white p-2.5 md:h-44">
      {TITLE_SPONSOR.url ? (
        <a href={TITLE_SPONSOR.url} target="_blank" rel="noopener noreferrer" className="h-full w-full">
          <img src={TITLE_SPONSOR.logo} alt={TITLE_SPONSOR.name} className="h-full w-full object-contain" />
        </a>
      ) : (
        <img src={TITLE_SPONSOR.logo} alt={TITLE_SPONSOR.name} className="h-full w-full object-contain" />
      )}
    </div>
  </div>
)

const Hero = () => (
  <section className="relative flex min-h-[100svh] items-center overflow-hidden">
    <div className="absolute inset-0 bg-[url('/stadium.jpg')] bg-cover bg-center" aria-hidden />
    <div className="absolute inset-0 bg-hero-fade" aria-hidden />
    <div className="absolute inset-0 bg-stripes" aria-hidden />

    <div className="page-container relative z-10 pb-28 pt-28 text-center md:pb-36">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Organiser lockup: logo · name · logo in one pill */}
        <div className="inline-flex max-w-full items-center gap-2.5 rounded-2xl border border-white/10 bg-ink-900/60 p-1.5 backdrop-blur-sm sm:gap-3 sm:rounded-full sm:pr-1.5">
          <img src="/churchlogo.png" alt="CSI St. Peter's Church, Rathinapuri" className="h-11 w-11 shrink-0 rounded-full object-contain sm:h-12 sm:w-12" />
          <p className="eyebrow min-w-0 leading-snug text-white/85 sm:whitespace-nowrap">
            CSI St. Peter's Church, Rathinapuri
            <span className="hidden sm:inline"> · </span>
            <br className="sm:hidden" />
            Youth Fellowship
          </p>
          <img src="/adonailogo.png" alt="Adonai Youth Fellowship" className="h-11 w-11 shrink-0 object-contain sm:h-12 sm:w-12" />
        </div>

        {/* Organiser → tournament connector */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold/70" />
          <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-gold">Conducts</span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold/70" />
        </div>

        <h1 className="mt-2 text-[4.75rem] leading-[0.85] text-white xs:text-[5.5rem] sm:text-[7.5rem] md:text-[9.5rem]">
          ICCT<span className="text-gold">'27</span>
        </h1>
        <p className="mt-3 font-display text-2xl tracking-wide text-white/90 md:text-3xl">Inter Church Cricket Tournament</p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <Badge tone="gold">Season {TOURNAMENT.season}</Badge>
          <Badge tone="neutral">{TOURNAMENT.format}</Badge>
          <Badge tone="neutral">{TOURNAMENT.city}</Badge>
        </div>

        <div className="mx-auto mt-7 flex max-w-xs flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
          <ButtonLink to="/registration" className="!px-7 !py-3.5">
            Register Your Team <ArrowRight className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink to="/rules" variant="outline" className="!px-7 !py-3.5">
            View Rules
          </ButtonLink>
        </div>
      </motion.div>

      {/* Registration countdown · Title sponsor · Match countdown (sponsor first on mobile) */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mx-auto mt-12 grid max-w-5xl gap-4 lg:grid-cols-3 lg:items-stretch"
      >
        <div className="order-2 lg:order-1">
          <RegistrationCountdownCard />
        </div>
        <div className="order-1 lg:order-2">
          <TitleSponsorCard />
        </div>
        <div className="order-3">
          <MatchCountdownCard />
        </div>
      </motion.div>
    </div>
  </section>
)

/* ================================================================== */
/* Stats strip                                                         */
/* ================================================================== */

const CountUp = ({ to }: { to: number }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, { duration: 1.2, ease: 'easeOut', onUpdate: (v) => setValue(Math.round(v)) })
    return () => controls.stop()
  }, [inView, to])

  return <span ref={ref}>{value}</span>
}

const useTeamsRegistered = () => {
  const [count, setCount] = useState<number | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    apiService
      .getAllTeams()
      .then((res: { total_teams?: number; teams?: unknown[]; data?: unknown[] }) => {
        const n =
          typeof res?.total_teams === 'number'
            ? res.total_teams
            : Array.isArray(res?.teams)
              ? res.teams.length
              : Array.isArray(res?.data)
                ? res.data.length
                : null
        if (cancelled) return
        if (n === null) setFailed(true)
        else setCount(n)
      })
      .catch((err) => {
        console.warn('Could not load registered team count:', err)
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { count, failed }
}

const StatsStrip = () => {
  const { count, failed } = useTeamsRegistered()

  const start = new Date(TOURNAMENT.firstBall)
  const end = new Date(TOURNAMENT.lastDay)
  const weekday = (d: Date) => d.toLocaleDateString('en-IN', { weekday: 'short' })
  const venueName = VENUE.name.replace(/\s*\(.*\)\s*$/, '') // drop "(Cricket ground)"

  // Order: Trophies · Venue · Dates · Teams registered
  const highlights = [
    {
      icon: Trophy,
      label: 'Trophies',
      value: 'Trophies',
      sub: '& special prizes',
      tile: 'bg-gold/15 text-gold',
    },
    {
      icon: MapPin,
      label: 'Venue',
      value: venueName,
      sub: VENUE.city,
      tile: 'bg-flame/15 text-flame-light',
    },
    {
      icon: CalendarDays,
      label: 'Dates',
      value: `${start.getDate()} – ${end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`,
      sub: `${weekday(start)} – ${weekday(end)}, ${end.getFullYear()}`,
      tile: 'bg-pitch/15 text-pitch-light',
    },
    {
      icon: Users,
      label: 'Teams registered',
      value: count !== null ? <CountUp to={count} /> : failed ? '—' : <span className="text-white/30">··</span>,
      sub: 'Live count',
      tile: 'bg-gold/15 text-gold',
    },
  ]

  return (
    <section className="relative z-20 -mt-10 pb-3 md:-mt-12 md:pb-4">
      <div className="page-container">
        <motion.div
          {...fadeUp}
          className="mx-auto grid max-w-6xl grid-cols-2 overflow-hidden rounded-2xl border border-white/10 bg-ink-800 shadow-card-dark lg:grid-cols-4"
          aria-label="Tournament highlights"
        >
          {highlights.map((h, i) => (
            <div
              key={h.label}
              className={cn(
                'flex flex-col items-center px-3 py-5 text-center sm:px-5 md:py-6',
                i % 2 === 0 && 'border-r border-white/10',
                i < 2 && 'border-b border-white/10 lg:border-b-0',
                i === 1 && 'lg:border-r'
              )}
            >
              <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', h.tile)}>
                <h.icon className="h-5 w-5" />
              </span>
              <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{h.label}</p>
              <p className="mt-1 font-display text-2xl leading-tight text-white tabular-nums md:text-3xl">{h.value}</p>
              <p className="mt-0.5 text-xs text-white/50">{h.sub}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ================================================================== */
/* How to register                                                     */
/* ================================================================== */

const HowToRegister = () => {
  const steps = [
    {
      icon: ClipboardList,
      title: 'Fill your team details',
      body: `Church, team name, captain & vice-captain, and ${TOURNAMENT.minPlayers}–${TOURNAMENT.maxPlayers} players. One team per church.`,
    },
    {
      icon: QrCode,
      title: `Pay ₹${TOURNAMENT.entryFee.toLocaleString('en-IN')} by UPI`,
      body: 'Scan the QR on the last step with any UPI app and upload the payment screenshot.',
    },
    {
      icon: BadgeCheck,
      title: 'Get your Team ID',
      body: 'Our team verifies the payment and emails the captain a confirmation with your Team ID.',
    },
  ]

  return (
    <section className="bg-surface py-10 text-ink md:py-12">
      <div className="page-container">
        <SectionHeader tone="light" eyebrow="How to register" title="Three steps to the pitch" className="!mb-6 md:!mb-8" />

        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              {...fadeUp}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="card-light flex gap-4 p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-gold">
                <step.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-flame">Step {i + 1}</p>
                <h3 className="mt-0.5 text-xl leading-tight text-ink">{step.title}</h3>
                <p className="mt-1 text-sm leading-snug text-muted-dark">{step.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink to="/registration" className="!px-7 !py-3.5">
              Start Registration <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <RulebookButton className="btn border-2 border-ink/80 !px-7 !py-3 text-ink hover:bg-ink hover:text-white">
              Rulebook
            </RulebookButton>
          </div>
          <p className="text-xs text-muted-dark">Registration closes {formatDateTime(TOURNAMENT.registrationCloses)}</p>
        </div>
      </div>
    </section>
  )
}

/* ================================================================== */
/* Fixtures preview                                                    */
/* ================================================================== */

interface FixtureMatch {
  id: number
  round?: string
  match_number?: number
  team1: string
  team2: string
  status: 'scheduled' | 'live' | 'completed'
  scheduled_start_time?: string | null
  result?: { winner: string; margin: number; marginType: 'runs' | 'wickets' }
}

const FixturesPreview = () => {
  const [matches, setMatches] = useState<FixtureMatch[] | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`${API_URL}/api/schedule/matches`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return
        const raw: Array<Omit<FixtureMatch, 'status'> & { status?: string }> = Array.isArray(data) ? data : data?.data || []
        const list: FixtureMatch[] = raw.map((m) => ({
          ...m,
          status: m.status === 'done' ? 'completed' : ((m.status || 'scheduled') as FixtureMatch['status']),
        }))
        // Live first, then upcoming, then latest results
        const ordered = [
          ...list.filter((m) => m.status === 'live'),
          ...list.filter((m) => m.status === 'scheduled'),
          ...list.filter((m) => m.status === 'completed').reverse(),
        ]
        setMatches(ordered.slice(0, 3))
      })
      .catch(() => {
        if (!cancelled) setMatches([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="py-10 md:py-12">
      <div className="page-container">
        <SectionHeader eyebrow="Fixtures" title="Matchday" className="!mb-6 md:!mb-8" />

        {matches === null ? (
          <div className="grid gap-5 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="card-dark h-44 animate-pulse" />
            ))}
          </div>
        ) : matches.length === 0 ? (
          <motion.div {...fadeUp} className="card-dark mx-auto flex max-w-2xl flex-col items-center px-6 py-7 text-center">
            <CalendarDays className="h-8 w-8 text-gold" />
            <h3 className="mt-3 text-2xl text-white md:text-3xl">Fixtures announced soon</h3>
            <p className="mt-2 max-w-md text-sm text-muted">
              The draw is published after registration closes on {formatDate(TOURNAMENT.registrationCloses)}. First ball{' '}
              {formatDate(TOURNAMENT.firstBall)}.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {matches.map((m, i) => (
              <motion.div key={m.id} {...fadeUp} transition={{ duration: 0.45, delay: i * 0.08 }} className="card-dark p-6">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-eyebrow uppercase text-muted">
                    {m.round || 'Match'}
                    {m.match_number ? ` · M${m.match_number}` : ''}
                  </span>
                  {m.status === 'live' ? (
                    <Badge tone="live">Live</Badge>
                  ) : m.status === 'completed' ? (
                    <Badge tone="success">Result</Badge>
                  ) : (
                    <Badge tone="neutral">Upcoming</Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="font-display text-3xl leading-tight text-white">{m.team1}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-flame-light">vs</p>
                  <p className="font-display text-3xl leading-tight text-white">{m.team2}</p>
                </div>
                <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-sm text-muted">
                  {m.status === 'completed' && m.result ? (
                    <>
                      <Trophy className="h-4 w-4 text-gold" />
                      {m.result.winner} won by {m.result.margin} {m.result.marginType}
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4" />
                      {m.scheduled_start_time ? formatDateTime(m.scheduled_start_time) : 'Time TBA'}
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/fixtures" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 transition-colors hover:text-gold">
            Full schedule <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ================================================================== */
/* About / legacy                                                      */
/* ================================================================== */

const About = () => {
  const seasons = [...TOURNAMENT.pastSeasons, "'27"]

  return (
    <section className="border-y border-white/10 bg-ink-950 py-20 md:py-28">
      <div className="page-container grid items-center gap-12 lg:grid-cols-2">
        <motion.div {...fadeUp}>
          <p className="eyebrow mb-3">About ICCT</p>
          <h2 className="text-4xl text-white md:text-6xl">
            More than cricket.
            <br />
            <span className="text-gold">A fellowship.</span>
          </h2>
          <p className="mt-6 leading-relaxed text-muted">
            ICCT – the Inter Church Cricket Tournament – is a celebration of unity, faith and fellowship among our youth.
            Organised by the CSI St. Peter's Church, Rathinapuri Youth Fellowship, Coimbatore, it brings churches together through the
            spirit of cricket, building brotherhood, sportsmanship and shared values.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            Season {TOURNAMENT.season} returns in the {TOURNAMENT.format.toLowerCase()} format — nurturing leadership,
            discipline and connections that last well beyond the boundary rope.
          </p>

          {/* Season timeline */}
          <div className="mt-10 flex items-center">
            {seasons.map((season, i) => {
              const current = i === seasons.length - 1
              return (
                <div key={season} className={cn('flex items-center', !current && 'flex-1')}>
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        'flex h-14 w-14 items-center justify-center rounded-full border-2 font-display text-xl',
                        current ? 'border-gold bg-gold text-ink-900' : 'border-white/20 text-white/70'
                      )}
                    >
                      {season}
                    </span>
                    <span
                      className={cn(
                        'mt-2 text-[11px] font-bold uppercase tracking-[0.14em]',
                        current ? 'text-gold' : 'text-white/40'
                      )}
                    >
                      {current ? 'Now' : `S${i + 1}`}
                    </span>
                  </div>
                  {!current && <span className="mx-2 mb-6 h-0.5 flex-1 bg-white/15" />}
                </div>
              )
            })}
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.45, delay: 0.1 }} className="relative mx-3 lg:mx-0">
          <div className="absolute -inset-3 rotate-2 rounded-3xl bg-gold/90" aria-hidden />
          <img
            src="/about.jpg"
            alt="Players at a previous ICCT season"
            className="relative aspect-[4/3] w-full rounded-3xl object-cover shadow-card-dark"
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  )
}

/* ================================================================== */
/* Sponsors                                                            */
/* ================================================================== */

const Sponsors = () => (
  <section className="bg-surface py-10 text-ink md:py-12">
    <div className="page-container">
      <SectionHeader tone="light" eyebrow="Partners" title="Co-sponsors" className="!mb-6 md:!mb-8" />

      {SHOW_TROPHY_SPONSOR && (
        <motion.div {...fadeUp} className="card-light mx-auto mb-8 max-w-xl p-6 text-center">
          <p className="text-eyebrow uppercase text-muted-dark">Trophy Sponsor · In memory of</p>
          <p className="mt-2 font-display text-3xl text-ink">Mrs. R. Gnanajothi Anandaraj</p>
        </motion.div>
      )}

      {/* Co-sponsor carousel (title sponsor is shown in the hero) */}
      <motion.div {...fadeUp}>
        <ImageCarousel />
      </motion.div>
    </div>
  </section>
)

/* ================================================================== */
/* Page                                                                */
/* ================================================================== */

const Home = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <SEO title="Home" description="ICCT'27 – Inter Church Cricket Tournament, Coimbatore. Register your church team now." />
    <Hero />
    <StatsStrip />
    <ChampionsCarousel />
    <Sponsors />
    <About />
    <FixturesPreview />
    <HowToRegister />
  </motion.div>
)

export default Home
