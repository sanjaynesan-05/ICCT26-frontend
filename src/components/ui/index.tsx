/**
 * ICCT'27 UI kit — shared building blocks for the "Matchday" design.
 * Colours / fonts come from tailwind.config.js tokens (ink, gold, flame, pitch, surface).
 */

import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */

type ButtonVariant = 'gold' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

const variantClass: Record<ButtonVariant, string> = {
  gold: 'btn-gold',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
}

const sizeClass: Record<ButtonSize, string> = {
  sm: '!px-4 !py-2 !text-xs',
  md: '',
  lg: '!px-8 !py-4 !text-base',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'gold', size = 'md', className, ...props }, ref) => (
    <button ref={ref} className={cn(variantClass[variant], sizeClass[size], className)} {...props} />
  )
)
Button.displayName = 'Button'

interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant
  size?: ButtonSize
}

export const ButtonLink = ({ variant = 'gold', size = 'md', className, ...props }: ButtonLinkProps) => (
  <Link className={cn(variantClass[variant], sizeClass[size], className)} {...props} />
)

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: 'dark' | 'light'
  padded?: boolean
}

export const Card = ({ tone = 'dark', padded = true, className, ...props }: CardProps) => (
  <div className={cn(tone === 'dark' ? 'card-dark' : 'card-light', padded && 'p-6 md:p-8', className)} {...props} />
)

/* ------------------------------------------------------------------ */
/* Badge                                                               */
/* ------------------------------------------------------------------ */

type BadgeTone = 'live' | 'gold' | 'success' | 'neutral' | 'danger' | 'info'

const badgeTone: Record<BadgeTone, string> = {
  live: 'bg-flame/15 text-flame-light border-flame/40',
  gold: 'bg-gold/15 text-gold border-gold/40',
  success: 'bg-pitch/15 text-pitch-light border-pitch/40',
  neutral: 'bg-white/10 text-muted border-white/15',
  danger: 'bg-flame/15 text-flame-light border-flame/40',
  info: 'bg-ink-600/40 text-sky-200 border-sky-300/30',
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
  icon?: ReactNode
}

export const Badge = ({ tone = 'neutral', icon, className, children, ...props }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider',
      badgeTone[tone],
      className
    )}
    {...props}
  >
    {tone === 'live' && !icon ? (
      <span className="h-2 w-2 rounded-full bg-flame-light animate-live-dot" aria-hidden />
    ) : (
      icon
    )}
    {children}
  </span>
)

/* ------------------------------------------------------------------ */
/* SectionHeader                                                       */
/* ------------------------------------------------------------------ */

interface SectionHeaderProps {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  tone?: 'dark' | 'light'
  className?: string
}

export const SectionHeader = ({
  eyebrow,
  title,
  description,
  align = 'center',
  tone = 'dark',
  className,
}: SectionHeaderProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.4 }}
    className={cn('mb-10 md:mb-14', align === 'center' ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl', className)}
  >
    {eyebrow && <p className={cn('eyebrow mb-3', tone === 'light' && 'text-flame')}>{eyebrow}</p>}
    <h2 className={cn('text-4xl md:text-5xl', tone === 'dark' ? 'text-white' : 'text-ink')}>{title}</h2>
    {description && (
      <p className={cn('mt-4 text-base md:text-lg', tone === 'dark' ? 'text-muted' : 'text-muted-dark')}>
        {description}
      </p>
    )}
  </motion.div>
)

/* ------------------------------------------------------------------ */
/* PageHero — compact banner at the top of every inner page            */
/* ------------------------------------------------------------------ */

interface PageHeroProps {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
}

export const PageHero = ({ eyebrow, title, description, children }: PageHeroProps) => (
  <section className="relative overflow-hidden border-b border-white/10 bg-ink-900 bg-stripes pt-28 pb-12 md:pt-36 md:pb-16">
    <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" aria-hidden />
    <div className="page-container relative">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="text-5xl md:text-7xl text-white">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-base md:text-lg text-muted">{description}</p>}
        {children && <div className="mt-6">{children}</div>}
      </motion.div>
    </div>
  </section>
)

/* ------------------------------------------------------------------ */
/* StatTile — big number + small label                                 */
/* ------------------------------------------------------------------ */

interface StatTileProps {
  value: ReactNode
  label: string
  icon?: ReactNode
  accent?: 'gold' | 'flame' | 'pitch' | 'white'
  tone?: 'dark' | 'light'
}

const statAccent = {
  gold: 'text-gold',
  flame: 'text-flame-light',
  pitch: 'text-pitch-light',
  white: 'text-white',
}

export const StatTile = ({ value, label, icon, accent = 'gold', tone = 'dark' }: StatTileProps) => (
  <div className={cn('flex flex-col items-center text-center px-4 py-6', tone === 'dark' ? '' : 'text-ink')}>
    {icon && <div className={cn('mb-3', statAccent[accent])}>{icon}</div>}
    <div className={cn('font-display text-5xl md:text-6xl leading-none', tone === 'dark' ? statAccent[accent] : 'text-ink')}>
      {value}
    </div>
    <div className={cn('mt-2 text-eyebrow uppercase', tone === 'dark' ? 'text-muted' : 'text-muted-dark')}>{label}</div>
  </div>
)
