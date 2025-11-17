/**
 * ICCT26 Production Registration Service
 * Wraps the registration API with all production features:
 * - Validation
 * - Idempotency
 * - Retry logic
 * - Progress tracking
 * - Error handling
 * 
 * Usage: Replace apiService.registerTeamMultipart() with productionRegistrationService.register()
 * Created: November 17, 2025
 */

import {
  validateTeamRegistration,
  sanitizeFilename,
  FieldError
} from './validation'

import {
  generateIdempotencyKey,
  saveIdempotencyRecord,
  saveLastSubmission
} from './idempotency'

import {
  uploadMultipartWithRetry,
  isSuccessResponse,
  extractErrorMessage,
  handleAxiosError,
  UploadProgressCallback
} from './apiClient'

// ============================================================================
// TYPES
// ============================================================================

export interface TeamRegistrationData {
  teamName: string
  churchName: string
  captain: {
    name: string
    phone: string
    email: string
    whatsapp?: string
  }
  viceCaptain: {
    name: string
    phone: string
    email: string
    whatsapp?: string
  }
  players: Array<{
    name: string
    role: string
    aadharFile: File
    subscriptionFile: File
  }>
  pastorLetter: File
  paymentReceipt: File
  groupPhoto: File
}

export interface RegistrationResult {
  success: boolean
  teamId?: string
  teamName?: string
  emailSent?: boolean
  errors?: FieldError[]
  message?: string
}

export interface RegistrationOptions {
  onProgress?: UploadProgressCallback
  onRetry?: (attemptNumber: number) => void
}

// ============================================================================
// PRODUCTION REGISTRATION SERVICE
// ============================================================================

class ProductionRegistrationService {
  /**
   * Registers a team with full production features:
   * - Client-side validation
   * - File sanitization
   * - Idempotency
   * - Retry logic
   * - Progress tracking
   */
  async register(
    data: TeamRegistrationData,
    options: RegistrationOptions = {}
  ): Promise<RegistrationResult> {
    // ========== STEP 1: CLIENT-SIDE VALIDATION ==========
    console.log('🔍 Step 1: Validating data...')
    
    const validationErrors = validateTeamRegistration({
      teamName: data.teamName,
      churchName: data.churchName,
      captainName: data.captain.name,
      captainPhone: data.captain.phone,
      captainEmail: data.captain.email,
      captainWhatsapp: data.captain.whatsapp,
      viceName: data.viceCaptain.name,
      vicePhone: data.viceCaptain.phone,
      viceEmail: data.viceCaptain.email,
      viceWhatsapp: data.viceCaptain.whatsapp,
      pastorLetter: data.pastorLetter,
      paymentReceipt: data.paymentReceipt,
      groupPhoto: data.groupPhoto,
      players: data.players
    })

    if (validationErrors.length > 0) {
      console.error('❌ Validation failed:', validationErrors)
      return {
        success: false,
        errors: validationErrors,
        message: `${validationErrors.length} validation error(s) found`
      }
    }

    console.log('✅ Validation passed')

    // ========== STEP 2: GENERATE IDEMPOTENCY KEY ==========
    console.log('🔑 Step 2: Generating idempotency key...')
    
    const idempotencyKey = generateIdempotencyKey()
    saveIdempotencyRecord(idempotencyKey, 'pending')
    
    console.log('✅ Idempotency key:', idempotencyKey)

    // ========== STEP 3: BUILD FORMDATA WITH SANITIZED FILES ==========
    console.log('📦 Step 3: Building FormData...')
    
    const formData = new FormData()

    // Team details
    formData.append('team_name', data.teamName.trim())
    formData.append('church_name', data.churchName.trim())

    // Captain (FLATTENED for FastAPI)
    formData.append('captain_name', data.captain.name.trim())
    formData.append('captain_phone', data.captain.phone.trim())
    formData.append('captain_email', data.captain.email.trim())
    formData.append('captain_whatsapp', data.captain.whatsapp?.trim() || '')

    // Vice-captain (FLATTENED for FastAPI)
    formData.append('vice_name', data.viceCaptain.name.trim())
    formData.append('vice_phone', data.viceCaptain.phone.trim())
    formData.append('vice_email', data.viceCaptain.email.trim())
    formData.append('vice_whatsapp', data.viceCaptain.whatsapp?.trim() || '')

    // Team files with sanitized filenames
    const sanitizePastorLetter = new File(
      [data.pastorLetter],
      sanitizeFilename(data.pastorLetter.name),
      { type: data.pastorLetter.type }
    )
    formData.append('pastor_letter', sanitizePastorLetter)

    const sanitizedPaymentReceipt = new File(
      [data.paymentReceipt],
      sanitizeFilename(data.paymentReceipt.name),
      { type: data.paymentReceipt.type }
    )
    formData.append('payment_receipt', sanitizedPaymentReceipt)

    const sanitizedGroupPhoto = new File(
      [data.groupPhoto],
      sanitizeFilename(data.groupPhoto.name),
      { type: data.groupPhoto.type }
    )
    formData.append('group_photo', sanitizedGroupPhoto)

    // Players (FLATTENED for FastAPI)
    data.players.forEach((player, index) => {
      formData.append(`player_${index}_name`, player.name.trim())
      formData.append(`player_${index}_role`, player.role.trim() || '')

      const sanitizedAadhar = new File(
        [player.aadharFile],
        sanitizeFilename(player.aadharFile.name),
        { type: player.aadharFile.type }
      )
      formData.append(`player_${index}_aadhar_file`, sanitizedAadhar)

      const sanitizedSubscription = new File(
        [player.subscriptionFile],
        sanitizeFilename(player.subscriptionFile.name),
        { type: player.subscriptionFile.type }
      )
      formData.append(`player_${index}_subscription_file`, sanitizedSubscription)
    })

    console.log('✅ FormData built with sanitized filenames')
    console.log(`📊 Total files: ${3 + (data.players.length * 2)}`)

    // ========== STEP 4: UPLOAD WITH RETRY LOGIC ==========
    console.log('🚀 Step 4: Uploading with retry logic...')

    try {
      const response = await uploadMultipartWithRetry(
        '/api/register/team',
        formData,
        {
          idempotencyKey,
          onProgress: options.onProgress
        }
      )

      // Check response
      if (!isSuccessResponse(response)) {
        const errorMessage = extractErrorMessage(response)
        console.error('❌ Backend error:', errorMessage)
        
        saveIdempotencyRecord(idempotencyKey, 'failed')
        
        return {
          success: false,
          message: errorMessage
        }
      }

      // Success!
      const responseData = response.data
      
      console.log('✅ Registration successful!')
      console.log('   Team ID:', responseData.team_id)
      console.log('   Email sent:', responseData.email_sent)

      // Save to localStorage
      saveIdempotencyRecord(idempotencyKey, 'success', responseData.team_id)
      saveLastSubmission(responseData.team_id, data.teamName, idempotencyKey)

      return {
        success: true,
        teamId: responseData.team_id,
        teamName: responseData.team_name || data.teamName,
        emailSent: responseData.email_sent,
        message: responseData.message || 'Registration successful!'
      }
    } catch (error) {
      console.error('❌ Network/upload error:', error)
      
      const errorMessage = handleAxiosError(error)
      saveIdempotencyRecord(idempotencyKey, 'failed')

      return {
        success: false,
        message: errorMessage
      }
    }
  }
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================

export const productionRegistrationService = new ProductionRegistrationService()
export default productionRegistrationService
