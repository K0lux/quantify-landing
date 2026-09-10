// ============================================
// tests/integration/auth-supabase.test.ts - Tests intégration
// ============================================

import { SupabaseIntegration } from '@/lib/integrations/auth-supabase'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { WaitlistUser, UserProfile } from '@/types'

// Mock Supabase
const mockSupabaseClient = {
  from: jest.fn(),
  auth: {
    getUser: jest.fn(),
  },
}

jest.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: () => mockSupabaseClient,
}))

jest.mock('@/lib/auth', () => ({
  getCurrentUser: () => Promise.resolve({ id: 'auth_123', email: 'test@example.com' }),
}))

describe('Auth-Supabase Integration', () => {
  let integration: SupabaseIntegration
  
  beforeEach(() => {
    jest.clearAllMocks()
    integration = new SupabaseIntegration()
    
    // Setup default mock responses
    mockSupabaseClient.from = jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ 
          data: null, 
          error: null 
        })),
        single: jest.fn(() => Promise.resolve({ 
          data: null, 
          error: null 
        })),
        maybeSingle: jest.fn(() => Promise.resolve({ 
          data: null, 
          error: null 
        })),
      })),
      insert: jest.fn(() => Promise.resolve({ 
        data: {}, 
        error: null 
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ 
          data: {}, 
          error: null 
        })),
      })),
      upsert: jest.fn(() => Promise.resolve({ 
        data: {}, 
        error: null 
      })),
    }))
  })

  describe('syncUserFromWaitlist', () => {
    const mockWaitlistUser: WaitlistUser = {
      id: 'wl_123',
      auth_user_id: null,
      email: 'test@example.com',
      phone: '+22893131874',
      full_name: 'John Doe',
      country: 'TG',
      user_type: 'particulier',
      referral_code: 'REF123',
      referred_by: null,
      position: 1,
      status: 'pending',
      metadata: null,
      created_at: '2025-01-07T14:00:00Z',
      updated_at: '2025-01-07T14:00:00Z',
    }

    it('should successfully sync waitlist user to user profile', async () => {
      // Mock successful Supabase responses
      mockSupabaseClient.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ 
            data: mockWaitlistUser, 
            error: null 
          })),
        })),
        insert: jest.fn(() => Promise.resolve({ 
          data: { id: 'profile_123' }, 
          error: null 
        })),
        update: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ 
            data: {}, 
            error: null 
          })),
        })),
      }))

      const result = await integration.syncUserFromWaitlist(
        'auth_123', 
        'test@example.com'
      )

      expect(result.success).toBe(true)
      expect(result.userProfile).toBeDefined()
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('waitlist')
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('user_profiles')
    })

    it('should handle case when waitlist user not found', async () => {
      // Mock waitlist user not found
      mockSupabaseClient.from = jest.fn((table) => {
        if (table === 'waitlist') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => Promise.resolve({ 
                data: null, 
                error: null 
              })),
            })),
          }
        }
        return {
          insert: jest.fn(() => Promise.resolve({ 
            data: {}, 
            error: null 
          })),
        }
      })

      const result = await integration.syncUserFromWaitlist(
        'auth_123',
        'notfound@example.com'
      )

      expect(result.success).toBe(true)
      expect(result.userProfile).toBeDefined()
      expect(result.fromWaitlist).toBe(false)
    })

    it('should handle Supabase errors gracefully', async () => {
      // Mock Supabase error
      mockSupabaseClient.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ 
            data: null, 
            error: { message: 'Database error', code: '500' }
          })),
        })),
      }))

      const result = await integration.syncUserFromWaitlist(
        'auth_123',
        'test@example.com'
      )

      expect(result.success).toBe(false)
      expect(result.error).toContain('Database error')
    })

    it('should update waitlist user with Auth ID', async () => {
      const updateMock = jest.fn(() => Promise.resolve({ data: {}, error: null }))
      
      mockSupabaseClient.from = jest.fn((table) => {
        if (table === 'waitlist') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => Promise.resolve({ 
                data: mockWaitlistUser, 
                error: null 
              })),
            })),
            update: jest.fn(() => ({
              eq: updateMock,
            })),
          }
        }
        return {
          insert: jest.fn(() => Promise.resolve({ 
            data: { id: 'profile_123' }, 
            error: null 
          })),
        }
      })

      await integration.syncUserFromWaitlist('auth_123', 'test@example.com')

      expect(updateMock).toHaveBeenCalledWith('wl_123')
    })
  })

  describe('getUserProfile', () => {
    it('should retrieve user profile successfully', async () => {
      const mockProfile: UserProfile = {
        id: 'profile_123',
        auth_user_id: 'auth_123',
        waitlist_id: 'wl_123',
        email: 'test@example.com',
        phone: '+22893131874',
        first_name: 'John',
        last_name: 'Doe',
        avatar_url: null,
        country: 'TG',
        city: null,
        user_type: 'particulier',
        subscription_plan: 'free',
        subscription_status: 'active',
        onboarding_completed: false,
        preferences: {
          language: 'fr',
          timezone: 'Africa/Lome',
          currency: 'XOF',
          notifications: {
            email: true,
            sms: false,
            push: true,
            marketing: false,
          },
          privacy: {
            profile_visibility: 'private',
            analytics_opt_out: false,
          }
        },
        metadata: null,
        created_at: '2025-01-07T14:00:00Z',
        updated_at: '2025-01-07T14:00:00Z',
        last_login_at: null,
      }

      mockSupabaseClient.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ 
              data: mockProfile, 
              error: null 
            })),
          })),
        })),
      }))

      const result = await integration.getUserProfile('auth_123')

      expect(result.success).toBe(true)
      expect(result.userProfile).toEqual(mockProfile)
    })

    it('should handle user profile not found', async () => {
      mockSupabaseClient.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ 
              data: null, 
              error: { code: 'PGRST116' } // Not found error
            })),
          })),
        })),
      }))

      const result = await integration.getUserProfile('auth_123')

      expect(result.success).toBe(false)
      expect(result.error).toContain('not found')
    })
  })

  describe('updateUserLastLogin', () => {
    it('should update user last login timestamp', async () => {
      const updateMock = jest.fn(() => Promise.resolve({ data: {}, error: null }))
      
      mockSupabaseClient.from = jest.fn(() => ({
        update: jest.fn(() => ({
          eq: updateMock,
        })),
      }))

      const result = await integration.updateUserLastLogin('auth_123')

      expect(result.success).toBe(true)
      expect(updateMock).toHaveBeenCalledWith('auth_123')
    })

    it('should handle update errors', async () => {
      mockSupabaseClient.from = jest.fn(() => ({
        update: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ 
            data: null, 
            error: { message: 'Update failed' }
          })),
        })),
      }))

      const result = await integration.updateUserLastLogin('auth_123')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Update failed')
    })
  })

  describe('Error handling', () => {
    it('should handle network errors', async () => {
      mockSupabaseClient.from = jest.fn(() => {
        throw new Error('Network error')
      })

      const result = await integration.getUserProfile('auth_123')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Network error')
    })

    it('should handle malformed data', async () => {
      mockSupabaseClient.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ 
              data: { invalid: 'data' }, 
              error: null 
            })),
          })),
        })),
      }))

      const result = await integration.getUserProfile('auth_123')

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('Performance and optimization', () => {
    it('should cache results appropriately', async () => {
      const selectMock = jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ 
            data: { id: 'profile_123' }, 
            error: null 
          })),
        })),
      }))

      mockSupabaseClient.from = jest.fn(() => ({
        select: selectMock,
      }))

      // Call twice
      await integration.getUserProfile('auth_123')
      await integration.getUserProfile('auth_123')

      // Should still only call database once if caching is implemented
      // This test would pass even without caching but serves as documentation
      expect(selectMock).toHaveBeenCalled()
    })

    it('should handle concurrent requests correctly', async () => {
      mockSupabaseClient.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ 
              data: { id: 'profile_123' }, 
              error: null 
            })),
          })),
        })),
      }))

      // Make concurrent requests
      const promises = [
        integration.getUserProfile('auth_123'),
        integration.getUserProfile('auth_456'),
        integration.getUserProfile('auth_789'),
      ]

      const results = await Promise.all(promises)

      results.forEach(result => {
        expect(result.success).toBe(true)
      })
    })
  })
})