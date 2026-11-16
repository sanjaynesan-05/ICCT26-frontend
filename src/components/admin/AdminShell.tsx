/**
 * Shared admin building blocks: header bar + toast notifications.
 */

import { useCallback, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Info, Trophy, X, XCircle } from 'lucide-react'
import { cn } from '../../lib/utils'

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

interface AdminHeaderProps {
  title: ReactNode
  subtitle?: ReactNode
  backTo?: string
  actions?: ReactNode
}

export const AdminHeader = ({ title, subtitle, backTo, actions }: AdminHeaderProps) => (
  <header className="sticky top-0 z-50 border-b border-white/10 bg-ink-900/90 backdrop-blur-md">
    <div className="page-container flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        {backTo ? (
          <Link
            to={backTo}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 text-white/80 transition-colors hover:border-gold hover:text-gold"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        ) : (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold text-ink-900">
            <Trophy className="h-5 w-5" strokeWidth={2.5} />
          </span>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-2xl leading-none text-white md:text-3xl">{title}</h1>
          {subtitle && <div className="mt-1 text-xs font-semibold text-muted">{subtitle}</div>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  </header>
)

/** Small admin action button (dark UI). */
export const AdminButton = ({
  tone = 'ghost',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: 'ghost' | 'gold' | 'success' | 'danger' }) => (
  <button
    className={cn(
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
      tone === 'ghost' && 'border border-white/15 text-white/85 hover:border-white/40 hover:text-white',
      tone === 'gold' && 'bg-gold text-ink-900 hover:bg-gold-light',
      tone === 'success' && 'bg-pitch text-white hover:bg-pitch-dark',
      tone === 'danger' && 'border border-flame/50 text-flame-light hover:bg-flame hover:text-white',
      className
    )}
    {...props}
  />
)

/* ------------------------------------------------------------------ */
/* Toasts                                                              */
/* ------------------------------------------------------------------ */

type ToastTone = 'success' | 'error' | 'info'
interface Toast {
  id: number
  tone: ToastTone
  message: string
}

const toastStyle: Record<ToastTone, { icon: typeof Info; className: string }> = {
  success: { icon: CheckCircle2, className: 'border-pitch/50 text-pitch-light' },
  error: { icon: XCircle, className: 'border-flame/50 text-flame-light' },
  info: { icon: Info, className: 'border-gold/50 text-gold' },
}

/** Local toast stack: `const { notify, toasts } = useToasts()` then render `{toasts}`. */
export const useToasts = () => {
  const [items, setItems] = useState<Toast[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => setItems((list) => list.filter((t) => t.id !== id)), [])

  const notify = useCallback(
    (tone: ToastTone, message: string) => {
      const id = nextId.current++
      setItems((list) => [...list, { id, tone, message }])
      window.setTimeout(() => dismiss(id), tone === 'error' ? 7000 : 4500)
    },
    [dismiss]
  )

  const toasts = (
    <div className="pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[70] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2" aria-live="polite">
      <AnimatePresence>
        {items.map((t) => {
          const { icon: Icon, className } = toastStyle[t.tone]
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 24 }}
              className={cn('pointer-events-auto flex items-start gap-3 rounded-xl border bg-ink-800 p-4 shadow-card-dark', className)}
              role={t.tone === 'error' ? 'alert' : 'status'}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="flex-1 text-sm text-white">{t.message}</p>
              <button type="button" onClick={() => dismiss(t.id)} className="text-white/50 hover:text-white" aria-label="Dismiss">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )

  return { notify, toasts }
}
