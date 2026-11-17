import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { DashboardNavigation } from '@/components/dashboard/dashboard-navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/connexion')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />
      <DashboardNavigation />
      
      <main className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {children}
      </main>
    </div>
  )
}
