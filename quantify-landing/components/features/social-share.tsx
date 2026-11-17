// ============================================
// components/features/social-share.tsx
// ============================================
'use client'

import { Check, Copy, Linkedin, MessageCircle, Share2 } from 'lucide-react'
import { useState } from 'react'

interface SocialShareProps {
  referralCode: string
}

export function SocialShare({ referralCode }: SocialShareProps) {
  const [copied, setCopied] = useState<'link' | 'code' | null>(null)
  const [copyFailed, setCopyFailed] = useState(false)

  const getReferralUrl = () => {
    const url = new URL('/', window.location.origin)
    url.searchParams.set('ref', referralCode)
    return url.toString()
  }

  const handleShare = (platform: 'whatsapp' | 'linkedin' | 'x') => {
    const url = getReferralUrl()
    const message = 'Rejoins Quantify avec mon lien de parrainage'
    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${message} : ${url}`)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`,
    }
    window.open(shareUrls[platform], '_blank', 'noopener,noreferrer')
  }

  const copyValue = async (value: string, type: 'link' | 'code') => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(type)
      setCopyFailed(false)
    } catch {
      setCopied(null)
      setCopyFailed(true)
    }
  }

  return (
    <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:flex sm:flex-wrap sm:justify-end">
      <button
        onClick={() => copyValue(getReferralUrl(), 'link')}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-2 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 sm:w-auto sm:px-4 sm:text-sm"
      >
        {copied === 'link' ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
        {copied === 'link' ? 'Lien copié' : 'Copier le lien'}
      </button>
      <button
        onClick={() => copyValue(referralCode, 'code')}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 sm:w-auto sm:px-4 sm:text-sm"
      >
        {copied === 'code' ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
        {copied === 'code' ? 'Code copié' : 'Copier le code'}
      </button>
      <button
        onClick={() => handleShare('whatsapp')}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 sm:w-auto sm:px-4 sm:text-sm"
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        WhatsApp
      </button>
      <button
        onClick={() => handleShare('linkedin')}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 sm:w-auto sm:px-4 sm:text-sm"
      >
        <Linkedin className="h-4 w-4" aria-hidden="true" />
        LinkedIn
      </button>
      <button
        onClick={() => handleShare('x')}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 sm:w-auto sm:px-4 sm:text-sm"
      >
        <Share2 className="h-4 w-4" aria-hidden="true" />
        Partager sur X
      </button>
      <span className={copyFailed ? 'text-xs text-red-700 sm:self-center' : 'sr-only'} aria-live="polite">
        {copyFailed
          ? 'Copie impossible. Autorisez le presse-papiers dans votre navigateur.'
          : copied === 'link'
            ? 'Lien de parrainage copié.'
            : copied === 'code'
              ? 'Code de parrainage copié.'
              : ''}
      </span>
    </div>
  )
}
