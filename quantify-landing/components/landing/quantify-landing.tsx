'use client'

import { useWaitlistModal } from '@/hooks/use-waitlist-modal'
import { HeroSection } from '@/components/sections/hero'
import { ProblemSection } from '@/components/sections/problem'
import { SolutionSection } from '@/components/sections/solution'
import { AudienceSection } from '@/components/sections/audience'
import { ArchitectureSection } from '@/components/sections/architecture'
import { ImpactSection } from '@/components/sections/impact'
import { UseCasesSection } from '@/components/sections/use-cases'
import { FAQSection } from '@/components/sections/faq'
import { CTASection } from '@/components/sections/cta'

export function QuantifyLanding() {
  const { open } = useWaitlistModal()

  return (
    <div className="min-h-screen bg-white">
      <HeroSection onJoinWaitlist={open} />
      <ProblemSection />
      <SolutionSection />
      <AudienceSection />
      <ArchitectureSection />
      <ImpactSection />
      <UseCasesSection />
      <FAQSection />
      <CTASection onJoinWaitlist={open} />
    </div>
  )
}
