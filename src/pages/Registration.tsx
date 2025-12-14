/**
 * ICCT26 Production-Grade Registration Component
 * Full client validation, idempotency, retry logic, progress bars, error handling
 * Created: November 17, 2025 | Consolidated: November 18, 2025
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Plus, CheckCircle, ChevronRight, ChevronLeft, Copy, AlertTriangle, Sparkles } from 'lucide-react'
import confetti from 'canvas-confetti'
import PlayerFormCard from '../components/PlayerFormCard'
import FileUpload from '../components/FileUpload'
import { DetailedProgressBar } from '../components/ProgressBar'
import { SearchableSelect } from '../components/SearchableSelect'

// Import production utilities
import {
  isValidName,
  isValidTeamName,
  isValidPhone,
  isValidEmail,
  isValidFile,
  sanitizeFilename,
  validateTeamRegistration,
  FieldError,
  VALIDATION_MESSAGES
} from '../utils/validation'

import {
  generateIdempotencyKey,
  saveIdempotencyRecord,
  removeIdempotencyRecord,
  saveLastSubmission,
  getLastSubmission,
  initializeIdempotency
} from '../utils/idempotency'

import {
  uploadMultipartWithRetry,
  extractErrorMessage,
  isSuccessResponse,
  handleAxiosError,
  BackendResponse
} from '../utils/apiClient'

// ============================================================================
// TYPES
// ============================================================================

interface CaptainInfo {
  name: string
  phone: string
  whatsapp: string
  email: string
}

interface PlayerData {
  name: string
  role: string
  aadharFile: File | null
  subscriptionFile: File | null
}

interface FormData {
  churchName: string
  teamName: string
  pastorLetter: File | null
  groupPhoto: File | null
  captain: CaptainInfo
  viceCaptain: CaptainInfo
  players: PlayerData[]
  paymentReceipt: File | null
}

interface RegistrationResponse {
  team_id: string
  team_name: string
  email_sent: boolean
  message: string
}

// ============================================================================
// CONSTANTS
// ============================================================================

// Set to true to close/lock registration
const REGISTRATION_CLOSED = true

const CHURCH_NAMES = [
  "CSI St. Peters Church Rathinapuri",
  "CSI Immanuel Church Coimbatore",
  "CSI Christ Church Trichy Road",
  "CSI Christ Church Gandhipuram",
  "CSI All Souls Church Race Course",
  "CSI Ramanathapuram Pastorate",
  "CSI Christ Church NGGO Colony",
  "CSI Christ Church TVS Nagar",
  "CSI Christ Church Madukkarai",
  "CSI Christ Church Police Quarters",
  "CSI Christ Church Sundarapuram",
  "CSI Christ Church Kovaipudur",
  "CSI Singanallur Pastorate",
  "CSI Ondipudur Pastorate",
  "CSI Sowripalayam Pastorate",
  "CSI Varadarajapuram Pastorate",
  "CSI Good Shepherd Church Cheran Ma Nagar",
  "CSI Union Church Podanur",
  "CSI Addis Pastorate",
  "CSI Kavundampalayam Pastorate",
  "CSI Holy Redeemers Church SB Colony",
  "CSI Pollachi Pastorate",
  "CSI Perur Pastorate",
  "CSI Vadavalli Pastorate",
  "CSI Christ Church Mathuvarayapuram",
  "CSI Malumichampatti Pastorate",
  "CSI Visuvasapuram Pastorate",
  "CSI Church Airport",
  "CSI Saint Marks Church Podanur",
  "CSI Church Irugur",
  "CSI Chettipalayam Pastorate",
  "CSI New Mullai Nagar Pastorate",
  "CSI Pattanam Pastorate",
  "CSI Wals Memorial Church Thadagam",
  "CSI Saint Pauls Church Tirupur",
  "CSI Saint Lukes Church Tirupur",
  "CSI Tirupur Rural Pastorate",
  "CSI Pitchampalayam Pastorate",
  "CSI Church Peruntholuvu",
  "CSI Church Nallur",
  "CSI Christ Church Press Colony",
  "CSI Sirumugai Pastorate",
  "CSI Mettupalayam Pastorate",
  "CSI Karamadai Pastorate",
  "CSI Christ Church Somanur",
  "CSI Sulur Pastorate",
  "CSI Annur Pastorate",
  "CSI Avinashi Pastorate",
  "CSI Kaniyur Mooperipalayam Pastorate",
  "CSI Church Nambiyur Kedarai",
  "CSI Perumanallur Kunnathur Pastorate",
  "CSI Saint Johns Church Palladam",
  "CSI Annur Rural Pastorate",
  "CSI Iduvai Divine Nagar Pastorate",
  "CSI Church Chinniampalayam",
  "CSI Gudalur Pastorate",
  "CSI Devarshola Pastorate",
  "CSI Pandalur Pastorate",
  "CSI Masinagudi Pastorate",
  "CSI Naduvattam Pastorate",
  "CSI Holy Trinity Church Ooty",
  "CSI Lovedale Pastorate",
  "CSI Saint Stephens Church Ooty",
  "CSI Wesley Church Ooty",
  "CSI Wesley Church Ketti",
  "CSI Saint Georges Church Wellington",
  "CSI Aruvankadu Pastorate",
  "CSI Selas Pastorate",
  "CSI Kundha Pastorate",
  "CSI Hulical Pastorate",
  "CSI Nonsuch Pastorate",
  "CSI Wesley Church Coonoor",
  "CSI Saint Johns Church Coonoor",
  "CSI All Saints Church Coonoor",
  "CSI Kullakamby Pastorate",
  "CSI Adderley Pastorate",
  "CSI Saint Lukes Church Kotagiri",
  "CSI Wesley Church Kotagiri",
  "CSI Masakkal And Thanthanadu",
  "CSI Burnside Pastorate",
  "CSI Kil Kotagiri Pastorate",
  "CSI Milidhane Pastorate"
]

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const Registration = () => {
  // ========== STATE MANAGEMENT ==========
  const [currentStep, setCurrentStep] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<FieldError[]>([])
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showProgress, setShowProgress] = useState(false)
  const [currentIdempotencyKey, setCurrentIdempotencyKey] = useState<string>('')
  const [registeredTeamId, setRegisteredTeamId] = useState<string>('')
  const [showDocumentConfirmation, setShowDocumentConfirmation] = useState(false)
  const [documentConfirmed, setDocumentConfirmed] = useState(false)

  const emptyPlayer = (): PlayerData => ({
    name: '',
    role: '',
    aadharFile: null, 
    subscriptionFile: null,
  })

  const [formData, setFormData] = useState<FormData>({
    churchName: '',
    teamName: '',
    pastorLetter: null,
    groupPhoto: null,
    captain: { name: '', phone: '', whatsapp: '', email: '' },
    viceCaptain: { name: '', phone: '', whatsapp: '', email: '' },
    players: Array.from({ length: 11 }).map(() => emptyPlayer()),
    paymentReceipt: null,
  })

  // ========== INITIALIZATION ==========
  useEffect(() => {
    initializeIdempotency()

    // Check for last successful submission
    const lastSubmission = getLastSubmission()
    if (lastSubmission) {
      console.log('Last submission found:', lastSubmission)
    }
  }, [])

  // ========== UTILITIES ==========
  const totalSteps = 6
  const progress = ((currentStep + 1) / totalSteps) * 100

  const steps = [
    { number: 1, title: 'Team Details' },
    { number: 2, title: 'Captain & Vice-Captain' },
    { number: 3, title: 'Players' },
    { number: 4, title: 'Review' },
    { number: 5, title: 'Payment Upload' },
  ]

  const clearValidationErrors = () => setValidationErrors([])

  const addValidationError = (field: string, error: string) => {
    setValidationErrors((prev: FieldError[]) => [...prev, { field, error }])
  }

  // ========== VALIDATION ==========
  const validateCurrentStep = (): boolean => {
    clearValidationErrors()

    switch (currentStep) {
      case 1: { // Team Details
        let hasErrors = false

        const teamNameValidation = isValidTeamName(formData.teamName)
        if (!teamNameValidation.isValid) {
          addValidationError('teamName', teamNameValidation.error!)
          hasErrors = true
        }

        if (!formData.churchName.trim()) {
          addValidationError('churchName', VALIDATION_MESSAGES.CHURCH_NAME_REQUIRED)
          hasErrors = true
        }

        if (!formData.pastorLetter) {
          addValidationError('pastorLetter', 'Pastor letter is required')
          hasErrors = true
        } else {
          const fileValidation = isValidFile(formData.pastorLetter)
          if (!fileValidation.isValid) {
            addValidationError('pastorLetter', fileValidation.error!)
            hasErrors = true
          }
        }

        if (!formData.groupPhoto) {
          addValidationError('groupPhoto', 'Group photo is required')
          hasErrors = true
        } else {
          const fileValidation = isValidFile(formData.groupPhoto)
          if (!fileValidation.isValid) {
            addValidationError('groupPhoto', fileValidation.error!)
            hasErrors = true
          }
        }

        return !hasErrors
      }

      case 2: { // Captain & Vice-Captain
        let hasErrors = false

        // Captain validation
        const captainNameValidation = isValidName(formData.captain.name)
        if (!captainNameValidation.isValid) {
          addValidationError('captainName', captainNameValidation.error!)
          hasErrors = true
        }

        const captainPhoneValidation = isValidPhone(formData.captain.phone)
        if (!captainPhoneValidation.isValid) {
          addValidationError('captainPhone', captainPhoneValidation.error!)
          hasErrors = true
        }

        const captainEmailValidation = isValidEmail(formData.captain.email)
        if (!captainEmailValidation.isValid) {
          addValidationError('captainEmail', captainEmailValidation.error!)
          hasErrors = true
        }

        if (formData.captain.whatsapp && formData.captain.whatsapp.trim() !== '') {
          const captainWhatsappValidation = isValidPhone(formData.captain.whatsapp)
          if (!captainWhatsappValidation.isValid) {
            addValidationError('captainWhatsapp', captainWhatsappValidation.error!)
            hasErrors = true
          }
        }

        // Vice-captain validation
        const viceNameValidation = isValidName(formData.viceCaptain.name)
        if (!viceNameValidation.isValid) {
          addValidationError('viceCaptainName', viceNameValidation.error!)
          hasErrors = true
        }

        const vicePhoneValidation = isValidPhone(formData.viceCaptain.phone)
        if (!vicePhoneValidation.isValid) {
          addValidationError('viceCaptainPhone', vicePhoneValidation.error!)
          hasErrors = true
        }

        const viceEmailValidation = isValidEmail(formData.viceCaptain.email)
        if (!viceEmailValidation.isValid) {
          addValidationError('viceCaptainEmail', viceEmailValidation.error!)
          hasErrors = true
        }

        if (formData.viceCaptain.whatsapp && formData.viceCaptain.whatsapp.trim() !== '') {
          const viceWhatsappValidation = isValidPhone(formData.viceCaptain.whatsapp)
          if (!viceWhatsappValidation.isValid) {
            addValidationError('viceCaptainWhatsapp', viceWhatsappValidation.error!)
            hasErrors = true
          }
        }

        return !hasErrors
      }

      case 3: { // Players
        let hasErrors = false

        if (formData.players.length < 11) {
          addValidationError('players', 'At least 11 players are required')
          hasErrors = true
        }

        if (formData.players.length > 15) {
          addValidationError('players', 'Maximum 15 players allowed')
          hasErrors = true
        }

        formData.players.forEach((player: PlayerData, index: number) => {
          const playerNameValidation = isValidName(player.name)
          if (!playerNameValidation.isValid) {
            addValidationError(`player_${index}_name`, `Player ${index + 1}: ${playerNameValidation.error}`)
            hasErrors = true
          }

          if (!player.aadharFile) {
            addValidationError(`player_${index}_aadhar`, `Player ${index + 1}: Aadhar card is required`)
            hasErrors = true
          } else {
            const fileValidation = isValidFile(player.aadharFile)
            if (!fileValidation.isValid) {
              addValidationError(`player_${index}_aadhar`, `Player ${index + 1} Aadhar: ${fileValidation.error}`)
              hasErrors = true
            }
          }

          if (!player.subscriptionFile) {
            addValidationError(`player_${index}_subscription`, `Player ${index + 1}: Subscription file is required`)
            hasErrors = true
          } else {
            const fileValidation = isValidFile(player.subscriptionFile)
            if (!fileValidation.isValid) {
              addValidationError(`player_${index}_subscription`, `Player ${index + 1} Subscription: ${fileValidation.error}`)
              hasErrors = true
            }
          }
        })

        return !hasErrors
      }

      case 4: // Review step - no validation needed
        return true

      case 5: { // Payment
        let hasErrors = false

        if (!formData.paymentReceipt) {
          addValidationError('paymentReceipt', 'Payment receipt is required')
          hasErrors = true
        } else {
          const fileValidation = isValidFile(formData.paymentReceipt)
          if (!fileValidation.isValid) {
            addValidationError('paymentReceipt', fileValidation.error!)
            hasErrors = true
          }
        }

        return !hasErrors
      }

      default:
        return true
    }
  }

  // ========== NAVIGATION ==========
  const handleNext = () => {
    clearValidationErrors()

    if (currentStep === 0) {
      if (!acceptTerms) {
        addValidationError('terms', 'Please accept the terms and conditions to proceed.')
        return
      }
      // Show document confirmation modal after terms are accepted
      setShowDocumentConfirmation(true)
      return
    } else {
      if (!validateCurrentStep()) {
        return
      }
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep((s: number) => s + 1)
    } else {
      void handleSubmit()
    }
  }

  const handlePrevious = () => {
    clearValidationErrors()
    if (currentStep > 0) {
      setCurrentStep((s: number) => s - 1)
    }
  }

  // ========== PLAYER MANAGEMENT ==========
  const updatePlayer = (index: number, data: Partial<PlayerData>) => {
    clearValidationErrors()
    const players = [...formData.players]
    players[index] = { ...players[index], ...data }
    setFormData({ ...formData, players })
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

  // ========== FILE HANDLERS ==========
  const handleFileChange = (file: File | null) => {
    clearValidationErrors()
    setFormData({ ...formData, paymentReceipt: file })
  }

  const handlePastorLetterChange = (file: File | null) => {
    clearValidationErrors()
    setFormData({ ...formData, pastorLetter: file })
  }

  const handleGroupPhotoChange = (file: File | null) => {
    clearValidationErrors()
    setFormData({ ...formData, groupPhoto: file })
  }

  // ========== FORM SUBMISSION WITH PRODUCTION FEATURES ==========
  const handleSubmit = async () => {
    clearValidationErrors()

    // Full form validation before submit
    const validationResult = validateTeamRegistration({
      teamName: formData.teamName,
      churchName: formData.churchName,
      captainName: formData.captain.name,
      captainPhone: formData.captain.phone,
      captainEmail: formData.captain.email,
      captainWhatsapp: formData.captain.whatsapp,
      viceName: formData.viceCaptain.name,
      vicePhone: formData.viceCaptain.phone,
      viceEmail: formData.viceCaptain.email,
      viceWhatsapp: formData.viceCaptain.whatsapp,
      pastorLetter: formData.pastorLetter,
      paymentReceipt: formData.paymentReceipt,
      groupPhoto: formData.groupPhoto,
      players: formData.players
    })

    if (validationResult.length > 0) {
      setValidationErrors(validationResult)
      setCurrentStep(1) // Go back to first step with errors
      return
    }

    // Generate idempotency key
    const idempotencyKey = generateIdempotencyKey()
    setCurrentIdempotencyKey(idempotencyKey)
    saveIdempotencyRecord(idempotencyKey, 'pending')

    // Disable submit button
    setIsSubmitting(true)
    setShowProgress(true)
    setUploadProgress(0)

    try {
      // Build FormData with FastAPI flat field names
      const multipartData = new FormData()

      // Team details
      multipartData.append('team_name', formData.teamName.trim())
      multipartData.append('church_name', formData.churchName.trim())

      // Captain (FLATTENED)
      multipartData.append('captain_name', formData.captain.name.trim())
      multipartData.append('captain_phone', formData.captain.phone.trim())
      multipartData.append('captain_email', formData.captain.email.trim())
      multipartData.append('captain_whatsapp', formData.captain.whatsapp?.trim() || '')

      // Vice-captain (FLATTENED)
      multipartData.append('vice_name', formData.viceCaptain.name.trim())
      multipartData.append('vice_phone', formData.viceCaptain.phone.trim())
      multipartData.append('vice_email', formData.viceCaptain.email.trim())
      multipartData.append('vice_whatsapp', formData.viceCaptain.whatsapp?.trim() || '')

      // Team files with sanitized filenames
      const sanitizedPastorLetter = new File(
        [formData.pastorLetter!],
        sanitizeFilename(formData.pastorLetter!.name),
        { type: formData.pastorLetter!.type }
      )
      multipartData.append('pastor_letter', sanitizedPastorLetter)

      const sanitizedPaymentReceipt = new File(
        [formData.paymentReceipt!],
        sanitizeFilename(formData.paymentReceipt!.name),
        { type: formData.paymentReceipt!.type }
      )
      multipartData.append('payment_receipt', sanitizedPaymentReceipt)

      const sanitizedGroupPhoto = new File(
        [formData.groupPhoto!],
        sanitizeFilename(formData.groupPhoto!.name),
        { type: formData.groupPhoto!.type }
      )
      multipartData.append('group_photo', sanitizedGroupPhoto)

      // Players (FLATTENED)
      formData.players.forEach((p: PlayerData, index: number) => {
        multipartData.append(`player_${index}_name`, p.name.trim())
        multipartData.append(`player_${index}_role`, p.role?.trim() || '')

        // Sanitize player file names
        const sanitizedAadhar = new File(
          [p.aadharFile!],
          sanitizeFilename(p.aadharFile!.name),
          { type: p.aadharFile!.type }
        )
        multipartData.append(`player_${index}_aadhar_file`, sanitizedAadhar)

        const sanitizedSubscription = new File(
          [p.subscriptionFile!],
          sanitizeFilename(p.subscriptionFile!.name),
          { type: p.subscriptionFile!.type }
        )
        multipartData.append(`player_${index}_subscription_file`, sanitizedSubscription)
      })

      console.log('📤 Submitting with idempotency key:', idempotencyKey)
      console.log('📦 Total files:', 3 + (formData.players.length * 2))

      // 🔍 DEBUG: Log all FormData entries
      console.log('🔍 === COMPLETE FORMDATA DEBUG ===')
      for (let [key, value] of multipartData.entries()) {
        if (value instanceof File) {
          console.log(`✅ ${key}: File(name: ${value.name}, size: ${value.size} bytes, type: ${value.type})`)
        } else {
          console.log(`📝 ${key}: ${value}`)
        }
      }
      console.log('🔍 === END FORMDATA DEBUG ===')

      // Upload with retry logic and progress tracking
      const response: BackendResponse<RegistrationResponse> = await uploadMultipartWithRetry(
        '/api/register/team',
        multipartData,
        {
          idempotencyKey,
          onProgress: (progressEvent) => {
            setUploadProgress(progressEvent.percentage)
            console.log(`Upload progress: ${progressEvent.percentage}%`)
          }
        }
      )

      // Check response format
      if (!isSuccessResponse(response)) {
        // Backend error
        const errorMessage = extractErrorMessage(response)

        console.error('Backend error:', errorMessage)
        saveIdempotencyRecord(idempotencyKey, 'failed')

        addValidationError('submit', errorMessage)
        setIsSubmitting(false)
        setShowProgress(false)
        return
      }

      // Handle backend success response safely
      const data = response?.data ?? response ?? null

      if (!data || !data.team_id) {
        console.error('Invalid backend response:', response)
        addValidationError('submit', 'Server error: Missing team ID')
        setIsSubmitting(false)
        setShowProgress(false)
        return
      }

      setRegisteredTeamId(data.team_id)

      // Save to localStorage
      saveIdempotencyRecord(idempotencyKey, 'success', data.team_id)
      saveLastSubmission(data.team_id, formData.teamName, idempotencyKey)

      console.log('✅ Registration successful:', data.team_id)

      setShowProgress(false)
      setShowSuccess(true)
      
      // 🎉 Trigger confetti celebration
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
        // Second burst
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
          })
        }, 200)
        // Third burst
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
          })
        }, 400)
      }, 300)
    } catch (error) {
      console.error('❌ Submit error:', error)

      const errorMessage = handleAxiosError(error)
      addValidationError('submit', errorMessage)

      saveIdempotencyRecord(currentIdempotencyKey, 'failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ========== SUCCESS HANDLERS ==========
  const copyTeamId = () => {
    navigator.clipboard.writeText(registeredTeamId)
    alert('Team ID copied to clipboard!')
  }

  const closeSuccess = () => {
    setShowSuccess(false)
    setCurrentStep(0)
    // Reset form
    setFormData({
      churchName: '',
      teamName: '',
      pastorLetter: null,
      groupPhoto: null,
      captain: { name: '', phone: '', whatsapp: '', email: '' },
      viceCaptain: { name: '', phone: '', whatsapp: '', email: '' },
      players: Array.from({ length: 11 }).map(() => emptyPlayer()),
      paymentReceipt: null,
    })
    setAcceptTerms(false)
    removeIdempotencyRecord(currentIdempotencyKey)
  }

  // ========== RENDER ==========
  
  // Show coming soon message if flag is true
  if (REGISTRATION_CLOSED) {
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
              Opening Soon
            </p>
          </motion.div>

          {/* Coming Soon Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl p-12 md:p-16 text-center border-2 border-accent/40 shadow-2xl shadow-accent/30 bg-gradient-to-br from-accent/20 via-accent/10 to-transparent backdrop-blur-xl glass-effect"
          >
            {/* Animated Icon */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="mb-8"
            >
              <div className="inline-block">
                <div className="text-6xl md:text-8xl font-heading text-accent mb-6">⏳</div>
              </div>
            </motion.div>

            {/* Main Message */}
            <h2 className="font-heading text-4xl md:text-5xl text-accent mb-6">
              Registration Coming Soon
            </h2>
            
            <p className="font-body text-lg md:text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto">
              Team registration for ICCT26 Cricket Tournament will open soon. Stay tuned for updates on registration dates, deadlines, and guidelines!
            </p>

            {/* Tournament Info Box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <div className="rounded-xl px-8 py-4 border-2 border-accent/60 bg-accent/10 backdrop-blur-lg shadow-lg shadow-accent/20 glass-effect hover:shadow-xl transition-all">
                <p className="font-subheading font-bold text-accent">🏏 Registration Date 25/12/2025</p>
              </div>
            </motion.div>

            {/* Follow Updates */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="font-body text-gray-400 text-sm md:text-base mt-12"
            >
              Follow us on social media for latest announcements and updates
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    )
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
                  {currentStep > step.number ? <CheckCircle className="w-6 h-6" /> : step.number}
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
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-6 md:p-8"
          >
            {/* Upload Progress Bar */}
            {showProgress && (
              <DetailedProgressBar
                progress={uploadProgress}
                isVisible={showProgress}
                className="mb-6"
              />
            )}

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
                        Ensure all the details you filled is correct & it must be matches with
                        your Photo, Subscription card & Aadhaar Card details, after that your
                        team will be qualify for registration.
                      </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className="font-heading text-xl text-blue-800 mb-4">
                        1. Team Registration
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-blue-700">
                        <li>Only one team is allowed to represent a single church.</li>
                        <li>
                          The first 16 teams that complete their registration with the required
                          documents will be eligible to participate.
                        </li>
                      </ul>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h3 className="font-heading text-xl text-green-800 mb-4">
                        2. Documents Required
                      </h3>
                      <p className="text-green-700 mb-3">To register, each team must submit the following:</p>
                      <ul className="list-disc list-inside space-y-2 text-green-700">
                        <li>Passport-sized photo of each player.</li>
                        <li>Subscription card.</li>
                        <li>Aadhar card.</li>
                      </ul>
                      <p className="text-green-800 font-semibold mt-3">
                        Note: Each document must be submitted as a separate IMAGE (jpg) file,
                        labeled with the respective player's name.
                      </p>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                      <h3 className="font-heading text-xl text-purple-800 mb-4">
                        3. Umpire's Decision
                      </h3>
                      <p className="text-purple-700">
                        The umpire's decision is final and binding on all teams.
                      </p>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                      <h3 className="font-heading text-xl text-orange-800 mb-4">
                        4. Power-Play Rules
                      </h3>
                      <p className="text-orange-700 mb-3">It's a 10 overs match.</p>
                      <div className="space-y-3">
                        <div>
                          <p className="font-semibold text-orange-800">First Power-Play: Overs 1-2</p>
                          <p className="text-orange-700">
                            Only two fielders are allowed outside the 30-yard circle.
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-orange-800">
                            Second Power-Play: Can be taken in any one of the 6th, 7th, or 8th over.
                          </p>
                          <p className="text-orange-700">
                            Only five fielders are allowed outside the 30-yard circle during this
                            period.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h3 className="font-heading text-xl text-red-800 mb-4">
                        5. Bowling Restrictions
                      </h3>
                      <p className="text-red-700">
                        Only One bowler is allowed to bowl a maximum of 3 overs.
                      </p>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                      <h3 className="font-heading text-xl text-indigo-800 mb-4">
                        6. Tie-Breaker Rule
                      </h3>
                      <p className="text-indigo-700">
                        In the event of a tie, a super over will be provided.
                      </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className="font-heading text-xl text-blue-800 mb-4">
                        7. Important Notice to all Teams:
                      </h3>
                      <ul className="list-disc list-inside space-y-3 text-blue-700">
                        <li>Main 11 players need to be submit all the above required details.</li>
                        <li>
                          If your team has only main 11 players you don't need to fill the last 4
                          players details.
                        </li>
                        <li>
                          While match you cannot change over the substitute if you submit only main
                          11 players.
                        </li>
                        <li>
                          If the player name is submitted without the required details that
                          application is not accepted even you get the registration successful.
                        </li>
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
                        I have read and understood all the rules and regulations. I agree to abide
                        by these terms and conditions.
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
                  <h3 className="font-heading text-3xl text-primary mb-6">Team Information</h3>
                  <div className="space-y-6">
                    <SearchableSelect
                      options={CHURCH_NAMES}
                      value={formData.churchName}
                      onChange={(value) => {
                        clearValidationErrors()
                        setFormData({ ...formData, churchName: value })
                      }}
                      label="Church Name"
                      placeholder="Search and select your church..."
                      disabled={isSubmitting}
                      required
                    />

                    <div>
                      <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">
                        Team Name *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 input-focus text-gray-900 bg-white"
                        placeholder="Enter team name (3-80 characters)"
                        value={formData.teamName}
                        onChange={(e) => {
                          clearValidationErrors()
                          setFormData({ ...formData, teamName: e.target.value })
                        }}
                        disabled={isSubmitting}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">
                        Church Letter * (PDF/Image, max 5MB)
                      </label>
                      <div>
                        <FileUpload
                          file={formData.pastorLetter}
                          onFileChange={handlePastorLetterChange}
                          accept=".jpg,.jpeg,.png,.pdf"
                          placeholder="Upload Church Letter"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">
                        Team Group Photo * (Image only, max 5MB)
                      </label>
                      <p className="text-xs text-gray-500 mb-2">
                        Upload a group photo of your team (JPEG or PNG)
                      </p>
                      <div>
                        <FileUpload
                          file={formData.groupPhoto}
                          onFileChange={handleGroupPhotoChange}
                          accept=".jpg,.jpeg,.png"
                          placeholder="Upload Team Photo"
                        />
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
                  <h3 className="font-heading text-3xl text-primary mb-6">
                    Captain & Vice-Captain
                  </h3>
                  <div className="space-y-8">
                    <div className="bg-blue-50 rounded-xl p-6">
                      <h4 className="font-subheading font-bold text-primary text-xl mb-4">
                        Captain Details
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 input-focus text-gray-900 bg-white"
                            placeholder="Captain's name"
                            value={formData.captain.name}
                            onChange={(e) => {
                              clearValidationErrors()
                              setFormData({
                                ...formData,
                                captain: { ...formData.captain, name: e.target.value }
                              })
                            }}
                            disabled={isSubmitting}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">
                              Phone Number (10 digits) *
                            </label>
                            <input
                              type="tel"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={10}
                              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 input-focus text-gray-900 bg-white"
                              placeholder="Enter 10-digit number"
                              value={formData.captain.phone}
                              onChange={(e) => {
                                clearValidationErrors()
                                const value = e.target.value.replace(/[^0-9]/g, '')
                                setFormData({
                                  ...formData,
                                  captain: { ...formData.captain, phone: value }
                                })
                              }}
                              disabled={isSubmitting}
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">
                              WhatsApp Number (10 digits) *
                            </label>
                            <input
                              type="tel"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={10}
                              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 input-focus text-gray-900 bg-white"
                              placeholder="Enter 10-digit number"
                              value={formData.captain.whatsapp}
                              onChange={(e) => {
                                clearValidationErrors()
                                const value = e.target.value.replace(/[^0-9]/g, '')
                                setFormData({
                                  ...formData,
                                  captain: { ...formData.captain, whatsapp: value }
                                })
                              }}
                              disabled={isSubmitting}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 input-focus text-gray-900 bg-white"
                            placeholder="email@example.com"
                            value={formData.captain.email}
                            onChange={(e) => {
                              clearValidationErrors()
                              setFormData({
                                ...formData,
                                captain: { ...formData.captain, email: e.target.value }
                              })
                            }}
                            disabled={isSubmitting}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-xl p-6">
                      <h4 className="font-subheading font-bold text-green-700 text-xl mb-4">
                        Vice-Captain Details
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 input-focus text-gray-900 bg-white"
                            placeholder="Vice-Captain's name"
                            value={formData.viceCaptain.name}
                            onChange={(e) => {
                              clearValidationErrors()
                              setFormData({
                                ...formData,
                                viceCaptain: { ...formData.viceCaptain, name: e.target.value }
                              })
                            }}
                            disabled={isSubmitting}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">
                              Phone Number (10 digits) *
                            </label>
                            <input
                              type="tel"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={10}
                              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 input-focus text-gray-900 bg-white"
                              placeholder="Enter 10-digit number"
                              value={formData.viceCaptain.phone}
                              onChange={(e) => {
                                clearValidationErrors()
                                const value = e.target.value.replace(/[^0-9]/g, '')
                                setFormData({
                                  ...formData,
                                  viceCaptain: { ...formData.viceCaptain, phone: value }
                                })
                              }}
                              disabled={isSubmitting}
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">
                              WhatsApp Number (10 digits) *
                            </label>
                            <input
                              type="tel"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={10}
                              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 input-focus text-gray-900 bg-white"
                              placeholder="Enter 10-digit number"
                              value={formData.viceCaptain.whatsapp}
                              onChange={(e) => {
                                clearValidationErrors()
                                const value = e.target.value.replace(/[^0-9]/g, '')
                                setFormData({
                                  ...formData,
                                  viceCaptain: { ...formData.viceCaptain, whatsapp: value }
                                })
                              }}
                              disabled={isSubmitting}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 input-focus text-gray-900 bg-white"
                            placeholder="email@example.com"
                            value={formData.viceCaptain.email}
                            onChange={(e) => {
                              clearValidationErrors()
                              setFormData({
                                ...formData,
                                viceCaptain: { ...formData.viceCaptain, email: e.target.value }
                              })
                            }}
                            disabled={isSubmitting}
                            required
                          />
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
                    <h3 className="font-heading text-3xl text-primary mb-2">Player Details</h3>
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
                        onRemove={
                          index === formData.players.length - 1 && formData.players.length > 11
                            ? removeLastPlayer
                            : undefined
                        }
                        canRemove={
                          index === formData.players.length - 1 && formData.players.length > 11
                        }
                      />
                    ))}
                  </div>

                  {formData.players.length < 15 && (
                    <button
                      onClick={addPlayer}
                      disabled={isSubmitting}
                      className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary hover:shadow-lg hover:shadow-primary/50 text-white font-subheading font-semibold rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-5 h-5" />
                      Add Player
                    </button>
                  )}
                </motion.div>
              )}

              {/* Step 4: Review Information */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-heading text-3xl text-primary mb-6">Review Information</h3>
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
                  <h3 className="font-heading text-3xl text-primary mb-6">Payment Upload</h3>
                  <div className="space-y-6">
                    <div className="bg-blue-50 border-l-4 border-primary p-4 rounded">
                      <p className="font-subheading text-primary font-semibold mb-2">
                        Registration Fee: ₹2,000
                      </p>
                      <p className="text-sm text-gray-700">Scan the QR code below to make payment</p>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-white p-4 rounded-xl shadow-lg mb-4 border-2 border-primary">
                        <img
                          src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=sanjaynesan007@oksbi&pn=ICCT26&am=2000&tn=ICCT26%20Registration%20Fee"
                          alt="Payment QR Code"
                          className="w-64 h-64 object-cover rounded-lg"
                        />
                      </div>
                      <p className="text-center font-subheading text-gray-600 mb-4">
                        Scan with any UPI app to pay ₹2,000
                      </p>
                      <a
                        href="upi://pay?pa=sanjaynesan007@oksbi&pn=ICCT26&am=2000&tn=ICCT26%20Registration%20Fee"
                        className="text-lg font-semibold text-primary hover:text-blue-700 transition-colors"
                      >
                        Click to Pay
                      </a>
                    </div>

                    <div>
                      <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">
                        Upload Payment Receipt * (Required)
                      </label>
                      <div>
                        <FileUpload
                          file={formData.paymentReceipt}
                          onFileChange={handleFileChange}
                          accept=".jpg,.jpeg,.png,.pdf"
                          placeholder="Upload Receipt"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Validation Errors Display */}
            {validationErrors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg max-h-64 overflow-y-auto"
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h4 className="text-red-700 font-semibold">Please fix the following errors:</h4>
                </div>
                <ul className="space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-red-600 text-sm">
                      • {error.error}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0 || isSubmitting}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-subheading font-semibold transition-all ${
                  currentStep === 0 || isSubmitting
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
                className={`flex items-center gap-2 btn-gold ${
                  isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2 text-black">
                    <svg
                      className="w-4 h-4 animate-spin text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Submitting...
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

      {/* Document Confirmation Modal */}
      <AnimatePresence>
        {showDocumentConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-3 py-4 overflow-y-auto"
            onClick={() => setShowDocumentConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="glass-card rounded-xl md:rounded-2xl p-4 md:p-6 max-w-lg w-full relative my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Warning Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-14 h-14 md:w-18 md:h-18 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-xl"
              >
                <AlertTriangle className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-heading text-xl md:text-2xl text-red-600 mb-2 md:mb-3 text-center"
              >
                Document Authenticity
              </motion.h2>

              {/* Main Warning Content */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-2 md:space-y-3 mb-4 md:mb-6 max-h-80 overflow-y-auto"
              >
                {/* Warning Box */}
                <div className="bg-red-50 border-2 border-red-400 rounded-lg p-3 md:p-4">
                  <p className="text-red-800 font-semibold text-xs md:text-sm mb-1 md:mb-2">⚠️ IMPORTANT</p>
                  <p className="text-red-700 text-xs leading-relaxed mb-1">
                    All documents must be:
                  </p>
                  <ul className="list-disc list-inside space-y-0.5 text-red-700 text-xs">
                    <li><strong>Original & genuine</strong></li>
                    <li><strong>Valid & current</strong></li>
                    <li><strong>Relevant</strong></li>
                    <li><strong>Clear & legible</strong></li>
                  </ul>
                </div>

                {/* Disqualification Warning */}
                <div className="bg-yellow-50 border-2 border-yellow-600 rounded-lg p-3 md:p-4">
                  <p className="text-yellow-800 font-bold text-xs md:text-sm mb-1">🚫 DISQUALIFICATION</p>
                  <p className="text-yellow-900 text-xs leading-relaxed">
                    Fake documents = <strong>immediate disqualification & NO REFUND</strong>.
                  </p>
                </div>

                {/* Verification Commitment */}
                <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-3 md:p-4">
                  <p className="text-blue-800 font-semibold text-xs md:text-sm mb-1">✓ COMMITMENT</p>
                  <p className="text-blue-700 text-xs leading-relaxed">
                    I will upload only <strong>authentic</strong> documents and accept full responsibility.
                  </p>
                </div>
              </motion.div>

              {/* Confirmation Checkbox */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-4 md:mb-5 flex items-start gap-2 p-2 md:p-3 bg-accent/15 rounded-lg border-2 border-accent/40"
              >
                <input
                  type="checkbox"
                  id="documentConfirm"
                  checked={documentConfirmed}
                  onChange={(e) => setDocumentConfirmed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-green-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-green-500 cursor-pointer flex-shrink-0"
                />
                <label htmlFor="documentConfirm" className="text-gray-800 font-medium cursor-pointer flex-1 text-xs leading-tight">
                  I confirm documents will be <span className="text-red-600">genuine</span>. Fake documents = <span className="text-red-600">disqualification</span>.
                </label>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex gap-2 md:gap-3"
              >
                <button
                  onClick={() => {
                    setShowDocumentConfirmation(false)
                    setDocumentConfirmed(false)
                  }}
                  className="flex-1 px-3 md:px-5 py-2 rounded-lg font-subheading font-semibold text-xs bg-gray-300 text-gray-700 hover:bg-gray-400 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDocumentConfirmation(false)
                    setCurrentStep(1)
                  }}
                  disabled={!documentConfirmed}
                  className={`flex-1 px-3 md:px-5 py-2 rounded-lg font-subheading font-semibold text-xs transition-all duration-300 ${
                    documentConfirmed
                      ? 'bg-gradient-gold text-black hover:shadow-lg hover:shadow-accent/50 cursor-pointer'
                      : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50'
                  }`}
                >
                  Approve
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="glass-card rounded-2xl p-8 max-w-lg w-full text-center relative overflow-hidden"
            >
              {/* Animated background elements */}
              <motion.div
                className="absolute top-0 left-0 w-full h-full"
                animate={{
                  background: [
                    'radial-gradient(circle at 20% 30%, rgba(255, 204, 41, 0.15) 0%, transparent 50%)',
                    'radial-gradient(circle at 80% 70%, rgba(255, 204, 41, 0.15) 0%, transparent 50%)',
                    'radial-gradient(circle at 20% 30%, rgba(255, 204, 41, 0.15) 0%, transparent 50%)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
              
              {/* Success icon with animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl relative"
              >
                <CheckCircle className="w-14 h-14 text-white" />
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-green-400"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              
              {/* Sparkles decoration */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-2 mb-4"
              >
                <Sparkles className="w-5 h-5 text-accent" />
                <Sparkles className="w-4 h-4 text-accent" />
                <Sparkles className="w-5 h-5 text-accent" />
              </motion.div>
              
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-heading text-5xl text-primary mb-3 tracking-wide"
              >
                WELCOME TO
              </motion.h2>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="font-heading text-6xl bg-gradient-to-r from-accent via-yellow-500 to-accent bg-clip-text text-transparent mb-6 tracking-wider"
                style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                ICCT 2026
              </motion.div>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="font-subheading text-lg text-gray-700 mb-8"
              >
                🎉 Your team has been successfully registered! 🏏
              </motion.p>

              {/* Team ID Display with Copy Button */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-accent/30 via-accent/40 to-accent/30 rounded-xl p-6 mb-6 border-2 border-accent/50 shadow-lg"
              >
                <p className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Your Team ID</p>
                <div className="flex items-center justify-center gap-3">
                  <motion.p
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: 'spring' }}
                    className="font-heading text-5xl text-primary tracking-wider"
                  >
                    {registeredTeamId}
                  </motion.p>
                  <motion.button
                    onClick={copyTeamId}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-md"
                    title="Copy Team ID"
                  >
                    <Copy className="w-5 h-5 text-accent" />
                  </motion.button>
                </div>
                <p className="text-xs text-gray-600 mt-3 italic">Save this ID for future reference</p>
              </motion.div>

              {/* Confirmation Message */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mb-6 p-4 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 border border-green-200"
              >
                <p className="text-sm text-gray-700 font-medium">
                  ✅ Your registration is confirmed!<br/>
                  <span className="text-xs text-gray-600 mt-1 inline-block">We look forward to seeing you at the tournament!</span>
                </p>
              </motion.div>

              <motion.button
                onClick={closeSuccess}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="btn-gold w-full text-lg py-4 shadow-lg"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Registration
