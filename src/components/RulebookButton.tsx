import { useState, type ReactNode } from 'react'
import { Download } from 'lucide-react'

interface Props {
  className?: string
  children?: ReactNode
}

/** Generates and downloads the official rulebook PDF from the live rules data. */
const RulebookButton = ({ className = 'btn-gold', children = 'Download rulebook (PDF)' }: Props) => {
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)

  const handleClick = async () => {
    setBusy(true)
    setFailed(false)
    try {
      const { downloadRulebook } = await import('../utils/rulebookPdf')
      await downloadRulebook()
    } catch (err) {
      console.error('Rulebook PDF failed:', err)
      setFailed(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <button type="button" onClick={handleClick} disabled={busy} className={className} aria-busy={busy}>
      {busy ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {busy ? 'Preparing PDF…' : failed ? 'Try again' : children}
    </button>
  )
}

export default RulebookButton
