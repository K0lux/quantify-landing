// ============================================
// components/layout/footer.tsx
// ============================================
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, Linkedin, Twitter, Facebook, Heart } from 'lucide-react'
import { NewsletterForm } from '@/components/newsletter/newsletter-form'

export function Footer() {
  const footerLinks = {
    product: [
      { name: 'Fonctionnalités', href: '/solution' },
      { name: 'Tarifs', href: '/#pricing' },
      { name: 'Télécharger', href: '#' },
      { name: 'Démo', href: '#' },
    ],
    company: [
      { name: 'Équipe', href: '/equipe' },
      { name: 'Notre vision', href: '/marche' },
      { name: 'Investisseurs', href: '/#investisseurs' },
      { name: 'Carrières', href: '/contact' },
    ],
    resources: [
      { name: 'Blog', href: '#' },
      { name: 'Documentation', href: '#' },
      { name: 'FAQ', href: '#' },
      { name: 'Support', href: '/contact' },
    ],
  }

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Company */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.svg"
                alt="Quantify"
                width={40}
                height={55}
                className="w-10 h-auto"
              />
              <span className="text-xl font-bold text-white">Quantify</span>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              L&apos;application qui révolutionne la gestion énergétique en Afrique et au-delà.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-bold text-white mb-4">Produit</h3>
            <ul className="space-y-3 text-sm">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-white mb-4">Entreprise</h3>
            <ul className="space-y-3 text-sm">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-white mb-4">Ressources</h3>
            <ul className="space-y-3 text-sm">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-slate-800 rounded-2xl p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Restez informé</h3>
              <p className="text-slate-400 text-sm">Recevez les dernières actualités et mises à jour</p>
            </div>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-800 text-sm">
          <p className="text-slate-500">
            © 2025 Quantify. Tous droits réservés. Made with <Heart className="w-4 h-4 inline text-red-500" /> in Togo
          </p>
          <div className="flex gap-6">
            <Link href="/confidentialite" className="hover:text-white transition-colors">
              Confidentialité
            </Link>
            <Link href="/conditions" className="hover:text-white transition-colors">
              Conditions
            </Link>
            <Link href="/cookies" className="hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-center text-sm text-slate-500 space-y-1">
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