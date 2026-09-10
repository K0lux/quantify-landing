// ============================================
// app/(marketing)/layout.tsx
// ============================================
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { WaitlistProvider } from '@/components/providers/waitlist-provider'
import { ToastProvider } from '@/components/features/toast'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ToastProvider>
      <WaitlistProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </WaitlistProvider>
    </ToastProvider>
  )
}