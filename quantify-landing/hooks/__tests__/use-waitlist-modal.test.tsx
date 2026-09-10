// ============================================
// hooks/__tests__/use-waitlist-modal.test.tsx - Tests hooks
// ============================================

import { renderHook, act } from '@testing-library/react'
import { useWaitlistModal } from '../use-waitlist-modal'

describe('useWaitlistModal', () => {
  beforeEach(() => {
    // Reset any global state before each test
    localStorage.clear()
  })

  it('should initialize with modal closed', () => {
    const { result } = renderHook(() => useWaitlistModal())
    
    expect(result.current.isOpen).toBe(false)
  })

  it('should open modal when open function is called', () => {
    const { result } = renderHook(() => useWaitlistModal())
    
    act(() => {
      result.current.open()
    })
    
    expect(result.current.isOpen).toBe(true)
  })

  it('should close modal when close function is called', () => {
    const { result } = renderHook(() => useWaitlistModal())
    
    act(() => {
      result.current.open()
    })
    
    expect(result.current.isOpen).toBe(true)
    
    act(() => {
      result.current.close()
    })
    
    expect(result.current.isOpen).toBe(false)
  })

  it('should toggle modal state', () => {
    const { result } = renderHook(() => useWaitlistModal())
    
    expect(result.current.isOpen).toBe(false)
    
    act(() => {
      result.current.toggle()
    })
    
    expect(result.current.isOpen).toBe(true)
    
    act(() => {
      result.current.toggle()
    })
    
    expect(result.current.isOpen).toBe(false)
  })

  it('should handle multiple consecutive opens', () => {
    const { result } = renderHook(() => useWaitlistModal())
    
    act(() => {
      result.current.open()
      result.current.open()
      result.current.open()
    })
    
    expect(result.current.isOpen).toBe(true)
  })

  it('should handle multiple consecutive closes', () => {
    const { result } = renderHook(() => useWaitlistModal())
    
    act(() => {
      result.current.open()
    })
    
    act(() => {
      result.current.close()
      result.current.close()
      result.current.close()
    })
    
    expect(result.current.isOpen).toBe(false)
  })

  it('should maintain state consistency across re-renders', () => {
    const { result, rerender } = renderHook(() => useWaitlistModal())
    
    act(() => {
      result.current.open()
    })
    
    rerender()
    
    expect(result.current.isOpen).toBe(true)
  })

  it('should provide all expected functions', () => {
    const { result } = renderHook(() => useWaitlistModal())
    
    expect(typeof result.current.open).toBe('function')
    expect(typeof result.current.close).toBe('function')
    expect(typeof result.current.toggle).toBe('function')
    expect(typeof result.current.isOpen).toBe('boolean')
  })
})