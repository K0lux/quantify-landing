// ============================================
// hooks/use-waitlist-modal.ts
// ============================================
'use client'

import { create } from 'zustand'

interface WaitlistModalStore {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export const useWaitlistModal = create<WaitlistModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}))
