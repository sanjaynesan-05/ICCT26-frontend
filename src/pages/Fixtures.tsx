import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, CalendarDays, Clock, Coins, Download, ExternalLink, MapPin, RefreshCw, Trophy } from 'lucide-react'
import SEO from '../components/SEO'
import { Badge, PageHero } from '../components/ui'
import { TOURNAMENT } from '../data/home'
import { VENUE } from '../data/contact'
import {
  type Match,
  type MatchStatus,
  fetchMatches,
  formatMatchDay,
  formatMatchTime,
  formatScore,
  groupByRound,
  hasScore,
  resultText,
} from '../utils/fixtures'
import { cn } from '../lib/utils'

type Filter = 'all' | MatchStatus
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'live', label: 'Live' },
  { key: 'scheduled', label: 'Upcoming' },
  { key: 'completed', label: 'Results' },
]

const venueName = VENUE.name.replace(/\s*\(.*\)\s*$/, '')
const longDate = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

/* ------------------------------------------------------------------ */
/* Match card                                                          */
/* ------------------------------------------------------------------ */

const TeamRow = ({ name, runs, wickets, winner }: { name: string; runs?: number | null; wickets?: number | null; winner: boolean }) => (
  <div className="flex items-center justify-between gap-3">
    <p className={cn('min-w-0 truncate font-display text-2xl leading-tight', winner ? 'text-gold' : 'text-white')}>
      {name}
      {winner && <Trophy className="ml-2 inline-block h-4 w-4 -translate-y-0.5" aria-label="Winner" />}
    </p>
    {hasScore(runs) && <span className="shrink-0 font-display text-2xl tabular-nums text-white">{formatScore(runs, wickets)}</span>}
  </div>
)

const MatchCard = ({ m }: { m: Match }) => {
  const winner = m.result?.winner
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('card-dark flex flex-col p-5', m.status === 'live' && 'border-flame/50')}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted">Match {m.match_number}</span>
        {m.status === 'live' ? (
          <Badge tone="live">Live</Badge>
        ) : m.status === 'completed' ? (
          <Badge tone="success">Result</Badge>
        ) : (
          <Badge tone="neutral">Upcoming</Badge>
        )}
      </div>

      <div className="space-y-1.5">
        <TeamRow name={m.team1} runs={m.team1_first_innings_runs} wickets={m.team1_first_innings_wickets} winner={winner === m.team1} />
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-flame-light">vs</p>
        <TeamRow name={m.team2} runs={m.team2_first_innings_runs} wickets={m.team2_first_innings_wickets} winner={winner === m.team2} />
      </div>

      <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
        {m.status === 'completed' && m.result ? (
          <p className="flex items-center gap-2 font-semibold text-gold">
            <Trophy className="h-4 w-4 shrink-0" /> {resultText(m)}
          </p>
        ) : (
          <p className="flex items-center gap-2 text-muted">
            <Clock className="h-4 w-4 shrink-0" />
            {m.scheduled_start_time ? `${formatMatchDay(m.scheduled_start_time)} · ${formatMatchTime(m.scheduled_start_time)}` : 'Time TBA'}
          </p>
        )}
        {m.toss_winner && (
          <p className="flex items-center gap-2 text-muted">
            <Coins className="h-4 w-4 shrink-0" /> {m.toss_winner} won the toss{m.toss_choice ? ` & chose to ${m.toss_choice}` : ''}
          </p>
        )}
        {m.match_score_url && (m.status === 'live' || m.status === 'completed') && (
          <a
            href={m.match_score_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-gold"
          >
            {m.status === 'live' ? 'Live scorecard' : 'Full scorecard'} <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </motion.article>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const Fixtures = () => {
  const [matches, setMatches] = useState<Match[] | null>(null)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')
  const [downloading, setDownloading] = useState(false)

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setRefreshing(true)
    try {
      setMatches(await fetchMatches())
      setError('')
    } catch (err) {
      console.error(err)
      setError('Could not load fixtures. Check your connection and try again.')
      setMatches((prev) => prev ?? [])
    } finally {
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  // Keep live scores fresh: poll every 60s while any match is live
  const anyLive = matches?.some((m) => m.status === 'live') ?? false
  useEffect(() => {
    if (!anyLive) return
    const id = window.setInterval(() => void load(true), 60_000)
    return () => clearInterval(id)
  }, [anyLive, load])

  const counts = useMemo(() => {
    const list = matches ?? []
    return {
      all: list.length,
      live: list.filter((m) => m.status === 'live').length,
      scheduled: list.filter((m) => m.status === 'scheduled').length,
      completed: list.filter((m) => m.status === 'completed').length,
    } as Record<Filter, number>
  }, [matches])

  const rounds = useMemo(() => {
    const list = (matches ?? []).filter((m) => filter === 'all' || m.status === filter)
    return groupByRound(list)
  }, [matches, filter])

  const handleDownload = async () => {
    if (!matches?.length) return
    setDownloading(true)
    try {
      const { downloadFixturesPdf } = await import('../utils/fixturesPdf')
      await downloadFixturesPdf(matches)
    } catch (err) {
      console.error('Fixtures PDF failed:', err)
      setError('Could not create the PDF. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  const hasMatches = (matches?.length ?? 0) > 0

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SEO title="Fixtures" description="ICCT'27 match schedule, live scores and results." />

      <PageHero eyebrow="Fixtures" title="Match schedule">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-gold" /> {longDate(TOURNAMENT.firstBall)} – {longDate(TOURNAMENT.lastDay)}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-flame-light" /> {venueName}, {VENUE.city}
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!hasMatches || downloading}
              className="btn-gold"
              title={hasMatches ? 'Download the full schedule as a PDF' : 'Available once fixtures are published'}
            >
              {downloading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-900 border-t-transparent" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {downloading ? 'Preparing PDF…' : 'Download fixtures (PDF)'}
            </button>
            <button type="button" onClick={() => void load()} disabled={refreshing} className="btn-ghost border border-white/15">
              <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} /> Refresh
            </button>
          </div>
        </div>
      </PageHero>

      <section className="py-10 md:py-14">
        <div className="page-container">
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-flame/40 bg-flame/10 p-4 text-sm text-flame-light" role="alert">
              <AlertTriangle className="h-5 w-5 shrink-0" /> {error}
            </div>
          )}

          {matches === null ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="card-dark h-48 animate-pulse" />
              ))}
            </div>
          ) : !hasMatches ? (
            <div className="card-dark mx-auto flex max-w-2xl flex-col items-center px-6 py-10 text-center">
              <CalendarDays className="h-10 w-10 text-gold" />
              <h2 className="mt-4 text-3xl text-white md:text-4xl">Fixtures announced soon</h2>
              <p className="mt-2 max-w-md text-sm text-muted">
                The draw is published after registration closes on {longDate(TOURNAMENT.registrationCloses)}. Matches are played on{' '}
                {longDate(TOURNAMENT.firstBall)} and {longDate(TOURNAMENT.lastDay)}.
              </p>
              <p className="mt-4 text-xs text-white/40">The download button activates once the schedule is live.</p>
            </div>
          ) : (
            <>
              {/* Filters */}
              <div className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Filter matches">
                {FILTERS.map((f) => {
                  const active = filter === f.key
                  return (
                    <button
                      key={f.key}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setFilter(f.key)}
                      className={cn(
                        'inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                        active ? 'border-gold bg-gold text-ink-900' : 'border-white/15 text-white/75 hover:border-white/40 hover:text-white'
                      )}
                    >
                      {f.key === 'live' && counts.live > 0 && <span className="h-2 w-2 rounded-full bg-flame-light animate-live-dot" />}
                      {f.label}
                      <span className={cn('text-xs', active ? 'text-ink-900/60' : 'text-white/40')}>{counts[f.key]}</span>
                    </button>
                  )
                })}
              </div>

              {rounds.length === 0 ? (
                <p className="py-10 text-center text-muted">No matches in this view yet.</p>
              ) : (
                <div className="space-y-10">
                  {rounds.map((g) => (
                    <section key={g.roundNumber} aria-labelledby={`round-${g.roundNumber}`}>
                      <div className="mb-4 flex items-end justify-between gap-3 border-b border-white/10 pb-3">
                        <h2 id={`round-${g.roundNumber}`} className="flex items-center gap-3 text-3xl text-white">
                          <span className="h-6 w-1.5 rounded-full bg-gold" />
                          {g.round}
                        </h2>
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                          {g.matches.length} match{g.matches.length === 1 ? '' : 'es'}
                        </span>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {g.matches.map((m) => (
                          <MatchCard key={m.id} m={m} />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}

              {anyLive && <p className="mt-8 text-center text-xs text-white/40">Live scores refresh automatically every minute.</p>}
            </>
          )}
        </div>
      </section>
    </motion.div>
  )
}

export default Fixtures
