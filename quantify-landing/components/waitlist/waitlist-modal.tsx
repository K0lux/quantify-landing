// ============================================
// components/waitlist/waitlist-modal.tsx
// ============================================
'use client'

import { X, Zap } from 'lucide-react'
import { WaitlistForm } from '@/components/waitlist/waitlist-form'

interface WaitlistModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Rejoignez Quantify
          </h2>
          <p className="text-slate-600">
            Soyez parmi les premiers à transformer votre énergie
          </p>
        </div>

        <WaitlistForm compact onSuccess={() => setTimeout(onClose, 2000)} />
      </div>
    </div>
  )
}