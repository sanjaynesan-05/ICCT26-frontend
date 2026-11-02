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
}

const PlayerFormCard: React.FC<Props> = ({ playerNumber, player, onChange, onRemove, canRemove }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <div className="flex justify-between items-start">
        <h4 className="font-subheading font-semibold text-gray-900">Player {playerNumber}</h4>
        {canRemove && onRemove && (
          <button onClick={onRemove} className="text-gray-400 hover:text-red-500" aria-label="Remove player"><X /></button>
        )}
      </div>

      <div className="mt-4">
        <div>
          <label className="block text-sm font-subheading text-gray-700 mb-1">Full Name *</label>
          <input type="text" value={player.name} onChange={(e) => onChange({ name: e.target.value })} className="w-full px-3 py-2 border rounded bg-white text-gray-900" required />
        </div>
      </div>
    </div>
  )
}

export default PlayerFormCard
