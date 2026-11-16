import { motion } from 'framer-motion'
import { Info, Clock, Users, Zap, Target, Gavel, ClipboardList } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import SEO from '../components/SEO'
import { PageHero } from '../components/ui'
import { RULE_SECTIONS, IMPORTANT_NOTE } from '../data/rules'
import RulebookButton from '../components/RulebookButton'

// Set to true to close/lock rules page
const RULES_CLOSED = false

const sectionIcons: Record<string, LucideIcon> = {
  registration: ClipboardList,
  format: Clock,
  squad: Users,
  powerplay: Zap,
  bowling: Target,
  results: Gavel,
}

const Rules = () => {
  if (RULES_CLOSED) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <SEO title="Rules & Regulations" description="Read the official rules and regulations for ICCT'27." />
        <PageHero eyebrow="Rules & regulations" title="Coming soon" description="The ICCT'27 rules will be published here shortly." />
      </motion.div>
    )
  }

  // Running rule number across sections
  let ruleNo = 0

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SEO title="Rules & Regulations" description="Read the official rules and regulations for ICCT'27." />

      <PageHero eyebrow="Rules & regulations" title="Know the game. Play fair." description="Everything captains and players need to know before the first ball.">
        <RulebookButton />
      </PageHero>

      <section className="bg-surface py-14 text-ink md:py-20">
        <div className="page-container grid gap-10 lg:grid-cols-[220px,1fr]">
          {/* Section nav (desktop) */}
          <aside className="hidden lg:block">
            <nav className="sticky top-28 space-y-1" aria-label="Rule sections">
              <p className="mb-3 text-eyebrow uppercase text-muted-dark">Sections</p>
              {RULE_SECTIONS.map((section) => {
                const Icon = sectionIcons[section.id] ?? Info
                return (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-ink/70 transition-colors hover:bg-white hover:text-ink"
                  >
                    <Icon className="h-4 w-4" /> {section.title}
                  </a>
                )
              })}
            </nav>
          </aside>

          <div className="space-y-6">
            {RULE_SECTIONS.map((section, si) => {
              const Icon = sectionIcons[section.id] ?? Info
              return (
                <motion.section
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.35, delay: si * 0.03 }}
                  className="card-light scroll-mt-28 p-6 md:p-8"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-gold">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h2 className="text-3xl text-ink">{section.title}</h2>
                  </div>
                  <ol className="space-y-4">
                    {section.rules.map((rule) => {
                      ruleNo += 1
                      return (
                        <li key={rule} className="flex gap-4">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/20 font-display text-lg text-ink">
                            {ruleNo}
                          </span>
                          <p className="pt-1 leading-relaxed text-ink/85">{rule}</p>
                        </li>
                      )
                    })}
                  </ol>
                </motion.section>
              )
            })}

            {/* Important note */}
            <div className="rounded-2xl border-l-4 border-flame bg-white p-6 shadow-card md:p-8">
              <div className="mb-3 flex items-center gap-2">
                <Info className="h-5 w-5 text-flame" />
                <h2 className="text-2xl text-ink">Important note</h2>
              </div>
              <p className="leading-relaxed text-muted-dark">
                {IMPORTANT_NOTE}
              </p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

export default Rules
