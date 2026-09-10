// ============================================
// lib/__tests__/utils.test.ts - Tests unitaires utils
// ============================================

import { 
  cn, 
  formatDate, 
  formatCurrency, 
  truncate, 
  generateReferralCode, 
  debounce 
} from '../utils'

describe('Utils Functions', () => {
  describe('cn (class names utility)', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional')
    })

    it('should handle tailwind conflicts', () => {
      expect(cn('px-4', 'px-6')).toBe('px-6')
    })

    it('should handle undefined and null values', () => {
      expect(cn('base', undefined, null, 'valid')).toBe('base valid')
    })
  })

  describe('formatDate', () => {
    it('should format date string correctly in French', () => {
      const date = '2025-01-07T14:00:00Z'
      const formatted = formatDate(date)
      expect(formatted).toMatch(/7 janvier 2025/)
    })

    it('should format Date object correctly', () => {
      const date = new Date('2025-12-25T10:00:00Z')
      const formatted = formatDate(date)
      expect(formatted).toMatch(/25 décembre 2025/)
    })

    it('should handle invalid date strings', () => {
      expect(() => formatDate('invalid')).not.toThrow()
    })
  })

  describe('formatCurrency', () => {
    it('should format XOF currency correctly', () => {
      expect(formatCurrency(1000)).toMatch(/1[\s\u00a0]000[\s\u00a0]XOF/)
    })

    it('should format EUR currency correctly', () => {
      expect(formatCurrency(1000, 'EUR')).toMatch(/1[\s\u00a0]000[\s\u00a0]€/)
    })

    it('should handle zero amount', () => {
      expect(formatCurrency(0)).toMatch(/0[\s\u00a0]XOF/)
    })

    it('should handle negative amounts', () => {
      expect(formatCurrency(-500)).toMatch(/-500[\s\u00a0]XOF/)
    })

    it('should handle decimal amounts', () => {
      expect(formatCurrency(1000.50)).toMatch(/1[\s\u00a0]001[\s\u00a0]XOF/)
    })
  })

  describe('truncate', () => {
    it('should truncate long strings', () => {
      const long = 'This is a very long string that should be truncated'
      expect(truncate(long, 10)).toBe('This is a ...')
    })

    it('should not truncate short strings', () => {
      const short = 'Short'
      expect(truncate(short, 10)).toBe('Short')
    })

    it('should handle exact length', () => {
      const exact = '1234567890'
      expect(truncate(exact, 10)).toBe('1234567890')
    })

    it('should handle empty strings', () => {
      expect(truncate('', 10)).toBe('')
    })
  })

  describe('generateReferralCode', () => {
    it('should generate code of correct length', () => {
      expect(generateReferralCode(8)).toHaveLength(8)
      expect(generateReferralCode(12)).toHaveLength(12)
    })

    it('should generate unique codes', () => {
      const codes = Array.from({ length: 100 }, () => generateReferralCode())
      const uniqueCodes = new Set(codes)
      expect(uniqueCodes.size).toBe(100)
    })

    it('should only contain valid characters', () => {
      const code = generateReferralCode(20)
      expect(code).toMatch(/^[A-Z0-9]+$/)
    })

    it('should handle default length', () => {
      expect(generateReferralCode()).toHaveLength(8)
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should delay function execution', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 1000)
      
      debouncedFn()
      expect(mockFn).not.toHaveBeenCalled()
      
      jest.advanceTimersByTime(1000)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should cancel previous calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 1000)
      
      debouncedFn()
      debouncedFn()
      debouncedFn()
      
      jest.advanceTimersByTime(1000)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should pass arguments correctly', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 1000)
      
      debouncedFn('arg1', 'arg2')
      jest.advanceTimersByTime(1000)
      
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
    })

    it('should handle multiple argument types', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 1000)
      
      debouncedFn(1, { key: 'value' }, [1, 2, 3])
      jest.advanceTimersByTime(1000)
      
      expect(mockFn).toHaveBeenCalledWith(1, { key: 'value' }, [1, 2, 3])
    })
  })
})