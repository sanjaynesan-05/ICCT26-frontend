import { motion } from 'framer-motion'
import { X, Upload } from 'lucide-react'
import { useState } from 'react'

interface PlayerFormCardProps {
  playerNumber: number
  onRemove?: () => void
  canRemove: boolean
}

const PlayerFormCard = ({ playerNumber, onRemove, canRemove }: PlayerFormCardProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [aadharFile, setAadharFile] = useState<File | null>(null)
  const [aadharFileName, setAadharFileName] = useState('')
  const [aadharDragActive, setAadharDragActive] = useState(false)
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [subscriptionFile, setSubscriptionFile] = useState<File | null>(null)
  const [subscriptionFileName, setSubscriptionFileName] = useState('')
  const [subscriptionDragActive, setSubscriptionDragActive] = useState(false)

  const handleAadharDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setAadharDragActive(true)
  }

  const handleAadharDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setAadharDragActive(false)
  }

  const handleAadharDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setAadharDragActive(false)
    const files = e.dataTransfer.files
    if (files && files[0]) {
      setAadharFile(files[0])
      setAadharFileName(files[0].name)
    }
  }

  const handleAadharFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAadharFile(e.target.files[0])
      setAadharFileName(e.target.files[0].name)
    }
  }

  const handleSubscriptionDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSubscriptionDragActive(true)
  }

  const handleSubscriptionDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSubscriptionDragActive(false)
  }

  const handleSubscriptionDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSubscriptionDragActive(false)
    const files = e.dataTransfer.files
    if (files && files[0]) {
      setSubscriptionFile(files[0])
      setSubscriptionFileName(files[0].name)
    }
  }

  const handleSubscriptionFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSubscriptionFile(e.target.files[0])
      setSubscriptionFileName(e.target.files[0].name)
    }
  }

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

      <hr className="my-6 border-gray-300" />

      {/* Document Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Aadhar Card Upload */}
        <div>
          <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">
            Aadhar Card Upload *
          </label>
          <div className="relative">
            <label
              className={`flex items-center gap-2 p-3 border-2 border-dashed rounded-lg cursor-pointer bg-white hover:shadow-md transition text-sm ${
                aadharDragActive ? 'border-gray-700 bg-gray-100' : 'border-gray-300'
              }`}
              onDragOver={handleAadharDragOver}
              onDragLeave={handleAadharDragLeave}
              onDrop={handleAadharDrop}
            >
              <Upload className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <span className="truncate max-w-[140px] text-gray-700 font-subheading text-xs">
                {aadharFileName ? aadharFileName : 'Upload Aadhar'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAadharFileChange}
                className="hidden"
              />
            </label>
            {aadharFileName && (
              <button
                type="button"
                className="absolute top-2 right-2 p-0.5 rounded-full bg-white hover:bg-gray-200 text-gray-500 shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
                style={{ zIndex: 2, width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={(e) => {
                  e.stopPropagation()
                  setAadharFile(null)
                  setAadharFileName('')
                }}
                tabIndex={-1}
                aria-label="Cancel Aadhar upload"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Subscription Card Upload */}
        <div>
          <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">
            Subscription Card Upload *
          </label>
          <div className="relative">
            <label
              className={`flex items-center gap-2 p-3 border-2 border-dashed rounded-lg cursor-pointer bg-white hover:shadow-md transition text-sm ${
                subscriptionDragActive ? 'border-gray-700 bg-gray-100' : 'border-gray-300'
              }`}
              onDragOver={handleSubscriptionDragOver}
              onDragLeave={handleSubscriptionDragLeave}
              onDrop={handleSubscriptionDrop}
            >
              <Upload className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <span className="truncate max-w-[140px] text-gray-700 font-subheading text-xs">
                {subscriptionFileName ? subscriptionFileName : 'Upload Subscription'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleSubscriptionFileChange}
                className="hidden"
              />
            </label>
            {subscriptionFileName && (
              <button
                type="button"
                className="absolute top-2 right-2 p-0.5 rounded-full bg-white hover:bg-gray-200 text-gray-500 shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
                style={{ zIndex: 2, width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={(e) => {
                  e.stopPropagation()
                  setSubscriptionFile(null)
                  setSubscriptionFileName('')
                }}
                tabIndex={-1}
                aria-label="Cancel Subscription upload"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PlayerFormCard

