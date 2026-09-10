import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const PUBLIC_ROUTES = new Set([
  '/',
  '/solution',
  '/marche',
  '/equipe',
  '/contact',
  '/rejoindre',
  '/connexion',
  '/creer-compte',
  '/mot-de-passe-oublie',
  '/reset-password',
])

const PUBLIC_API_ROUTES = [
  '/api/waitlist',
  '/api/newsletter',
  '/api/contact',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/auth/forgot-password',
]

const PROTECTED_PREFIXES = ['/dashboard', '/profile', '/settings', '/api/user']
const ADMIN_PREFIXES = ['/admin', '/api/admin']

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.has(pathname)) return true

  for (const route of PUBLIC_ROUTES) {
    if (pathname.startsWith(route + '/')) return true
  }

  return PUBLIC_API_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'))
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix))
}

function isAdminRoute(pathname: string): boolean {
  return ADMIN_PREFIXES.some(prefix => pathname.startsWith(prefix))
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://vitals.vercel-analytics.com https://va.vercel-scripts.com",
    "frame-src 'self' https://vercel.live",
  ].join('; ')

  response.headers.set('Content-Security-Policy', cspHeader)

  return response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.includes('..') || pathname.includes('<') || pathname.includes('>')) {
    return new NextResponse('Bad Request', { status: 400 })
  }

  const { user, response, supabase } = await updateSession(request)

  if (isPublicRoute(pathname)) {
    return addSecurityHeaders(response)
  }

  if (isAdminRoute(pathname)) {
    if (!user) {
      const loginUrl = new URL('/connexion', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('user_type')
      .eq('auth_user_id', user.id)
      .single()

    if (profile?.user_type !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return addSecurityHeaders(response)
  }

  if (isProtectedRoute(pathname)) {
    if (!user) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { success: false, error: 'UNAUTHORIZED', message: 'Authentification requise' },
          { status: 401 }
        )
      }

      const loginUrl = new URL('/connexion', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return addSecurityHeaders(response)
  }

  if (pathname.startsWith('/api/')) {
    response.headers.set('X-API-Version', '1.0')
    return addSecurityHeaders(response)
  }

  return addSecurityHeaders(response)
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
