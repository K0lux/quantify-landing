// ============================================
// components/providers/toast-provider.tsx
// ============================================
'use client'

import { ToastProvider as ToastContextProvider } from '@/components/features/toast'

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <ToastContextProvider>{children}</ToastContextProvider>
}