// ============================================
// components/layout/footer.tsx
// ============================================
import { Mail, Phone, Linkedin, Youtube } from 'lucide-react'
import { QWordmark } from '@/components/brand/QMark'
import { NewsletterForm } from '@/components/newsletter/newsletter-form'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-10 grid gap-8 md:mb-12 md:grid-cols-2 md:gap-10">
          <div>
            <div className="mb-5">
              <QWordmark height={32} variant="white" />
            </div>
            <p className="text-sm text-slate-400 mb-4">
              L&apos;application qui révolutionne la gestion énergétique en Afrique et au-delà.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" aria-label="X" className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.636 7.584H.474l8.6-9.83L0 1.153h7.594l5.243 6.932zM17.61 20.644h2.039L6.486 3.356H4.298z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-800 p-5 sm:p-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Restez informé</h3>
              <p className="text-slate-400 text-sm">
                Recevez des conseils et des actualités sur la gestion énergétique.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500 space-y-2">
          <p className="text-slate-500">
            © 2026 Quantify. Tous droits réservés.
          </p>
          <p className="flex items-center justify-center gap-2">
            <Mail className="w-4 h-4" />
            kassaluc9770@gmail.com
          </p>
          <p className="flex items-center justify-center gap-2">
            <Phone className="w-4 h-4" />
            +228 93 13 18 74
          </p>
        </div>
      </div>
    </footer>
  )
}
