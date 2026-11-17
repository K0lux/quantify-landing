import Link from 'next/link'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import { AdminProfileForm } from '@/components/admin/admin-profile-form'

export const metadata: Metadata = {
  title: 'Paramètres administrateur - Quantify',
}

export default async function AdminSettingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/connexion')
  const supabase = createAdminSupabaseClient()
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('first_name, last_name, email, phone, country')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">Paramètres du compte</h1>
        <p className="mt-1 text-slate-600">Mettez à jour vos coordonnées administrateur.</p>
      </div>
      <AdminProfileForm initialProfile={{
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || '',
        email: profile?.email || user?.email || '',
        phone: profile?.phone || '',
        country: profile?.country || 'TG',
      }} />
      <p className="text-sm text-slate-600">
        Pour modifier votre mot de passe, utilisez la <Link href="/mot-de-passe-oublie" className="font-medium text-orange-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700">récupération de compte</Link>.
      </p>
    </div>
  )
}
