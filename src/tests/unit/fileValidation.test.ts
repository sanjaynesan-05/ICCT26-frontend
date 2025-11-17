import {
  validateFileType,
  validateFileSize,
  validateImageFile,
} from '../../lib/fileValidation'

describe('File Validation', () => {
  describe('validateFileType', () => {
    it('should accept valid image types', () => {
      const jpegFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
      const pngFile = new File(['content'], 'test.png', { type: 'image/png' })
      const gifFile = new File(['content'], 'test.gif', { type: 'image/gif' })
      
      expect(validateFileType(jpegFile, ['image/jpeg', 'image/png', 'image/gif'])).toBe(true)
      expect(validateFileType(pngFile, ['image/jpeg', 'image/png', 'image/gif'])).toBe(true)
      expect(validateFileType(gifFile, ['image/jpeg', 'image/png', 'image/gif'])).toBe(true)
    })

    it('should accept PDF files', () => {
      const pdfFile = new File(['content'], 'document.pdf', { type: 'application/pdf' })
      
      expect(validateFileType(pdfFile, ['application/pdf', 'image/jpeg'])).toBe(true)
    })

    it('should reject invalid file types', () => {
      const txtFile = new File(['content'], 'test.txt', { type: 'text/plain' })
      const docFile = new File(['content'], 'test.doc', { type: 'application/msword' })
      
      expect(validateFileType(txtFile, ['image/jpeg', 'image/png', 'application/pdf'])).toBe(false)
      expect(validateFileType(docFile, ['image/jpeg', 'image/png', 'application/pdf'])).toBe(false)
    })

    it('should be case-insensitive for MIME types', () => {
      const jpegFile = new File(['content'], 'test.JPG', { type: 'IMAGE/JPEG' })
      
      expect(validateFileType(jpegFile, ['image/jpeg', 'image/png'])).toBe(true)
    })

    it('should handle empty allowed types array', () => {
      const jpegFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
      
      expect(validateFileType(jpegFile, [])).toBe(false)
    })
  })

  describe('validateFileSize', () => {
    it('should accept files under size limit', () => {
      const smallFile = new File(['a'.repeat(1000)], 'small.txt', { type: 'text/plain' })
      
      expect(validateFileSize(smallFile, 5 * 1024 * 1024)).toBe(true)
    })

    it('should accept files exactly at size limit', () => {
      const maxSizeFile = new File(['a'.repeat(5 * 1024 * 1024)], 'max.txt', { type: 'text/plain' })
      
      expect(validateFileSize(maxSizeFile, 5 * 1024 * 1024)).toBe(true)
    })

    it('should reject files over size limit', () => {
      const largeFile = new File(['a'.repeat(6 * 1024 * 1024)], 'large.txt', { type: 'text/plain' })
      
      expect(validateFileSize(largeFile, 5 * 1024 * 1024)).toBe(false)
    })

    it('should handle 0 byte files', () => {
      const emptyFile = new File([], 'empty.txt', { type: 'text/plain' })
      
      expect(validateFileSize(emptyFile, 5 * 1024 * 1024)).toBe(true)
    })

    it('should use default 5MB limit if not specified', () => {
      const file3MB = new File(['a'.repeat(3 * 1024 * 1024)], 'file.txt', { type: 'text/plain' })
      const file6MB = new File(['a'.repeat(6 * 1024 * 1024)], 'file.txt', { type: 'text/plain' })
      
      expect(validateFileSize(file3MB)).toBe(true)
      expect(validateFileSize(file6MB)).toBe(false)
    })
  })

  describe('validateImageFile', () => {
    it('should accept valid image within size limit', () => {
      const jpegFile = new File(['a'.repeat(1000)], 'photo.jpg', { type: 'image/jpeg' })
      
      const result = validateImageFile(jpegFile)
      
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject image with invalid type', () => {
      const txtFile = new File(['content'], 'notimage.txt', { type: 'text/plain' })
      
      const result = validateImageFile(txtFile)
      
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Invalid file type')
    })

    it('should reject image exceeding size limit', () => {
      const largeJpeg = new File(['a'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })
      
      const result = validateImageFile(largeJpeg)
      
      expect(result.valid).toBe(false)
      expect(result.error).toContain('too large')
    })

    it('should accept PNG files', () => {
      const pngFile = new File(['content'], 'image.png', { type: 'image/png' })
      
      const result = validateImageFile(pngFile)
      
      expect(result.valid).toBe(true)
    })

    it('should accept GIF files', () => {
      const gifFile = new File(['content'], 'animation.gif', { type: 'image/gif' })
      
      const result = validateImageFile(gifFile)
      
      expect(result.valid).toBe(true)
    })

    it('should accept WebP files', () => {
      const webpFile = new File(['content'], 'modern.webp', { type: 'image/webp' })
      
      const result = validateImageFile(webpFile)
      
      expect(result.valid).toBe(true)
    })

    it('should use custom size limit when provided', () => {
      const file2MB = new File(['a'.repeat(2 * 1024 * 1024)], 'image.jpg', { type: 'image/jpeg' })
      
      // Should pass with 5MB limit
      expect(validateImageFile(file2MB, 5 * 1024 * 1024).valid).toBe(true)
      
      // Should fail with 1MB limit
      expect(validateImageFile(file2MB, 1 * 1024 * 1024).valid).toBe(false)
    })
  })

  describe('Integration: Complete file validation workflow', () => {
    it('should validate payment proof upload', () => {
      // Valid payment proof
      const validProof = new File(
        ['a'.repeat(2 * 1024 * 1024)],
        'payment-receipt.jpg',
        { type: 'image/jpeg' }
      )
      
      expect(validateImageFile(validProof).valid).toBe(true)
    })

    it('should validate jersey image upload', () => {
      // Valid jersey image
      const validJersey = new File(
        ['a'.repeat(3 * 1024 * 1024)],
        'team-jersey.png',
        { type: 'image/png' }
      )
      
      expect(validateImageFile(validJersey).valid).toBe(true)
    })

    it('should reject invalid file combinations', () => {
      const invalidFiles = [
        new File(['content'], 'doc.pdf', { type: 'application/pdf' }),
        new File(['content'], 'spreadsheet.xlsx', { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        }),
        new File(['a'.repeat(10 * 1024 * 1024)], 'huge-image.jpg', { type: 'image/jpeg' }),
      ]
      
      invalidFiles.forEach(file => {
        const result = validateImageFile(file)
        expect(result.valid).toBe(false)
        expect(result.error).toBeDefined()
      })
    })

    it('should provide detailed error messages', () => {
      // Type error
      const pdfFile = new File(['content'], 'doc.pdf', { type: 'application/pdf' })
      const typeResult = validateImageFile(pdfFile)
      expect(typeResult.error).toMatch(/invalid file type/i)
      
      // Size error
      const largeFile = new File(
        ['a'.repeat(6 * 1024 * 1024)],
        'large.jpg',
        { type: 'image/jpeg' }
      )
      const sizeResult = validateImageFile(largeFile)
      expect(sizeResult.error).toMatch(/too large/i)
    })
  })

  describe('Edge cases', () => {
    it('should handle files with no extension', () => {
      const noExtFile = new File(['content'], 'imagefile', { type: 'image/jpeg' })
      
      expect(validateImageFile(noExtFile).valid).toBe(true)
    })

    it('should handle files with multiple extensions', () => {
      const multiExtFile = new File(
        ['content'],
        'image.backup.jpg',
        { type: 'image/jpeg' }
      )
      
      expect(validateImageFile(multiExtFile).valid).toBe(true)
    })

    it('should handle files with uppercase extensions', () => {
      const upperFile = new File(['content'], 'PHOTO.JPG', { type: 'image/jpeg' })
      
      expect(validateImageFile(upperFile).valid).toBe(true)
    })

    it('should handle files with mismatched extension and MIME', () => {
      const mismatchFile = new File(['content'], 'image.png', { type: 'image/jpeg' })
      
      // Should validate based on MIME type, not extension
      expect(validateImageFile(mismatchFile).valid).toBe(true)
    })
  })
})
