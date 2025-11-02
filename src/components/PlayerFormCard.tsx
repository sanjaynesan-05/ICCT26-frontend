import { motion } from 'framer-motion'
import { X } from 'lucide-react'

interface PlayerFormCardProps {
  playerNumber: number
  onRemove?: () => void
  canRemove: boolean
}

const PlayerFormCard = ({ playerNumber, onRemove, canRemove }: PlayerFormCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="glass-card rounded-xl p-6 mb-4 relative"
    >
      {canRemove && (
        <button
          onClick={onRemove}
          className="absolute top-4 right-4 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
          aria-label="Remove player"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      )}

      <h3 className="font-heading text-2xl text-primary mb-4">
        Player {playerNumber}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 input-focus text-gray-900"
            placeholder="Enter player name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">
            Age *
          </label>
          <input
            type="number"
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 input-focus text-gray-900"
            placeholder="Age"
            min="15"
            max="60"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 input-focus text-gray-900"
            placeholder="+91 XXXXX XXXXX"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">
            Jersey Number *
          </label>
          <input
            type="number"
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 input-focus text-gray-900"
            placeholder="00"
            min="0"
            max="99"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">
            Role *
          </label>
          <select
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 input-focus text-gray-900"
            required
          >
            <option value="">Select Role</option>
            <option value="batsman">Batsman</option>
            <option value="bowler">Bowler</option>
            <option value="all-rounder">All-Rounder</option>
            <option value="wicket-keeper">Wicket Keeper</option>
          </select>
        </div>
      </div>
    </motion.div>
  )
}

export default PlayerFormCard
