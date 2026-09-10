// ============================================
// components/providers/waitlist-provider.tsx
// ============================================
'use client'

import { WaitlistModal } from '@/components/waitlist/waitlist-modal'
import { useWaitlistModal } from '@/hooks/use-waitlist-modal'

export function WaitlistProvider({ children }: { children: React.ReactNode }) {
  const { isOpen, close } = useWaitlistModal()

  return (
    <>
      {children}
      <WaitlistModal isOpen={isOpen} onClose={close} />
    </>
  )
}