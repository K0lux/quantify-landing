// ============================================
// lib/validation/__tests__/schemas.test.ts - Tests validation Zod
// ============================================

import { 
  waitlistFormSchema,
  createWaitlistUserSchema,
  contactFormSchema,
  newsletterSchema,
  validateWithErrors 
} from '../schemas'

describe('Validation Schemas', () => {
  describe('waitlistFormSchema', () => {
    const validData = {
      email: 'test@example.com',
      phone: '+22893131874',
      fullName: 'John Doe',
      country: 'TG',
      userType: 'particulier',
      acceptTerms: true,
      acceptMarketing: false,
    }

    it('should validate correct waitlist form data', () => {
      const result = waitlistFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should require email', () => {
      const data = { ...validData, email: undefined }
      const result = waitlistFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should validate email format', () => {
      const data = { ...validData, email: 'invalid-email' }
      const result = waitlistFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should normalize email to lowercase', () => {
      const data = { ...validData, email: 'TEST@EXAMPLE.COM' }
      const result = waitlistFormSchema.safeParse(data)
      if (result.success) {
        expect(result.data.email).toBe('test@example.com')
      }
    })

    it('should require fullName', () => {
      const data = { ...validData, fullName: '' }
      const result = waitlistFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should validate fullName length', () => {
      const data = { ...validData, fullName: 'A' }
      const result = waitlistFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should validate country code', () => {
      const data = { ...validData, country: 'INVALID' }
      const result = waitlistFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should accept valid country codes', () => {
      const validCountries = ['TG', 'BF', 'CI', 'ML', 'NE', 'SN', 'BJ', 'GW']
      
      validCountries.forEach(country => {
        const data = { ...validData, country }
        const result = waitlistFormSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })

    it('should validate userType', () => {
      const validUserTypes = ['particulier', 'professionnel', 'institution', 'utility', 'admin']
      
      validUserTypes.forEach(userType => {
        const data = { ...validData, userType }
        const result = waitlistFormSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })

    it('should require acceptTerms to be true', () => {
      const data = { ...validData, acceptTerms: false }
      const result = waitlistFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should validate phone number format', () => {
      const validPhones = ['+22893131874', '+33123456789', '+1234567890']
      const invalidPhones = ['123', 'abc', '93131874']

      validPhones.forEach(phone => {
        const data = { ...validData, phone }
        const result = waitlistFormSchema.safeParse(data)
        expect(result.success).toBe(true)
      })

      invalidPhones.forEach(phone => {
        const data = { ...validData, phone }
        const result = waitlistFormSchema.safeParse(data)
        expect(result.success).toBe(false)
      })
    })

    it('should make phone optional', () => {
      const data = { ...validData, phone: undefined }
      const result = waitlistFormSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate referredBy format', () => {
      const data = { ...validData, referredBy: 'VALIDREF1' }
      const result = waitlistFormSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject invalid referral codes', () => {
      const data = { ...validData, referredBy: 'invalid code' }
      const result = waitlistFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('createWaitlistUserSchema', () => {
    const validData = {
      email: 'test@example.com',
      phone: '+22893131874',
      full_name: 'John Doe',
      country: 'TG',
      user_type: 'particulier',
      referral_code: 'REF12345',
      referred_by: 'ANOTHER1',
      status: 'pending',
      metadata: { source: 'landing' }
    }

    it('should validate correct waitlist user data', () => {
      const result = createWaitlistUserSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should require referral_code', () => {
      const data = { ...validData, referral_code: undefined }
      const result = createWaitlistUserSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should validate status enum', () => {
      const validStatuses = ['pending', 'approved', 'invited', 'converted', 'rejected']
      
      validStatuses.forEach(status => {
        const data = { ...validData, status }
        const result = createWaitlistUserSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })

    it('should reject invalid status', () => {
      const data = { ...validData, status: 'invalid_status' }
      const result = createWaitlistUserSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('contactFormSchema', () => {
    const validData = {
      name: 'John Doe',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'This is a test message',
      type: 'general'
    }

    it('should validate correct contact form data', () => {
      const result = contactFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should require all mandatory fields', () => {
      const requiredFields = ['name', 'email', 'subject', 'message']
      
      requiredFields.forEach(field => {
        const data = { ...validData, [field]: undefined }
        const result = contactFormSchema.safeParse(data)
        expect(result.success).toBe(false)
      })
    })

    it('should validate message length', () => {
      const shortMessage = 'Hi'
      const longMessage = 'A'.repeat(2001)
      
      expect(contactFormSchema.safeParse({ ...validData, message: shortMessage }).success).toBe(false)
      expect(contactFormSchema.safeParse({ ...validData, message: longMessage }).success).toBe(false)
    })

    it('should validate contact type', () => {
      const validTypes = ['general', 'investment', 'partnership', 'support', 'media']
      
      validTypes.forEach(type => {
        const data = { ...validData, type }
        const result = contactFormSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('newsletterSchema', () => {
    it('should validate correct newsletter data', () => {
      const result = newsletterSchema.safeParse({ email: 'test@example.com' })
      expect(result.success).toBe(true)
    })

    it('should require email', () => {
      const result = newsletterSchema.safeParse({})
      expect(result.success).toBe(false)
    })

    it('should validate email format', () => {
      const result = newsletterSchema.safeParse({ email: 'invalid-email' })
      expect(result.success).toBe(false)
    })

    it('should normalize email to lowercase', () => {
      const result = newsletterSchema.safeParse({ email: 'TEST@EXAMPLE.COM' })
      if (result.success) {
        expect(result.data.email).toBe('test@example.com')
      }
    })
  })

  describe('validateWithErrors utility', () => {
    it('should return success for valid data', () => {
      const data = { email: 'test@example.com' }
      const result = validateWithErrors(newsletterSchema, data)
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual({ email: 'test@example.com' })
      expect(result.errors).toBeUndefined()
    })

    it('should return errors for invalid data', () => {
      const data = { email: 'invalid' }
      const result = validateWithErrors(newsletterSchema, data)
      
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors!.length).toBeGreaterThan(0)
    })

    it('should format error messages correctly', () => {
      const data = {}
      const result = validateWithErrors(newsletterSchema, data)
      
      expect(result.success).toBe(false)
      expect(result.errors).toContain('Email requis')
    })

    it('should handle multiple validation errors', () => {
      const data = {
        email: 'invalid',
        fullName: 'A',
        country: 'INVALID',
        acceptTerms: false
      }
      const result = validateWithErrors(waitlistFormSchema, data)
      
      expect(result.success).toBe(false)
      expect(result.errors!.length).toBeGreaterThan(3)
    })
  })
})