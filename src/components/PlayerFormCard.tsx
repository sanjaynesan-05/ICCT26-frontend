import React from 'react'
import { X } from 'lucide-react'
import FileUpload from './FileUpload'

interface PlayerData {
  name: string
  age: number
  phone: string
  role: string
  jerseyNumber: string
  aadharFile: File | null
  aadharFileBase64: string | null
  subscriptionFile: File | null
  subscriptionFileBase64: string | null
}

interface Props {
  playerNumber: number
  player: PlayerData
  onChange: (data: Partial<PlayerData>) => void
  onRemove?: () => void
  canRemove?: boolean
}

const PlayerFormCard: React.FC<Props> = ({ playerNumber, player, onChange, onRemove, canRemove }) => {
  const handleAadharChange = (base64: string | null) => {
    onChange({ 
      aadharFileBase64: base64,
      aadharFile: base64 ? new File([], 'aadhar') : null
    })
  }

  const handleSubscriptionChange = (base64: string | null) => {
    onChange({ 
      subscriptionFileBase64: base64,
      subscriptionFile: base64 ? new File([], 'subscription') : null
    })
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <div className="flex justify-between items-start">
        <h4 className="font-subheading font-semibold text-gray-900">Player {playerNumber}</h4>
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
          <input type="number" min={18} max={40} value={player.age} onChange={(e) => onChange({ age: Number(e.target.value) })} className="w-full px-3 py-2 border rounded bg-white text-gray-900" required />
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
            <option value="Wicketkeeper">Wicketkeeper</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-subheading text-gray-700 mb-1">Jersey Number *</label>
          <input 
            type="text" 
            value={player.jerseyNumber} 
            onChange={(e) => onChange({ jerseyNumber: e.target.value })} 
            maxLength={3}
            placeholder="e.g., 7, 10, 99"
            className="w-full px-3 py-2 border rounded bg-white text-gray-900" 
            required 
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-subheading text-gray-700 mb-1">Aadhar / ID (PDF) *</label>
          <FileUpload file={player.aadharFile} onFileChange={handleAadharChange} accept=".jpg,.jpeg,.png,.pdf" placeholder="Upload Aadhar" />
        </div>

        <div>
          <label className="block text-sm font-subheading text-gray-700 mb-1">Subscription / Consent (PDF) *</label>
          <FileUpload file={player.subscriptionFile} onFileChange={handleSubscriptionChange} accept=".jpg,.jpeg,.png,.pdf" placeholder="Upload Subscription" />
        </div>
      </div>
    </div>
  )
}

export default PlayerFormCard
