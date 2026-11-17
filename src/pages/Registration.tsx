/**
 * ICCT27 Production-Grade Registration Component
 * Full client validation, idempotency, retry logic, progress bars, error handling
 * Created: November 17, 2025 | Consolidated: November 18, 2025
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  AlertTriangle,
  ArrowRight,
  Copy,
  Clock,
  Mail,
  QrCode,
  Send,
  ShieldCheck,
} from 'lucide-react'
import confetti from 'canvas-confetti'
import FileUpload from '../components/FileUpload'
import PlayerFormCard from '../components/PlayerFormCard'
import { PageHero } from '../components/ui'
import { SearchableSelect } from '../components/SearchableSelect'
import { fetchChurchAvailability, isChurchLocked, type ChurchAvailability } from '../utils/churchAvailability'
import SEO from '../components/SEO'
import { REGISTRATION_CONFIG } from '../data/registration'
import { KEY_RULES } from '../data/rules'
import { warmUpBackend, ensureBackendAwake, useBackendStatus } from '../utils/backendWarmup'

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
  extractErrorCode,
  isSuccessResponse,
  handleAxiosError,
  BackendResponse
} from '../utils/apiClient'
import Portal from '../components/Portal'
import TearTicket from '../components/TearTicket'

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
}

interface FormData {
  churchName: string
  teamName: string
  captain: CaptainInfo
  viceCaptain: CaptainInfo
  players: PlayerData[]
  paymentReceipt: File | null
}

interface RegistrationResponse {
  registration_status: 'pending' | 'confirmed' | 'rejected'
  team_id: string
  team_name: string
}

// ============================================================================
// CONSTANTS
// ============================================================================

// Set to true to close/lock registration
const REGISTRATION_CLOSED = true

const MIN_PLAYERS = REGISTRATION_CONFIG.minPlayers
const MAX_PLAYERS = REGISTRATION_CONFIG.maxPlayers

// Backend error_code when the church already has its one team
const CHURCH_ALREADY_REGISTERED = 'CHURCH_ALREADY_REGISTERED'


const CHURCH_NAMES = [
  "CSI St Peters Church Rathinapuri",
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
  const [registeredStatus, setRegisteredStatus] = useState<string>('pending')
  const [ticketTorn, setTicketTorn] = useState(false)
  const [idCopied, setIdCopied] = useState(false)
  
  // ========== CHURCH AVAILABILITY STATE ==========
  const [churchAvailability, setChurchAvailability] = useState<ChurchAvailability[] | undefined>()
  const [loadingChurches, setLoadingChurches] = useState(true)
  const [, setChurchLimitError] = useState('')

  const emptyPlayer = (): PlayerData => ({
    name: '',
  })

  const [formData, setFormData] = useState<FormData>({
    churchName: '',
    teamName: '',
    captain: { name: '', phone: '', whatsapp: '', email: '' },
    viceCaptain: { name: '', phone: '', whatsapp: '', email: '' },
    players: Array.from({ length: MIN_PLAYERS }).map(() => emptyPlayer()),
    paymentReceipt: null,
  })

  // ========== BACKEND WARM-UP ==========
  const backendStatus = useBackendStatus()
  const [waitingForServer, setWaitingForServer] = useState(false)

  // Re-ping on open: the user may have sat on another page long enough for it to sleep again
  useEffect(() => {
    void warmUpBackend()
  }, [])

  // ========== INITIALIZATION ==========
  useEffect(() => {
    initializeIdempotency()

    // Check for last successful submission
    const lastSubmission = getLastSubmission()
    if (lastSubmission) {
      console.log('Last submission found:', lastSubmission)
    }
  }, [])

  // ========== FETCH CHURCH AVAILABILITY ==========
  useEffect(() => {
    const loadChurchAvailability = async () => {
      setLoadingChurches(true)
      const data = await fetchChurchAvailability()
      if (data) {
        setChurchAvailability(data.churches)
      }
      setLoadingChurches(false)
    }

    loadChurchAvailability()
  }, [])

  // ========== SCROLL TO TOP ON STEP CHANGE ==========
  // Without this, moving from the long Players step lands the user mid-page
  // (e.g. straight on the payment QR) instead of the top of the new step.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep])

  // ========== UTILITIES ==========
  const totalSteps = 4
  const progress = ((currentStep + 1) / totalSteps) * 100

  const steps = [
    { number: 1, title: 'Team' },
    { number: 2, title: 'Captain & Vice-Captain' },
    { number: 3, title: 'Players' },
    { number: 4, title: 'Review, Payment & Submit' },
  ]

  const clearValidationErrors = () => setValidationErrors([])

  const addValidationError = (field: string, error: string) => {
    setValidationErrors((prev: FieldError[]) => [...prev, { field, error }])
  }

  // ========== VALIDATION ==========
  const validateCurrentStep = (): boolean => {
    clearValidationErrors()

    switch (currentStep) {
      case 0: { // Team Details
        let hasErrors = false

        if (!acceptTerms) {
          addValidationError('terms', 'Please accept the tournament rules and regulations to proceed.')
          hasErrors = true
        }

        if (!formData.churchName.trim()) {
          addValidationError('churchName', VALIDATION_MESSAGES.CHURCH_NAME_REQUIRED)
          hasErrors = true
        } else {
          // Check if selected church is locked (at capacity)
          if (isChurchLocked(formData.churchName, churchAvailability)) {
            addValidationError('churchName', 'This church already has its one allowed entry. Please select a different church.')
            setChurchLimitError(`${formData.churchName} already has its one allowed entry. Please select a different church.`)
            hasErrors = true
          }
        }

        const teamNameValidation = isValidTeamName(formData.teamName)
        if (!teamNameValidation.isValid) {
          addValidationError('teamName', teamNameValidation.error!)
          hasErrors = true
        }

        return !hasErrors
      }

      case 1: { // Captain & Vice-Captain
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

      case 2: { // Players
        let hasErrors = false

        if (formData.players.length < MIN_PLAYERS) {
          addValidationError('players', `At least ${MIN_PLAYERS} players are required`)
          hasErrors = true
        }

        if (formData.players.length > MAX_PLAYERS) {
          addValidationError('players', `Maximum ${MAX_PLAYERS} players allowed`)
          hasErrors = true
        }

        formData.players.forEach((player: PlayerData, index: number) => {
          const playerNameValidation = isValidName(player.name)
          if (!playerNameValidation.isValid) {
            addValidationError(`player_${index}_name`, `Player ${index + 1}: ${playerNameValidation.error}`)
            hasErrors = true
          }

        })

        return !hasErrors
      }

      case 3: { // Review and payment
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

    if (!validateCurrentStep()) {
      return
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
    if (formData.players.length < MAX_PLAYERS) {
      setFormData({ ...formData, players: [...formData.players, emptyPlayer()] })
    }
  }

  const removeLastPlayer = () => {
    if (formData.players.length > MIN_PLAYERS) {
      setFormData({ ...formData, players: formData.players.slice(0, -1) })
    }
  }

  // ========== FILE HANDLERS ==========
  const handleFileChange = (file: File | null) => {
    clearValidationErrors()
    setFormData({ ...formData, paymentReceipt: file })
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
      paymentReceipt: formData.paymentReceipt,
      players: formData.players
    })

    if (validationResult.length > 0) {
      setValidationErrors(validationResult)
      // Jump to the earliest step that contains an error (was hard-coded to step 2)
      const stepForField = (field: string): number => {
        if (field === 'churchName' || field === 'teamName' || field === 'terms') return 0
        if (field.startsWith('captain') || field.startsWith('vice')) return 1
        if (field === 'players' || field.startsWith('player_')) return 2
        return 3 // paymentReceipt and anything else on the review step
      }
      setCurrentStep(Math.min(...validationResult.map((e) => stepForField(e.field))))
      return
    }

    // Make sure the backend is awake before sending (it may still be booting)
    setIsSubmitting(true)
    setWaitingForServer(true)
    const serverReady = await ensureBackendAwake()
    setWaitingForServer(false)
    if (!serverReady) {
      setIsSubmitting(false)
      addValidationError(
        'submit',
        'The registration server is not responding right now. Your details are still here — please wait a minute and press Submit again.'
      )
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

      const sanitizedPaymentReceipt = new File(
        [formData.paymentReceipt!],
        sanitizeFilename(formData.paymentReceipt!.name),
        { type: formData.paymentReceipt!.type }
      )
      multipartData.append('payment_receipt', sanitizedPaymentReceipt)

      // Players (FLATTENED)
      formData.players.forEach((p: PlayerData, index: number) => {
        multipartData.append(`player_${index}_name`, p.name.trim())
      })

      console.log('📤 Submitting with idempotency key:', idempotencyKey)
      console.log('📦 Total files: 1')

      // 🔍 DEBUG: Log all FormData entries
      console.log('🔍 === COMPLETE FORMDATA DEBUG ===')
      for (const [key, value] of multipartData.entries()) {
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
        const errorCode = extractErrorCode(response)

        console.error('Backend error:', errorCode, errorMessage)
        saveIdempotencyRecord(idempotencyKey, 'failed')

        // Church already has its team (error_code first; message check kept for older backends)
        if (
          errorCode === CHURCH_ALREADY_REGISTERED ||
          errorMessage.toLowerCase().includes('one allowed entry')
        ) {
          setChurchLimitError(
            `${formData.churchName} already has its one allowed entry. Please select a different church.`
          )
          // Refresh church availability
          const data = await fetchChurchAvailability()
          if (data) {
            setChurchAvailability(data.churches)
          }
        }

        addValidationError('submit', errorMessage)
        setIsSubmitting(false)
        setShowProgress(false)
        return
      }

      // Handle backend success response safely
      const data = response.data ?? null

      if (!data) {
        console.error('Invalid backend response:', response)
        addValidationError('submit', 'Server error: Invalid response from server')
        setIsSubmitting(false)
        setShowProgress(false)
        return
      }

      const raw = data as RegistrationResponse & { teamId?: string; status?: string }
      const registrationStatus = raw.registration_status || raw.status || 'pending'
      const teamId = raw.team_id || raw.teamId || 'PENDING'

      setRegisteredTeamId(teamId)
      setRegisteredStatus(registrationStatus)

      // Save to localStorage
      saveIdempotencyRecord(idempotencyKey, 'success', teamId)
      saveLastSubmission(teamId, formData.teamName, idempotencyKey)

      console.log('✅ Registration submitted successfully. Status:', registrationStatus)

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

      saveIdempotencyRecord(idempotencyKey, 'failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ========== SUCCESS HANDLERS ==========
  const closeSuccess = () => {
    setShowSuccess(false)
    setTicketTorn(false)
    setIdCopied(false)
    setCurrentStep(0)
    // Reset form
    setFormData({
      churchName: '',
      teamName: '',
      captain: { name: '', phone: '', whatsapp: '', email: '' },
      viceCaptain: { name: '', phone: '', whatsapp: '', email: '' },
      players: Array.from({ length: MIN_PLAYERS }).map(() => emptyPlayer()),
      paymentReceipt: null,
    })
    setAcceptTerms(false)
    removeIdempotencyRecord(currentIdempotencyKey)
  }

  // ========== RENDER ==========

  const inputClass =
    'w-full rounded-xl border border-surface-line bg-white px-4 py-3 text-ink placeholder:text-muted-dark/70 input-focus disabled:bg-surface disabled:opacity-70'
  const labelClass = 'mb-1.5 block text-sm font-semibold text-ink'

  // Captain / vice-captain contact block (same fields, same rules)
  const renderContactFields = (role: 'captain' | 'viceCaptain') => {
    const person = formData[role]
    const update = (patch: Partial<CaptainInfo>) => {
      clearValidationErrors()
      setFormData({ ...formData, [role]: { ...person, ...patch } })
    }
    const id = (field: string) => `${role}-${field}`
    const who = role === 'captain' ? "Captain's" : "Vice-Captain's"

    return (
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor={id('name')} className={labelClass}>Full name *</label>
          <input
            id={id('name')}
            type="text"
            className={inputClass}
            placeholder={`${who} name`}
            value={person.name}
            onChange={(e) => update({ name: e.target.value })}
            disabled={isSubmitting}
            required
          />
        </div>
        <div>
          <label htmlFor={id('phone')} className={labelClass}>Phone number *</label>
          <input
            id={id('phone')}
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
            className={inputClass}
            placeholder="10-digit number"
            value={person.phone}
            onChange={(e) => update({ phone: e.target.value.replace(/[^0-9]/g, '') })}
            disabled={isSubmitting}
            required
          />
        </div>
        <div>
          <label htmlFor={id('whatsapp')} className={labelClass}>WhatsApp number *</label>
          <input
            id={id('whatsapp')}
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
            className={inputClass}
            placeholder="10-digit number"
            value={person.whatsapp}
            onChange={(e) => update({ whatsapp: e.target.value.replace(/[^0-9]/g, '') })}
            disabled={isSubmitting}
            required
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor={id('email')} className={labelClass}>Email *</label>
          <input
            id={id('email')}
            type="email"
            className={inputClass}
            placeholder="email@example.com"
            value={person.email}
            onChange={(e) => update({ email: e.target.value })}
            disabled={isSubmitting}
            required
          />
        </div>
      </div>
    )
  }

  const stepMotion = {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -24 },
    transition: { duration: 0.25 },
  }

  // Registration not yet open view (shown while REGISTRATION_CLOSED is true)
  if (REGISTRATION_CLOSED) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <SEO title="Team Registration" description="Registration for ICCT'27 opens soon." />
        <PageHero eyebrow="Registration" title="Opening soon" />
        <section className="bg-surface py-16 text-ink">
          <div className="page-container max-w-2xl">
            <div className="card-light flex flex-col items-center p-10 text-center">
              <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-ink text-gold">
                <Clock className="h-8 w-8" />
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-gold animate-live-dot" aria-hidden />
              </span>
              <p className="mt-6 text-eyebrow uppercase text-flame">ICCT'27 · Season 4</p>
              <h2 className="mt-2 text-4xl text-ink">Registration opens soon</h2>
              <p className="mt-3 max-w-md text-muted-dark">
                Team registration for ICCT'27 is getting ready. Please wait — we'll announce the opening on our social channels,
                and this page will open for entries right here.
              </p>
              <Link to="/rules" className="mt-8 inline-flex items-center gap-1.5 text-sm font-bold text-ink hover:text-flame">
                Meanwhile, read the rules <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SEO title="Team Registration" description="Register your team for ICCT'27." />

      <PageHero
        eyebrow={`Season 4 · Entry ₹2,027 per team`}
        title="Register your team"
        description="Four short steps — team, leaders, players, then review & pay. Takes about 5 minutes."
      >
        {/* Server connection status (backend may be waking from sleep) */}
        {backendStatus !== 'awake' && backendStatus !== 'idle' && (
          <div
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-left text-sm font-semibold sm:rounded-full ${
              backendStatus === 'waking'
                ? 'border-gold/40 bg-gold/10 text-gold'
                : 'border-flame/40 bg-flame/10 text-flame-light'
            }`}
            role="status"
          >
            {backendStatus === 'waking' ? (
              <>
                <span className="h-2 w-2 rounded-full bg-gold animate-live-dot" />
                Connecting to server… you can keep filling the form
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-flame-light" />
                Server not reachable yet.
                <button type="button" onClick={() => void warmUpBackend()} className="underline hover:text-white">
                  Retry
                </button>
              </>
            )}
          </div>
        )}
      </PageHero>

      <section className="bg-surface py-10 text-ink md:py-14">
        <div className="page-container max-w-3xl">
          {/* ===== Stepper ===== */}
          <div className="mb-6">
            <ol className="hidden items-center sm:flex">
              {steps.map((step, i) => {
                const done = currentStep > i
                const active = currentStep === i
                return (
                  <li key={step.number} className={`flex items-center ${i < steps.length - 1 ? 'flex-1' : ''}`}>
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                          done
                            ? 'bg-pitch text-white'
                            : active
                              ? 'bg-ink text-gold ring-4 ring-gold/30'
                              : 'border-2 border-surface-line bg-white text-muted-dark'
                        }`}
                      >
                        {done ? <Check className="h-4 w-4" strokeWidth={3} /> : step.number}
                      </span>
                      <span className={`text-sm font-semibold ${active ? 'text-ink' : 'text-muted-dark'}`}>{step.title}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <span className={`mx-3 h-0.5 flex-1 rounded-full ${done ? 'bg-pitch' : 'bg-surface-line'}`} />
                    )}
                  </li>
                )
              })}
            </ol>

            {/* Mobile: compact label + bar */}
            <div className="sm:hidden">
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-sm font-bold text-ink">{steps[currentStep].title}</span>
                <span className="text-xs font-semibold text-muted-dark">
                  Step {currentStep + 1} of {totalSteps}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface-line">
                <motion.div className="h-full rounded-full bg-gold" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
              </div>
            </div>
          </div>

          {/* ===== Form card ===== */}
          <div className="card-light p-5 md:p-8">
            {/* Upload progress */}
            {showProgress && (
              <div className="mb-6 rounded-xl border border-surface-line bg-surface p-4">
                <div className="mb-2 flex justify-between text-sm font-semibold">
                  <span>{uploadProgress >= 100 ? 'Upload complete — finishing up…' : 'Uploading your registration…'}</span>
                  <span className="text-ink">{uploadProgress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-line">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${uploadProgress >= 100 ? 'bg-pitch' : 'bg-gold'}`}
                    style={{ width: `${Math.min(100, uploadProgress)}%` }}
                  />
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {/* ---------- Step 1: Team ---------- */}
              {currentStep === 0 && (
                <motion.div key="step1" {...stepMotion}>
                  <h2 className="text-3xl text-ink md:text-4xl">Team information</h2>
                  <p className="mt-1 text-sm text-muted-dark">One team per church. Pick your church and name your team.</p>

                  <div className="mt-6 space-y-5">
                    <SearchableSelect
                      options={CHURCH_NAMES}
                      value={formData.churchName}
                      onChange={(value) => {
                        clearValidationErrors()
                        setChurchLimitError('')
                        setFormData({ ...formData, churchName: value })
                      }}
                      label="Church name"
                      placeholder="Search and select your church..."
                      disabled={isSubmitting || loadingChurches}
                      disabledOptions={churchAvailability?.filter((c) => c.locked).map((c) => c.church_name) || []}
                      optionCapacities={
                        churchAvailability?.reduce((acc, church) => {
                          acc[church.church_name] = `${church.team_count}/1`
                          return acc
                        }, {} as Record<string, string>) || {}
                      }
                      required
                    />

                    <div>
                      <label htmlFor="teamName" className={labelClass}>Team name *</label>
                      <input
                        id="teamName"
                        type="text"
                        className={inputClass}
                        placeholder="3–80 characters"
                        value={formData.teamName}
                        onChange={(e) => {
                          clearValidationErrors()
                          setFormData({ ...formData, teamName: e.target.value })
                        }}
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>

                  {/* Key rules */}
                  <details className="group mt-8 rounded-xl border border-surface-line bg-surface" open>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4">
                      <span className="flex items-center gap-2 font-semibold text-ink">
                        <ShieldCheck className="h-5 w-5 text-pitch" /> Key rules
                      </span>
                      <ChevronDown className="h-5 w-5 text-muted-dark transition-transform group-open:rotate-180" />
                    </summary>
                    <ul className="space-y-2.5 border-t border-surface-line px-4 py-4 text-sm text-ink/80">
                      {KEY_RULES.map((rule, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-surface-line px-4 py-3">
                      <Link to="/rules" className="inline-flex items-center gap-1 text-sm font-semibold text-ink hover:underline">
                        Read the full rules <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </details>

                  <label
                    htmlFor="acceptTerms"
                    className={`mt-5 flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                      acceptTerms ? 'border-pitch/50 bg-pitch/5' : 'border-surface-line bg-white hover:border-ink/30'
                    }`}
                  >
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-surface-line accent-[#0A1F44]"
                    />
                    <span className="text-sm font-medium text-ink">
                      I agree to the tournament rules and confirm that all information I provide is accurate and authentic.
                    </span>
                  </label>
                </motion.div>
              )}

              {/* ---------- Step 2: Captain & Vice-Captain ---------- */}
              {currentStep === 1 && (
                <motion.div key="step2" {...stepMotion}>
                  <h2 className="text-3xl text-ink md:text-4xl">Captain &amp; vice-captain</h2>
                  <p className="mt-1 text-sm text-muted-dark">We'll send the confirmation and Team ID to the captain's email.</p>

                  <div className="mt-6 space-y-6">
                    {(['captain', 'viceCaptain'] as const).map((role) => (
                      <div key={role} className="rounded-xl border border-surface-line p-5">
                        <div className="mb-4 flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink font-display text-lg text-gold">
                            {role === 'captain' ? 'C' : 'VC'}
                          </span>
                          <h3 className="text-2xl text-ink">{role === 'captain' ? 'Captain' : 'Vice-Captain'}</h3>
                        </div>
                        {renderContactFields(role)}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ---------- Step 3: Players ---------- */}
              {currentStep === 2 && (
                <motion.div key="step3" {...stepMotion}>
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <h2 className="text-3xl text-ink md:text-4xl">Players</h2>
                      <p className="mt-1 text-sm text-muted-dark">
                        {MIN_PLAYERS}–{MAX_PLAYERS} players, including captain &amp; vice-captain.
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                        formData.players.length >= MAX_PLAYERS ? 'bg-gold/20 text-ink' : 'bg-surface text-muted-dark'
                      }`}
                    >
                      {formData.players.length} / {MAX_PLAYERS} players
                    </span>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {formData.players.map((player, index) => (
                      <PlayerFormCard
                        key={index}
                        playerNumber={index + 1}
                        player={player}
                        onChange={(data) => updatePlayer(index, data)}
                        onRemove={removeLastPlayer}
                        canRemove={index === formData.players.length - 1 && formData.players.length > MIN_PLAYERS}
                        disabled={isSubmitting}
                      />
                    ))}
                  </div>

                  {formData.players.length < MAX_PLAYERS && (
                    <button
                      type="button"
                      onClick={addPlayer}
                      disabled={isSubmitting}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink/20 py-3 text-sm font-bold uppercase tracking-wider text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" /> Add player
                    </button>
                  )}
                </motion.div>
              )}

              {/* ---------- Step 4: Review (top) → Payment & Submit (below) ---------- */}
              {currentStep === 3 && (
                <motion.div key="step4" {...stepMotion} className="space-y-10">
                  {/* A. Review — styled as a team sheet */}
                  <section>
                    <p className="text-eyebrow uppercase text-flame">Part A</p>
                    <h2 className="mt-1 text-3xl text-ink md:text-4xl">Review your team sheet</h2>
                    <p className="mt-1 text-sm text-muted-dark">
                      Check everything carefully. Use <strong>Previous</strong> to make changes. Payment is below.
                    </p>

                    <div className="mt-6 overflow-hidden rounded-2xl border border-surface-line">
                      {/* Sheet header */}
                      <div className="bg-ink px-5 py-5 text-white">
                        <p className="text-eyebrow uppercase text-gold">{formData.churchName || 'Church not selected'}</p>
                        <p className="mt-1 break-words font-display text-4xl leading-tight">{formData.teamName || 'Team name'}</p>
                      </div>

                      {/* Leaders */}
                      <div className="grid divide-y divide-surface-line md:grid-cols-2 md:divide-x md:divide-y-0">
                        {(['captain', 'viceCaptain'] as const).map((role) => {
                          const p = formData[role]
                          return (
                            <div key={role} className="p-5">
                              <p className="text-eyebrow uppercase text-muted-dark">{role === 'captain' ? 'Captain' : 'Vice-Captain'}</p>
                              <p className="mt-1 break-words text-lg font-bold text-ink">{p.name || 'N/A'}</p>
                              <dl className="mt-2 space-y-1 text-sm text-ink/80">
                                <div className="flex gap-2"><dt className="w-20 shrink-0 text-muted-dark">Phone</dt><dd className="break-all">{p.phone || 'N/A'}</dd></div>
                                <div className="flex gap-2"><dt className="w-20 shrink-0 text-muted-dark">WhatsApp</dt><dd className="break-all">{p.whatsapp || 'N/A'}</dd></div>
                                <div className="flex gap-2"><dt className="w-20 shrink-0 text-muted-dark">Email</dt><dd className="break-all">{p.email || 'N/A'}</dd></div>
                              </dl>
                            </div>
                          )
                        })}
                      </div>

                      {/* Squad */}
                      <div className="border-t border-surface-line bg-surface p-5">
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-eyebrow uppercase text-muted-dark">Squad</p>
                          <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-white">
                            {formData.players.length} players
                          </span>
                        </div>
                        <ol className="grid gap-2 sm:grid-cols-2">
                          {formData.players.map((player, index) => (
                            <li key={index} className="flex items-center gap-3 rounded-lg bg-white px-3 py-2">
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gold font-display text-sm text-ink">
                                {index + 1}
                              </span>
                              <span className="break-words font-medium text-ink">{player.name || 'N/A'}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </section>

                  {/* B. Payment & Submit */}
                  <section className="border-t-2 border-dashed border-surface-line pt-10">
                    <p className="text-eyebrow uppercase text-flame">Part B</p>
                    <h2 className="mt-1 text-3xl text-ink md:text-4xl">Payment &amp; submit</h2>
                    <p className="mt-1 text-sm text-muted-dark">
                      Pay the entry fee, upload the receipt, then press <strong>Submit</strong>.
                    </p>

                    <div className="mt-6 grid items-center gap-6 rounded-2xl border border-surface-line p-5 md:grid-cols-[auto,1fr]">
                      <div className="mx-auto rounded-xl border-2 border-ink p-3">
                        <img
                          src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=9944257713@kotak811%26pn=ICCT27%26am=2027%26cu=INR%26tn=ICCT%2727%20Team%20Registration"
                          alt="UPI payment QR code for ₹2,027"
                          className="h-52 w-52 md:h-56 md:w-56"
                        />
                      </div>
                      <div className="text-center md:text-left">
                        <p className="text-eyebrow uppercase text-muted-dark">Entry fee</p>
                        <p className="font-display text-6xl leading-none text-ink">₹2,027</p>
                        <p className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-dark md:justify-start">
                          <QrCode className="h-4 w-4" /> Scan with any UPI app (GPay, PhonePe, Paytm…)
                        </p>
                        <p className="mt-1 text-sm text-muted-dark">Take a screenshot of the successful payment.</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className={labelClass}>Upload payment receipt *</label>
                      <FileUpload
                        file={formData.paymentReceipt}
                        onFileChange={handleFileChange}
                        accept=".jpg,.jpeg,.png,.pdf"
                        placeholder="Tap to upload or drag the receipt here"
                      />
                    </div>

                    <p className="mt-6 rounded-xl bg-gold/15 px-4 py-3 text-sm text-ink">
                      By submitting, you agree to the tournament rules. All information provided must be accurate.
                    </p>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Validation errors */}
            {validationErrors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 max-h-64 overflow-y-auto rounded-xl border border-flame/30 bg-flame/5 p-4"
                role="alert"
              >
                <div className="mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-flame" />
                  <h4 className="font-body text-base font-bold text-flame-dark">Please fix the following:</h4>
                </div>
                <ul className="space-y-1 pl-7 text-sm text-flame-dark">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="list-disc">{error.error}</li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between gap-3 border-t border-surface-line pt-6">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 0 || isSubmitting}
                className="btn flex-1 border-2 border-surface-line !px-4 text-ink hover:border-ink disabled:hover:border-surface-line sm:flex-none sm:!px-6"
              >
                <ChevronLeft className="h-5 w-5" /> <span>Previous</span>
              </button>

              <button type="button" onClick={handleNext} disabled={isSubmitting} className="btn-gold flex-1 !px-4 sm:min-w-[9rem] sm:flex-none sm:!px-6">
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                    {waitingForServer ? (<><span className="sm:hidden">Connecting…</span><span className="hidden sm:inline">Connecting to server…</span></>) : 'Submitting…'}
                  </>
                ) : currentStep === totalSteps - 1 ? (
                  <>
                    Submit <Send className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next <ChevronRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Success: tear-off team pass ===== */}
      <Portal>
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] overflow-y-auto overscroll-contain bg-ink-950/85 backdrop-blur-sm"
          >
            <div className="flex min-h-full items-center justify-center px-4 py-10">
              <motion.div
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 24, opacity: 0 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="w-full max-w-xl"
                role="dialog"
                aria-modal="true"
                aria-label="Registration submitted"
              >
                {/* Headline */}
                <div className="mb-7 text-center text-white">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pitch shadow-[0_0_40px_rgba(31,164,99,0.45)]">
                    <Check className="h-8 w-8" strokeWidth={3} />
                  </span>
                  <p className="mt-4 text-eyebrow uppercase text-gold">Registration submitted</p>
                  <h2 className="mt-1 text-4xl text-white md:text-5xl">You're on the team sheet!</h2>
                </div>

                {/* Tear-off ticket */}
                <div className="flex justify-center">
                  <TearTicket
                    width={540}
                    height={230}
                    stubSize={150}
                    radius={18}
                    holes={10}
                    rotate={-2}
                    tiltMax={7}
                    background="linear-gradient(135deg, #0A1F44 0%, #12305F 100%)"
                    stubBackground="#FFC21A"
                    color="#FFFFFF"
                    borderColor="rgba(255, 194, 26, 0.45)"
                    ariaLabel="Tear off the ICCT'27 entry stub"
                    onTear={() => setTicketTorn(true)}
                    stub={
                      <div className="flex h-full flex-col items-center justify-center px-3 text-center text-ink-900">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink-900/70">Admit</span>
                        <span className="font-display text-4xl leading-none">Team</span>
                        <span className="mt-2 rounded-md border border-ink-900/30 px-2 py-0.5 font-display text-lg leading-tight">
                          ICCT'27
                        </span>
                        <span className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-ink-900/60">Tear ›</span>
                      </div>
                    }
                  >
                    <div className="flex h-full flex-col justify-between p-6">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold">ICCT'27 · Team pass</span>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60">Season 4</span>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-display text-4xl leading-tight text-white">{formData.teamName}</p>
                        <p className="truncate text-sm text-white/70">{formData.churchName}</p>
                      </div>
                      <div className="flex items-end justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Team ID</p>
                          {registeredTeamId && registeredTeamId !== 'PENDING' ? (
                            <p className="truncate font-display text-3xl leading-none tracking-wider text-gold">{registeredTeamId}</p>
                          ) : (
                            <p className="text-sm font-semibold text-white/85">Emailed after approval</p>
                          )}
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                            registeredStatus === 'confirmed' ? 'bg-pitch text-white' : 'bg-gold/20 text-gold'
                          }`}
                        >
                          {registeredStatus === 'confirmed' ? 'Confirmed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </TearTicket>
                </div>

                <p className={`mt-4 text-center text-xs ${ticketTorn ? 'font-semibold text-gold' : 'text-white/50'}`} aria-live="polite">
                  {ticketTorn ? 'Stub torn — welcome to ICCT\'27!' : 'Drag the gold stub to tear it off'}
                </p>

                {/* Details */}
                <div className="mt-6 rounded-2xl bg-white p-5 text-ink shadow-2xl md:p-6">
                  {registeredTeamId && registeredTeamId !== 'PENDING' && (
                    <div className="mb-4 flex items-center justify-between gap-3 rounded-xl bg-surface px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-dark">Your Team ID</p>
                        <p className="truncate font-display text-2xl tracking-wider text-ink">{registeredTeamId}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          void navigator.clipboard?.writeText(registeredTeamId).then(() => {
                            setIdCopied(true)
                            window.setTimeout(() => setIdCopied(false), 2000)
                          })
                        }}
                        className="btn shrink-0 border border-surface-line !px-3 !py-2 text-ink hover:bg-ink hover:text-white"
                        aria-label="Copy Team ID"
                      >
                        {idCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {idCopied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  )}

                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between gap-4"><dt className="text-muted-dark">Captain</dt><dd className="break-words text-right font-semibold">{formData.captain.name}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-muted-dark">Vice-Captain</dt><dd className="break-words text-right font-semibold">{formData.viceCaptain.name}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-muted-dark">Players</dt><dd className="font-semibold">{formData.players.length}</dd></div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-muted-dark">Status</dt>
                      <dd>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
                            registeredStatus === 'confirmed' ? 'bg-pitch/15 text-pitch-dark' : 'bg-gold/20 text-ink'
                          }`}
                        >
                          {registeredStatus === 'confirmed' ? 'Confirmed' : 'Pending approval'}
                        </span>
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-5 flex gap-3 rounded-xl border border-surface-line p-4 text-sm">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-ink" />
                    <p className="text-muted-dark">
                      Confirmation goes to <strong className="break-all text-ink">{formData.captain.email}</strong> once our team
                      verifies the payment (usually within 24–48 hours). Keep your Team ID for all communication.
                    </p>
                  </div>

                  <button type="button" onClick={closeSuccess} className="btn-gold mt-5 w-full !py-4">
                    Done
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </Portal>
    </motion.div>
  )
}

export default Registration
