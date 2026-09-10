import { Metadata } from 'next'
import { NotificationSender } from '@/components/admin/notification-sender'

export const metadata: Metadata = {
  title: 'Notifications - Admin Quantify',
}

export default function AdminNotificationsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Notifications
        </h1>
        <p className="text-slate-600 mt-1">
          Envoyez des notifications aux utilisateurs inscrits
        </p>
      </div>

      <NotificationSender />
    </div>
  )
}
