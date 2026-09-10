// ============================================
// tests/integration/waitlist-api.test.ts - Tests API waitlist
// ============================================

import { NextRequest } from 'next/server'
import { POST, GET } from '@/app/api/waitlist/route'
import type { WaitlistFormData } from '@/types'

// Mock Supabase client
const mockSupabaseClient = {
  from: jest.fn(),
}

jest.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: () => mockSupabaseClient,
}))

// Mock auth
jest.mock('@/lib/auth', () => ({
  getCurrentUser: () => Promise.resolve(null),
}))

// Mock nanoid
jest.mock('nanoid', () => ({
  nanoid: (length: number) => 'MOCK'.repeat(length / 4).substring(0, length),
}))

describe('Waitlist API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Default mock responses
    mockSupabaseClient.from = jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          maybeSingle: jest.fn(() => Promise.resolve({ 
            data: null, 
            error: null 
          })),
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ 
            data: {
              id: 'wl_123',
              email: 'test@example.com',
              position: 1,
              referral_code: 'MOCKMOCK',
            }, 
            error: null 
          })),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ 
          data: {}, 
          error: null 
        })),
      })),
    }))
  })

  describe('POST /api/waitlist', () => {
    const validFormData: WaitlistFormData = {
      email: 'test@example.com',
      phone: '+22893131874',
      fullName: 'John Doe',
      country: 'TG',
      userType: 'particulier',
      acceptTerms: true,
      acceptMarketing: false,
    }

    it('should successfully create waitlist entry', async () => {
      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-forwarded-for': '127.0.0.1',
          'user-agent': 'test-agent',
        },
        body: JSON.stringify(validFormData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data).toBeDefined()
      expect(data.position).toBeDefined()
      expect(data.referralCode).toBeDefined()
    })

    it('should reject invalid email format', async () => {
      const invalidData = { ...validFormData, email: 'invalid-email' }
      
      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(invalidData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Données invalides')
    })

    it('should reject missing required fields', async () => {
      const incompleteData = { 
        email: 'test@example.com',
        // Missing fullName, country, userType, acceptTerms
      }
      
      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(incompleteData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it('should handle duplicate email registration', async () => {
      // Mock existing user
      mockSupabaseClient.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            maybeSingle: jest.fn(() => Promise.resolve({ 
              data: { id: 'existing_123', email: 'test@example.com' }, 
              error: null 
            })),
          })),
        })),
      }))

      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(validFormData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.success).toBe(false)
      expect(data.error).toBe('EMAIL_EXISTS')
    })

    it('should handle referral codes correctly', async () => {
      const dataWithReferral = { 
        ...validFormData, 
        referredBy: 'REFERRAL1' 
      }

      // Mock referrer exists
      const updateMock = jest.fn(() => Promise.resolve({ data: {}, error: null }))
      const insertReferralMock = jest.fn(() => Promise.resolve({ data: {}, error: null }))
      
      mockSupabaseClient.from = jest.fn((table) => {
        if (table === 'waitlist') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn((field) => {
                if (field === 'email') {
                  return {
                    maybeSingle: jest.fn(() => Promise.resolve({ 
                      data: null, 
                      error: null 
                    })),
                  }
                }
                if (field === 'referral_code') {
                  return {
                    maybeSingle: jest.fn(() => Promise.resolve({ 
                      data: { 
                        id: 'referrer_123', 
                        position: 10,
                        referral_code: 'REFERRAL1' 
                      }, 
                      error: null 
                    })),
                  }
                }
              }),
            })),
            insert: jest.fn(() => ({
              select: jest.fn(() => ({
                single: jest.fn(() => Promise.resolve({ 
                  data: { id: 'wl_123', position: 5 }, 
                  error: null 
                })),
              })),
            })),
            update: jest.fn(() => ({
              eq: updateMock,
            })),
          }
        }
        if (table === 'referrals') {
          return {
            insert: insertReferralMock,
          }
        }
        return {}
      })

      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(dataWithReferral),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(updateMock).toHaveBeenCalled() // Referrer position updated
      expect(insertReferralMock).toHaveBeenCalled() // Referral recorded
    })

    it('should handle database errors gracefully', async () => {
      mockSupabaseClient.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            maybeSingle: jest.fn(() => Promise.resolve({ 
              data: null, 
              error: { message: 'Database connection failed' }
            })),
          })),
        })),
      }))

      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(validFormData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('CREATION_FAILED')
    })

    it('should extract user IP and User-Agent correctly', async () => {
      const insertMock = jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ 
            data: { id: 'wl_123' }, 
            error: null 
          })),
        })),
      }))

      mockSupabaseClient.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            maybeSingle: jest.fn(() => Promise.resolve({ 
              data: null, 
              error: null 
            })),
          })),
        })),
        insert: insertMock,
      }))

      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-forwarded-for': '192.168.1.1',
          'user-agent': 'Mozilla/5.0 Test Browser',
        },
        body: JSON.stringify(validFormData),
      })

      await POST(request)

      expect(insertMock).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            metadata: expect.objectContaining({
              ip_address: '192.168.1.1',
              user_agent: 'Mozilla/5.0 Test Browser',
            })
          })
        ])
      )
    })
  })

  describe('GET /api/waitlist', () => {
    it('should return public statistics for unauthenticated users', async () => {
      // Mock stats response
      mockSupabaseClient.from = jest.fn(() => ({
        select: jest.fn(() => Promise.resolve({ 
          data: [], 
          error: null,
          count: 1247 
        })),
      }))

      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'GET',
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toBeDefined()
      expect(data.data.total_users).toBeDefined()
    })

    it('should limit data for unauthenticated users', async () => {
      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'GET',
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.pending_users).toBe(0)
      expect(data.data.approved_users).toBe(0)
      expect(data.data.converted_users).toBe(0)
      expect(data.data.top_referrers).toEqual([])
      expect(data.data.daily_signups).toEqual([])
    })

    it('should handle database errors in stats endpoint', async () => {
      mockSupabaseClient.from = jest.fn(() => ({
        select: jest.fn(() => Promise.resolve({ 
          data: null, 
          error: { message: 'Stats query failed' }
        })),
      }))

      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'GET',
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('STATS_ERROR')
    })

    it('should include cache headers', async () => {
      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'GET',
      })

      const response = await GET(request)

      expect(response.headers.get('Cache-Control')).toBe('public, s-maxage=300')
      expect(response.headers.get('X-Authenticated')).toBe('false')
    })
  })

  describe('Performance and Load Testing', () => {
    it('should handle multiple concurrent POST requests', async () => {
      const requests = Array.from({ length: 10 }, (_, i) => {
        const data = { 
          ...validFormData, 
          email: `user${i}@example.com` 
        }
        
        return POST(new NextRequest('http://localhost:3000/api/waitlist', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(data),
        }))
      })

      const responses = await Promise.all(requests)
      
      responses.forEach((response, index) => {
        expect(response.status).toBe(201)
      })
    })

    it('should complete requests within reasonable time', async () => {
      const startTime = Date.now()
      
      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(validFormData),
      })

      const response = await POST(request)
      
      const endTime = Date.now()
      const duration = endTime - startTime

      expect(response.status).toBe(201)
      expect(duration).toBeLessThan(1000) // Should complete within 1 second
    })
  })

  describe('Error Recovery and Resilience', () => {
    it('should handle JSON parsing errors', async () => {
      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: 'invalid json {',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })

    it('should handle missing Content-Type header', async () => {
      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        body: JSON.stringify(validFormData),
      })

      const response = await POST(request)
      
      // Should still work or fail gracefully
      expect([201, 400, 500]).toContain(response.status)
    })

    it('should handle very large payloads', async () => {
      const largeData = {
        ...validFormData,
        fullName: 'A'.repeat(10000), // Very long name
      }

      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(largeData),
      })

      const response = await POST(request)
      
      expect([400, 413, 500]).toContain(response.status) // Should be rejected
    })
  })
})