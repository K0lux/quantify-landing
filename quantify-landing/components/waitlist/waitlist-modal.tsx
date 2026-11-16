// ============================================
// components/waitlist/waitlist-modal.tsx
// ============================================
'use client'

import { X } from 'lucide-react'
import { WaitlistForm } from '@/components/waitlist/waitlist-form'
import { QWordmark } from '@/components/brand/QMark'

interface WaitlistModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-3 backdrop-blur-sm sm:p-4">
      <div className="relative max-h-[90svh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-4 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la fenêtre d’inscription"
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 transition-colors hover:bg-slate-200 sm:right-4 sm:top-4"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>

        <div className="mb-4 text-center sm:mb-6">
          <QWordmark height={36} variant="dark" className="mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Rejoignez Quantify
          </h2>
          <p className="text-slate-600">
            Soyez parmi les premiers à mieux maîtriser votre consommation énergétique.
          </p>
        </div>

        <WaitlistForm compact className="border-0 p-0 shadow-none" onSuccess={() => setTimeout(onClose, 2000)} />
      </div>
    </div>
  )
}
