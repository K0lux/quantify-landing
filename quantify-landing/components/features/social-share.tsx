// ============================================
// components/features/social-share.tsx
// ============================================
'use client'

import { Share2, Facebook, Twitter, Linkedin, Link as LinkIcon, Check } from 'lucide-react'
import { useState } from 'react'

interface SocialShareProps {
  url: string
  text: string
  hashtags?: string[]
}

export function SocialShare({ url, text, hashtags = [] }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${hashtags.join(',')}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
  }

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400')
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={() => handleShare('facebook')}
        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        aria-label="Partager sur Facebook"
      >
        <Facebook className="w-5 h-5" />
        <span className="hidden sm:inline">Facebook</span>
      </button>
      
      <button
        onClick={() => handleShare('twitter')}
        className="flex-1 px-4 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors flex items-center justify-center gap-2"
        aria-label="Partager sur Twitter"
      >
        <Twitter className="w-5 h-5" />
        <span className="hidden sm:inline">Twitter</span>
      </button>
      
      <button
        onClick={() => handleShare('linkedin')}
        className="flex-1 px-4 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
        aria-label="Partager sur LinkedIn"
      >
        <Linkedin className="w-5 h-5" />
        <span className="hidden sm:inline">LinkedIn</span>
      </button>
      
      <button
        onClick={copyLink}
        className="flex-1 px-4 py-3 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors flex items-center justify-center gap-2"
        aria-label="Copier le lien"
      >
        {copied ? <Check className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
        <span className="hidden sm:inline">{copied ? 'Copié !' : 'Copier'}</span>
      </button>
    </div>
  )
}