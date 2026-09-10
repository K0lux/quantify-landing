import { redirect } from 'next/navigation'
import { isAdmin, getCurrentUser } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/admin/connexion')
  }

  const admin = await isAdmin()
  if (!admin) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader user={user} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
