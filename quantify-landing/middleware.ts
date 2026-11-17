import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { consumeRateLimit, getClientIp } from '@/lib/security/rate-limit'

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
const PUBLIC_API_RATE_LIMITS: Record<string, { limit: number; windowMs: number }> = {
  '/api/waitlist': { limit: 5, windowMs: 10 * 60 * 1_000 },
  '/api/contact': { limit: 5, windowMs: 10 * 60 * 1_000 },
  '/api/newsletter': { limit: 3, windowMs: 10 * 60 * 1_000 },
  '/api/auth/login': { limit: 8, windowMs: 15 * 60 * 1_000 },
  '/api/auth/register': { limit: 5, windowMs: 60 * 60 * 1_000 },
  '/api/auth/forgot-password': { limit: 3, windowMs: 60 * 60 * 1_000 },
  '/api/admin/newsletter/send': { limit: 3, windowMs: 60 * 60 * 1_000 },
  '/api/admin/notifications': { limit: 5, windowMs: 10 * 60 * 1_000 },
  '/api/admin/content': { limit: 10, windowMs: 60 * 1_000 },
  '/api/admin/waitlist': { limit: 60, windowMs: 60 * 1_000 },
  '/api/admin/newsletter/manage': { limit: 30, windowMs: 60 * 1_000 },
  '/api/admin/contact-messages': { limit: 60, windowMs: 60 * 1_000 },
  '/api/user/profile': { limit: 20, windowMs: 60 * 1_000 },
  '/api/user/settings': { limit: 10, windowMs: 60 * 1_000 },
}
const PUBLIC_API_GET_RATE_LIMITS: Record<string, { limit: number; windowMs: number }> = {
  '/api/waitlist': { limit: 60, windowMs: 60 * 1_000 },
}
const API_BODY_LIMITS: Record<string, number> = {
  '/api/waitlist': 8 * 1024,
  '/api/contact': 8 * 1024,
  '/api/newsletter': 2 * 1024,
  '/api/auth/login': 4 * 1024,
  '/api/auth/register': 4 * 1024,
  '/api/auth/forgot-password': 2 * 1024,
  '/api/user/profile': 8 * 1024,
  '/api/user/settings': 8 * 1024,
  '/api/admin/content': 64 * 1024,
  '/api/admin/newsletter/send': 16 * 1024,
  '/api/admin/notifications': 8 * 1024,
  '/api/admin/waitlist': 2 * 1024,
  '/api/admin/newsletter/manage': 2 * 1024,
  '/api/admin/contact-messages': 2 * 1024,
}

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

  const scriptSources = [
    "'self'",
    "'unsafe-inline'",
    ...(process.env.NODE_ENV === 'development' ? ["'unsafe-eval'"] : []),
    'https://vercel.live',
    'https://va.vercel-scripts.com',
  ].join(' ')

  const cspHeader = [
    "default-src 'self'",
    `script-src ${scriptSources}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://vitals.vercel-analytics.com https://va.vercel-scripts.com",
    "frame-src 'self' https://vercel.live",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')

  response.headers.set('Content-Security-Policy', cspHeader)

  return response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
    const maxBodyBytes = API_BODY_LIMITS[pathname]
    const contentLength = request.headers.get('content-length')
    if (contentLength !== null && maxBodyBytes) {
      const declaredBytes = Number(contentLength)
      if (!Number.isSafeInteger(declaredBytes) || declaredBytes < 0) {
        return addSecurityHeaders(NextResponse.json({ error: 'Taille de requête invalide.' }, { status: 400 }))
      }
      if (declaredBytes > maxBodyBytes) {
        return addSecurityHeaders(NextResponse.json({ error: 'Requête trop volumineuse.' }, { status: 413 }))
      }
    }
  }

  if (request.method === 'POST' || request.method === 'GET') {
    const rule = request.method === 'GET'
      ? PUBLIC_API_GET_RATE_LIMITS[pathname]
      : PUBLIC_API_RATE_LIMITS[pathname]
    if (rule) {
      const rateLimit = consumeRateLimit(`${request.method}:${pathname}:${getClientIp(request)}`, rule.limit, rule.windowMs)
      if (!rateLimit.allowed) {
        const response = NextResponse.json(
          { success: false, error: 'RATE_LIMITED', message: 'Trop de tentatives. Réessayez plus tard.' },
          { status: 429 },
        )
        response.headers.set('Retry-After', String(rateLimit.retryAfterSeconds))
        response.headers.set('Cache-Control', 'no-store')
        return addSecurityHeaders(response)
      }
    }
  }

  if (pathname.includes('..') || pathname.includes('<') || pathname.includes('>')) {
    return new NextResponse('Bad Request', { status: 400 })
  }

  const { user, response, supabase } = await updateSession(request)

  const isPrivateMutation =
    ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method) &&
    (pathname.startsWith('/api/user') || pathname.startsWith('/api/admin'))
  if (isPrivateMutation) {
    const origin = request.headers.get('origin')
    const fetchSite = request.headers.get('sec-fetch-site')
    let invalidOrigin = false
    if (origin) {
      try {
        invalidOrigin = new URL(origin).origin !== request.nextUrl.origin
      } catch {
        invalidOrigin = true
      }
    }
    if (invalidOrigin || fetchSite === 'cross-site') {
      return addSecurityHeaders(NextResponse.json(
        { success: false, error: 'INVALID_ORIGIN', message: 'Origine de requête refusée.' },
        { status: 403 },
      ))
    }
  }

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
