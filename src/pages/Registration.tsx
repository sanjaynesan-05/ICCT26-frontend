import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Plus, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react'
import PlayerFormCard from '../components/PlayerFormCard'
import FileUpload from '../components/FileUpload'
import { apiService } from '../services/api'

interface CaptainInfo {
  name: string
  phone: string
  whatsapp: string
  email: string
}

interface PlayerData {
  name: string
  age: number
  phone: string
  role: string
  aadharFile: File | null
  subscriptionFile: File | null
}

interface FormData {
  churchName: string
  teamName: string
  pastorLetter: File | null
  captain: CaptainInfo
  viceCaptain: CaptainInfo
  players: PlayerData[]
  paymentReceipt: File | null
}

const CHURCH_NAMES = [
  'CSI St. Peter\'s Church',
  'CSI Christ Church',
  'CSI Grace Church',
  'CSI Zion Church',
  'CSI Emmanuel Church',
  'CSI Trinity Church',
  'CSI Holy Cross Church',
  'CSI Bethel Church',
  'CSI Calvary Church',
  'CSI Vision Church',
]

const Registration = () => {
  const [currentStep, setCurrentStep] = useState(0) // Start at step 0 for rules
  // playerCount is derived from formData.players length
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationError, setValidationError] = useState<string>('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const emptyPlayer = (): PlayerData => ({
    name: '',
    age: 18,
    phone: '',
    role: '',
    aadharFile: null,
    subscriptionFile: null,
  })

  const [formData, setFormData] = useState<FormData>({
    churchName: '',
    teamName: '',
    pastorLetter: null,
    captain: { name: '', phone: '', whatsapp: '', email: '' },
    viceCaptain: { name: '', phone: '', whatsapp: '', email: '' },
    players: Array.from({ length: 11 }).map(() => emptyPlayer()),
    paymentReceipt: null,
  })

  const totalSteps = 6
  const progress = ((currentStep + 1) / totalSteps) * 100

  const steps = [
    { number: 1, title: 'Team Details' },
    { number: 2, title: 'Captain & Vice-Captain' },
    { number: 3, title: 'Players' },
    { number: 4, title: 'Review' },
    { number: 5, title: 'Payment Upload' },
  ]

  const clearValidationError = () => {
    setValidationError('')
  }

  const validateCurrentStep = (): string | null => {
    switch (currentStep) {
      case 1:
        // Step 1: Team Details validation
        if (!formData.churchName.trim()) return 'Please select a church name'
        if (!formData.teamName.trim()) return 'Please enter a team name'
        if (!formData.pastorLetter) return 'Please upload a church letter'
        break

      case 2:
        // Step 2: Captain & Vice-Captain validation
        if (!formData.captain.name.trim()) return 'Please enter captain name'
        if (!formData.captain.phone.trim()) return 'Please enter captain phone number'
        if (!formData.captain.whatsapp.trim() || formData.captain.whatsapp.length !== 10) return 'Please enter valid 10-digit WhatsApp number for captain'
        if (!formData.captain.email.trim() || !formData.captain.email.includes('@')) return 'Please enter valid email for captain'

        if (!formData.viceCaptain.name.trim()) return 'Please enter vice-captain name'
        if (!formData.viceCaptain.phone.trim()) return 'Please enter vice-captain phone number'
        if (!formData.viceCaptain.whatsapp.trim() || formData.viceCaptain.whatsapp.length !== 10) return 'Please enter valid 10-digit WhatsApp number for vice-captain'
        if (!formData.viceCaptain.email.trim() || !formData.viceCaptain.email.includes('@')) return 'Please enter valid email for vice-captain'
        break

      case 3:
        // Step 3: Players validation
        for (let i = 0; i < formData.players.length; i++) {
          const player = formData.players[i]
          if (!player.name.trim()) return `Player ${i + 1}: Please enter name`
          if (player.age < 15 || player.age > 60) return `Player ${i + 1}: Age must be between 15 and 60`
          if (!player.phone.trim()) return `Player ${i + 1}: Please enter phone number`
          if (!player.role) return `Player ${i + 1}: Please select a role`
          if (!player.aadharFile) return `Player ${i + 1}: Please upload Aadhar/ID`
          if (!player.subscriptionFile) return `Player ${i + 1}: Please upload subscription/consent`
        }
        break

      case 4:
        // Step 4: Review - no validation needed, just review
        break

      case 5:
        // Step 5: Payment Upload validation
        if (!formData.paymentReceipt) return 'Please upload payment receipt'
        break

      default:
        break
    }
    return null
  }

  const handleNext = () => {
    // Clear any previous validation errors
    setValidationError('')
    
    // Special validation for Step 0: Rules acceptance
    if (currentStep === 0) {
      if (!acceptTerms) {
        setValidationError('Please accept the terms and conditions to proceed.')
        return
      }
    } else {
      // Validate current step before proceeding
      const error = validateCurrentStep()
      if (error) {
        setValidationError(error)
        return
      }
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    clearValidationError()
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Base64 helper for files
  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (err) => reject(err)
  })

  const updatePlayer = (index: number, data: Partial<PlayerData>) => {
    clearValidationError()
    const players = [...formData.players]
    players[index] = { ...players[index], ...data }
    setFormData({ ...formData, players })
  }

  const updateCaptain = (data: Partial<typeof formData.captain>) => {
    clearValidationError()
    setFormData({ ...formData, captain: { ...formData.captain, ...data } })
  }

  const updateViceCaptain = (data: Partial<typeof formData.viceCaptain>) => {
    clearValidationError()
    setFormData({ ...formData, viceCaptain: { ...formData.viceCaptain, ...data } })
  }

  const addPlayer = () => {
    if (formData.players.length < 15) {
      setFormData({ ...formData, players: [...formData.players, emptyPlayer()] })
    }
  }

  const removeLastPlayer = () => {
    if (formData.players.length > 11) {
      setFormData({ ...formData, players: formData.players.slice(0, -1) })
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Validation function
      const validateForm = (): string | null => {
        // Team details
        if (!formData.churchName.trim()) return 'Please select a church name'
        if (!formData.teamName.trim()) return 'Please enter a team name'
        if (!formData.pastorLetter) return 'Please upload a church letter'

        // Captain details
        if (!formData.captain.name.trim()) return 'Please enter captain name'
        if (!formData.captain.phone.trim()) return 'Please enter captain phone number'
        if (!formData.captain.whatsapp.trim() || formData.captain.whatsapp.length !== 10) return 'Please enter valid 10-digit WhatsApp number for captain'
        if (!formData.captain.email.trim() || !formData.captain.email.includes('@')) return 'Please enter valid email for captain'

        // Vice-captain details
        if (!formData.viceCaptain.name.trim()) return 'Please enter vice-captain name'
        if (!formData.viceCaptain.phone.trim()) return 'Please enter vice-captain phone number'
        if (!formData.viceCaptain.whatsapp.trim() || formData.viceCaptain.whatsapp.length !== 10) return 'Please enter valid 10-digit WhatsApp number for vice-captain'
        if (!formData.viceCaptain.email.trim() || !formData.viceCaptain.email.includes('@')) return 'Please enter valid email for vice-captain'

        // Players validation (validate active players only - those in the current set)
        for (let i = 0; i < formData.players.length; i++) {
          const player = formData.players[i]
          if (!player.name.trim()) return `Player ${i + 1}: Please enter name`
          if (player.age < 15 || player.age > 60) return `Player ${i + 1}: Age must be between 15 and 60`
          if (!player.phone.trim()) return `Player ${i + 1}: Please enter phone number`
          if (!player.role) return `Player ${i + 1}: Please select a role`
          if (!player.aadharFile) return `Player ${i + 1}: Please upload Aadhar/ID`
          if (!player.subscriptionFile) return `Player ${i + 1}: Please upload subscription/consent`
        }

        // Payment receipt
        if (!formData.paymentReceipt) return 'Please upload payment receipt'

        return null
      }

      const validationError = validateForm()
      if (validationError) {
        alert(validationError)
        setIsSubmitting(false)
        return
      }

      // Convert files to base64
      const pastorLetterBase64 = formData.pastorLetter ? await toBase64(formData.pastorLetter) : ''
      const paymentReceiptBase64 = formData.paymentReceipt ? await toBase64(formData.paymentReceipt) : ''

      const playersWithBase64 = await Promise.all(
        formData.players.map(async (player) => ({
          name: player.name,
          age: player.age,
          phone: player.phone,
          role: player.role,
          aadharFile: player.aadharFile ? await toBase64(player.aadharFile) : '',
          subscriptionFile: player.subscriptionFile ? await toBase64(player.subscriptionFile) : '',
        }))
      )

      const payload = {
        churchName: formData.churchName,
        teamName: formData.teamName,
        pastorLetter: pastorLetterBase64,
        captain: { ...formData.captain },
        viceCaptain: { ...formData.viceCaptain },
        players: playersWithBase64,
        paymentReceipt: paymentReceiptBase64,
      }

      await apiService.registerTeam(payload)
      setShowSuccess(true)
    } catch (err) {
      console.error('Submit error', err)
      const errorMessage = err instanceof Error ? err.message : 'Registration failed'
      alert(`Error: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (file: File | null) => {
    clearValidationError()
    setFormData({ ...formData, paymentReceipt: file })
  }

  const handlePastorLetterChange = (file: File | null) => {
    clearValidationError()
    setFormData({ ...formData, pastorLetter: file })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20 px-4 lg:px-8"
    >
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="font-heading text-6xl md:text-7xl text-accent mb-4">
            Team Registration
          </h1>
          <p className="font-subheading text-xl text-gray-300">
            Complete all steps to register your team
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-3 bg-secondary/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-accent to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`flex flex-col items-center transition-all duration-300 ${
                  currentStep >= step.number ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold mb-2 transition-all duration-300 ${
                    currentStep >= step.number
                      ? 'bg-gradient-gold text-primary shadow-[0_0_20px_rgba(255,204,41,0.5)]'
                      : 'bg-secondary text-gray-500'
                  }`}
                >
                  {currentStep > step.number ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    step.number
                  )}
                </div>
                <span className="text-xs md:text-sm font-subheading font-semibold text-white text-center hidden md:block">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-3xl mx-auto">
          {/* Right Side - Form Steps */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-6 md:p-8"
          >
            <AnimatePresence mode="wait">
              {/* Step 0: Rules & Regulations */}
              {currentStep === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card rounded-2xl p-8 mb-8"
                >
                  <div className="text-center mb-8">
                    <h2 className="font-heading text-4xl md:text-5xl text-primary mb-4">
                      Rules & Regulations
                    </h2>
                    <p className="text-gray-600 font-subheading">
                      Please read and accept the rules before proceeding with registration
                    </p>
                  </div>

                  <div className="space-y-6 text-gray-800 max-h-96 overflow-y-auto mb-8">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                      <p className="font-semibold text-yellow-800 mb-2">⚠️ Important Notice:</p>
                      <p className="text-yellow-700">
                        Ensure all the details you filled is correct & it must be matches with your Photo, Subscription card & Aadhaar Card details, after that your team will be qualify for registration.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-heading text-2xl text-primary mb-4">1. Team Registration</h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Only one team is allowed to represent a single church.</li>
                        <li>The first 16 teams that complete their registration with the required documents will be eligible to participate.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-heading text-2xl text-primary mb-4">2. Documents Required</h3>
                      <p className="mb-3">To register, each team must submit the following:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Passport-sized photo of each player.</li>
                        <li>Subscription card.</li>
                        <li>Aadhar card.</li>
                      </ul>
                      <p className="mt-3 text-sm text-gray-600 italic">
                        Note: Each document must be submitted as a separate IMAGE (jpg) file, labeled with the respective player's name.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-heading text-2xl text-primary mb-4">3. Umpire's Decision</h3>
                      <p>The umpire's decision is final and binding on all teams.</p>
                    </div>

                    <div>
                      <h3 className="font-heading text-2xl text-primary mb-4">4. Power-Play Rules</h3>
                      <p className="mb-3">It's a 10 overs match.</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li><strong>First Power-Play:</strong> Overs 1-2<br />Only two fielders are allowed outside the 30-yard circle.</li>
                        <li><strong>Second Power-Play:</strong> Can be taken in any one of the 6th, 7th, or 8th over.<br />Only five fielders are allowed outside the 30-yard circle during this period.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-heading text-2xl text-primary mb-4">5. Bowling Restrictions</h3>
                      <p>Only One bowler is allowed to bowl a maximum of 3 overs.</p>
                    </div>

                    <div>
                      <h3 className="font-heading text-2xl text-primary mb-4">6. Tie-Breaker Rule</h3>
                      <p>In the event of a tie, a super over will be provided.</p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className="font-heading text-xl text-blue-800 mb-4">7. Important Notice to all Teams:</h3>
                      <ul className="list-disc list-inside space-y-3 text-blue-700">
                        <li>Main 11 players need to be submit all the above required details.</li>
                        <li>If your team has only main 11 players you don't need to fill the last 4 players details.</li>
                        <li>While match you cannot change over the substitute if you submit only main 11 players.</li>
                        <li>If the player name is submitted without the required details that application is not accepted even you get the registration successful.</li>
                      </ul>
                      <p className="mt-4 text-blue-800 font-semibold">
                        These are the rules and regulations of the event.
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-start gap-3 mb-6">
                      <input
                        type="checkbox"
                        id="acceptTerms"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <label htmlFor="acceptTerms" className="text-gray-700 font-medium">
                        I have read and understood all the rules and regulations. I agree to abide by these terms and conditions.
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 1: Team Details */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-heading text-3xl text-primary mb-6">
                    Team Information
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">
                        Church Name *
                      </label>
                      <select
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 input-focus text-gray-900 bg-white"
                        value={formData.churchName}
                        onChange={(e) => setFormData({ ...formData, churchName: e.target.value })}
                        required
                      >
                        <option value="">Select your church...</option>
                        {CHURCH_NAMES.map((church) => (
                          <option key={church} value={church}>{church}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">
                        Team Name *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 input-focus text-gray-900 bg-white"
                        placeholder="Enter team name"
                        value={formData.teamName}
                        onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">
                        Church Letter *
                      </label>
                      <div>
                        <FileUpload file={formData.pastorLetter} onFileChange={handlePastorLetterChange} accept="image/*,.pdf,.doc,.docx" placeholder="Upload Church Letter" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Captain & Vice-Captain */}
              
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-heading text-3xl text-primary mb-6">Captain & Vice-Captain</h3>

                  <div className="space-y-8">
                    {/* Captain Details */}
                    <div className="bg-blue-50 rounded-xl p-6">
                      <h4 className="font-subheading font-bold text-primary text-xl mb-4">Captain Details</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">Full Name *</label>
                          <input type="text" className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 input-focus text-gray-900 bg-white" placeholder="Captain's name" value={formData.captain.name} onChange={(e) => setFormData({ ...formData, captain: { ...formData.captain, name: e.target.value } })} required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">Phone Number *</label>
                            <input type="tel" className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 input-focus text-gray-900 bg-white" placeholder="+91 XXXXX XXXXX" value={formData.captain.phone} onChange={(e) => setFormData({ ...formData, captain: { ...formData.captain, phone: e.target.value } })} required />
                          </div>

                          <div>
                            <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">WhatsApp Number (10 digits) *</label>
                            <input type="tel" className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 input-focus text-gray-900 bg-white" placeholder="Enter 10-digit number" maxLength={10} value={formData.captain.whatsapp} onChange={(e) => setFormData({ ...formData, captain: { ...formData.captain, whatsapp: e.target.value } })} required />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">Email *</label>
                          <input type="email" className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 input-focus text-gray-900 bg-white" placeholder="email@example.com" value={formData.captain.email} onChange={(e) => setFormData({ ...formData, captain: { ...formData.captain, email: e.target.value } })} required />
                        </div>
                      </div>
                    </div>

                    {/* Vice-Captain Details */}
                    <div className="bg-green-50 rounded-xl p-6">
                      <h4 className="font-subheading font-bold text-green-700 text-xl mb-4">Vice-Captain Details</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">Full Name *</label>
                          <input type="text" className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 input-focus text-gray-900 bg-white" placeholder="Vice-Captain's name" value={formData.viceCaptain.name} onChange={(e) => setFormData({ ...formData, viceCaptain: { ...formData.viceCaptain, name: e.target.value } })} required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">Phone Number *</label>
                            <input type="tel" className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 input-focus text-gray-900 bg-white" placeholder="+91 XXXXX XXXXX" value={formData.viceCaptain.phone} onChange={(e) => setFormData({ ...formData, viceCaptain: { ...formData.viceCaptain, phone: e.target.value } })} required />
                          </div>

                          <div>
                            <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">WhatsApp Number (10 digits) *</label>
                            <input type="tel" className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 input-focus text-gray-900 bg-white" placeholder="Enter 10-digit number" maxLength={10} value={formData.viceCaptain.whatsapp} onChange={(e) => setFormData({ ...formData, viceCaptain: { ...formData.viceCaptain, whatsapp: e.target.value } })} required />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">Email *</label>
                          <input type="email" className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 input-focus text-gray-900 bg-white" placeholder="email@example.com" value={formData.viceCaptain.email} onChange={(e) => setFormData({ ...formData, viceCaptain: { ...formData.viceCaptain, email: e.target.value } })} required />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Player Details */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="max-h-[600px] overflow-y-auto overflow-x-hidden"
                >
                  <div className="sticky top-0 bg-white pb-4 mb-4 z-10">
                    <h3 className="font-heading text-3xl text-primary mb-2">
                      Player Details
                    </h3>
                    <p className="text-sm text-gray-600">
                      Add 11-15 players (Captain & Vice-Captain included)
                    </p>
                  </div>

                    <div className="space-y-4">
                      {formData.players.map((player, index) => (
                        <PlayerFormCard
                          key={index}
                          playerNumber={index + 1}
                          player={player}
                          onChange={(data) => updatePlayer(index, data)}
                          onRemove={index === formData.players.length - 1 && formData.players.length > 11 ? removeLastPlayer : undefined}
                          canRemove={index === formData.players.length - 1 && formData.players.length > 11}
                        />
                      ))}
                    </div>

                    {formData.players.length < 15 && (
                      <button
                        onClick={addPlayer}
                        className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary hover:shadow-lg hover:shadow-primary/50 text-white font-subheading font-semibold rounded-lg transition-all duration-300 hover:scale-105"
                      >
                        <Plus className="w-5 h-5" />
                        Add Player
                      </button>
                    )}
                </motion.div>
              )}

              {/* Step 4: Review & Submit */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-heading text-3xl text-primary mb-6">
                    Review Information
                  </h3>
                  <div className="space-y-6">
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                      <p className="font-subheading text-green-700 font-semibold">
                        ✓ Please review all information before final submission
                      </p>
                    </div>

                    <div className="space-y-3 text-gray-700">
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-subheading font-semibold">Church Name:</span>
                        <span>{formData.churchName || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-subheading font-semibold">Team Name:</span>
                        <span>{formData.teamName || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-subheading font-semibold">Captain:</span>
                        <span>{formData.captain.name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-subheading font-semibold">Captain Phone:</span>
                        <span>{formData.captain.phone || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-subheading font-semibold">Captain Email:</span>
                        <span>{formData.captain.email || 'N/A'}</span>
                      </div>

                      <div className="flex justify-between py-2 border-b">
                        <span className="font-subheading font-semibold">Vice-Captain:</span>
                        <span>{formData.viceCaptain.name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-subheading font-semibold">Vice-Captain Phone:</span>
                        <span>{formData.viceCaptain.phone || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-subheading font-semibold">Vice-Captain Email:</span>
                        <span>{formData.viceCaptain.email || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-subheading font-semibold">Total Players:</span>
                        <span>{formData.players.length}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-subheading font-semibold">Registration Fee:</span>
                        <span className="text-green-600 font-bold">₹2,000</span>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> By submitting this form, you agree to the tournament 
                        rules and regulations. All information provided must be accurate.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Payment Upload */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-heading text-3xl text-primary mb-6">
                    Payment Upload
                  </h3>
                  <div className="space-y-6">
                    <div className="bg-blue-50 border-l-4 border-primary p-4 rounded">
                      <p className="font-subheading text-primary font-semibold mb-2">
                        Registration Fee: ₹2,000
                      </p>
                      <p className="text-sm text-gray-700">
                        Scan the QR code below to make payment
                      </p>
                    </div>

                    {/* QR Code Section */}
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-white p-4 rounded-xl shadow-lg mb-4">
                        <img 
                          src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=icct26@upi&pn=ICCT26&am=2000&tn=ICCT26%20Registration%20Fee" 
                          alt="Payment QR Code" 
                          className="w-64 h-64 object-cover rounded-lg"
                        />
                      </div>
                      <p className="text-center font-subheading text-gray-600 mb-4">
                        Scan with any UPI app to pay ₹2,000
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">Upload Payment Receipt * (Required)</label>
                      <div>
                        <FileUpload file={formData.paymentReceipt} onFileChange={handleFileChange} accept="image/*" placeholder="Upload Receipt" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Validation Error Display */}
            {validationError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700 font-medium">{validationError}</p>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-subheading font-semibold transition-all ${
                  currentStep === 0
                    ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={isSubmitting}
                className={`flex items-center gap-2 btn-gold ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    {currentStep === 5 ? 'Submit' : 'Next'}
                    {currentStep < 5 && <ChevronRight className="w-5 h-5" />}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="glass-card rounded-2xl p-8 max-w-md w-full text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="font-heading text-4xl text-primary mb-4">
                Registration Successful!
              </h2>
              <p className="font-subheading text-gray-700 mb-6">
                Your team has been successfully registered for ICCT26
              </p>
              <div className="bg-accent/20 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">Your Team ID</p>
                <p className="font-heading text-3xl text-primary">
                  ICCT26-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowSuccess(false)
                  setCurrentStep(0)
                }}
                className="btn-gold w-full"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Registration
