import React from 'react'
import { X } from 'lucide-react'
import FileUpload from './FileUpload'

interface PlayerData {
  name: string
  age: number
  phone: string
  role: string
  aadharFile: File | null
  subscriptionFile: File | null
}

interface Props {
  playerNumber: number
  player: PlayerData
  onChange: (data: Partial<PlayerData>) => void
  onRemove?: () => void
  canRemove?: boolean
}

const PlayerFormCard: React.FC<Props> = ({ playerNumber, player, onChange, onRemove, canRemove }) => {
  // kept inline using FileUpload; no local file input handlers required

  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <div className="flex justify-between items-start">
        <h4 className="font-subheading font-semibold">Player {playerNumber}</h4>
        {canRemove && onRemove && (
          <button onClick={onRemove} className="text-gray-400 hover:text-red-500" aria-label="Remove player"><X /></button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-subheading text-gray-700 mb-1">Full Name *</label>
          <input type="text" value={player.name} onChange={(e) => onChange({ name: e.target.value })} className="w-full px-3 py-2 border rounded bg-white text-gray-900" required />
        </div>

        <div>
          <label className="block text-sm font-subheading text-gray-700 mb-1">Age *</label>
          <input type="number" min={15} max={60} value={player.age} onChange={(e) => onChange({ age: Number(e.target.value) })} className="w-full px-3 py-2 border rounded bg-white text-gray-900" required />
        </div>

        <div>
          <label className="block text-sm font-subheading text-gray-700 mb-1">Phone *</label>
          <input type="tel" value={player.phone} onChange={(e) => onChange({ phone: e.target.value })} className="w-full px-3 py-2 border rounded bg-white text-gray-900" required />
        </div>

        <div>
          <label className="block text-sm font-subheading text-gray-700 mb-1">Role *</label>
          <select value={player.role} onChange={(e) => onChange({ role: e.target.value })} className="w-full px-3 py-2 border rounded bg-white text-gray-900" required>
            <option value="">Select Role</option>
            <option value="Batsman">Batsman</option>
            <option value="Bowler">Bowler</option>
            <option value="All-rounder">All-rounder</option>
            <option value="Wicket-keeper">Wicket-keeper</option>
          </select>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-subheading text-gray-700 mb-1">Aadhar / ID (image/pdf)</label>
          <FileUpload file={player.aadharFile} onFileChange={(f) => onChange({ aadharFile: f })} accept="image/*,.pdf" placeholder="Upload Aadhar" />
        </div>

        <div>
          <label className="block text-sm font-subheading text-gray-700 mb-1">Subscription / Consent (image/pdf)</label>
          <FileUpload file={player.subscriptionFile} onFileChange={(f) => onChange({ subscriptionFile: f })} accept="image/*,.pdf" placeholder="Upload Subscription" />
        </div>
      </div>
    </div>
  )
}

export default PlayerFormCard

