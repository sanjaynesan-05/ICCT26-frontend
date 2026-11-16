import React from 'react'
import { X } from 'lucide-react'

interface PlayerData {
  name: string
}

interface Props {
  playerNumber: number
  player: PlayerData
  onChange: (data: Partial<PlayerData>) => void
  onRemove?: () => void
  canRemove?: boolean
  disabled?: boolean
}

/** Compact numbered player row: [#] [name input] [remove] */
const PlayerFormCard: React.FC<Props> = ({ playerNumber, player, onChange, onRemove, canRemove, disabled }) => {
  const id = `player-${playerNumber}`
  return (
    <div className="flex items-center gap-2 rounded-xl border border-surface-line bg-white p-2 pl-2.5 transition-colors focus-within:border-gold">
      <label
        htmlFor={id}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink font-display text-lg text-gold"
        title={`Player ${playerNumber}`}
      >
        {playerNumber}
      </label>
      <input
        id={id}
        type="text"
        value={player.name}
        onChange={(e) => onChange({ name: e.target.value })}
        placeholder={`Player ${playerNumber} full name`}
        aria-label={`Player ${playerNumber} full name`}
        className="min-w-0 flex-1 border-0 bg-transparent px-1 py-2 text-ink outline-none placeholder:text-muted-dark/60 focus:ring-0"
        disabled={disabled}
        required
      />
      {canRemove && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-dark hover:bg-flame/10 hover:text-flame"
          aria-label={`Remove player ${playerNumber}`}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export default PlayerFormCard
