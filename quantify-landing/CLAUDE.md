# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commandes

```bash
npm run dev              # Serveur de développement (Next.js + Turbopack)
npm run build            # Build production
npm run lint             # ESLint
npm test                 # Jest — tests unitaires
npm run test:watch       # Jest en mode watch
npm run test:coverage    # Jest avec rapport de coverage
npm run test:integration # Tests d'intégration
npm run test:e2e         # Playwright e2e
npm run test:all         # Tous les tests
```

Variables d'environnement (`.env.local`) :
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
RESEND_API_KEY=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_FB_PIXEL_ID=
```

---

## Architecture — Next.js 15 App Router

### Structure des routes

```
app/
├── (marketing)/          # Pages publiques — Header/Footer via layout.tsx
│   ├── page.tsx          # Landing principale
│   ├── solution/
│   ├── marche/
│   ├── equipe/
│   └── contact/
├── (auth)/               # Pages d'authentification — layout distinct
│   └── rejoindre/        # Inscription
├── dashboard/            # Zone protégée utilisateur connecté
└── api/                  # Routes API (Server Actions non utilisées ici)
    ├── contact/route.ts
    ├── newsletter/route.ts
    └── waitlist/route.ts
```

Les groupes `(marketing)` et `(auth)` sont des **route groups** Next.js — ils n'affectent pas l'URL, uniquement le layout appliqué.

### `lib/` — services et utilitaires

| Package | Rôle |
|---|---|
| `lib/supabase/` | Client Supabase (browser + server) via `@supabase/ssr` |
| `lib/email/` | Envoi d'emails transactionnels via Resend |
| `lib/validation/` | Schémas Zod partagés entre API routes et composants |
| `lib/rate-limit/` | Rate limiting des API routes (anti-spam formulaires) |
| `lib/seo/` | Helpers pour metadata Next.js (OpenGraph, Twitter cards) |
| `lib/analytics/` | Tracking événements Vercel Analytics |

### Routes API — conventions

Chaque route API (`app/api/*/route.ts`) suit ce pattern :

1. **Rate limiting** en premier (rejette avant tout traitement)
2. **Validation Zod** du body ou query params — retourner `422` si invalide
3. **Logique métier** — appels Supabase ou services externes
4. **Réponse standardisée** `{ success: boolean, data?: T, error?: string }`

```typescript
// app/api/waitlist/route.ts
export async function POST(request: Request) {
  const rateLimit = await checkRateLimit(request)
  if (!rateLimit.ok) return Response.json({ error: 'Too many requests' }, { status: 429 })

  const body = await request.json()
  const parsed = waitlistSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 422 })

  // ... logique Supabase
}
```

### Supabase — tables principales

| Table | Rôle |
|---|---|
| `waitlist` | Inscriptions avec tracking de référral |
| `contact_messages` | Soumissions du formulaire de contact |
| `newsletter_subscribers` | Abonnés newsletter |
| `analytics` | Événements custom |
| `referrals` | Système de parrainage |
| `profiles` | Profils utilisateurs |

Deux clients Supabase distincts :
- **Browser client** (`lib/supabase/client.ts`) : composants client uniquement, clé `anon`
- **Server client** (`lib/supabase/server.ts`) : Server Components et Route Handlers, peut utiliser `service_role` pour les opérations admin

### Composants — organisation

```
components/
├── sections/      # Sections de la landing (Hero, Features, Pricing…)
├── layout/        # Header, Footer, Navigation
├── forms/         # Formulaire de contact (validation côté client + server)
├── waitlist/      # Système de liste d'attente avec referral
├── newsletter/    # Inscription newsletter
├── dashboard/     # Composants de l'espace connecté
└── ui/            # Composants UI génériques (boutons, cards, inputs)
```

---

## CI/CD

### Branches & nommage

```
main                          # production — merge via PR + tag obligatoire
develop                       # intégration continue
staging                       # validation finale

feature/QTF-{issue}-{slug}
fix/QTF-{issue}-{slug}
hotfix/QTF-{issue}-{slug}
release/v{major}.{minor}
chore/QTF-{issue}-{slug}
```

### Pull Requests

Naming : `[TYPE][MODULE] Titre concis` — ex: `[FEAT][MKT] Section pricing avec tableau comparatif`

Limites enforced par CI :
- Max 500 lignes par fichier touché
- Max 300 modifications par fichier
- Max 20 fichiers modifiés (hors générés/lockfiles)
- Doit référencer une issue (`Closes QTF-XXX`)

Reviews : `feature/*` / `fix/*` → 1 reviewer · `hotfix/*` → 2 reviewers · `release/*` → 2 + lead tech

### Pipeline CI (develop)

```
lint (eslint + tsc --noEmit) → test-unit (jest) → test-integration → file-diff-guard → build (next build) → coverage-report (≥70%)
```

### Pipeline staging

```
lint + tests → build → deploy Vercel preview → smoke-tests (Playwright) → notify Slack #quantify-staging
```

### Pipeline production

Déclenché par un tag `v*` sur `main` uniquement. Déploiement sur Vercel production.

```
build → deploy Vercel prod → healthcheck → smoke-prod → notify Slack #quantify-prod
```

### Commits (Conventional Commits)

```
feat(mkt): ajout section pricing avec animation framer-motion
fix(waitlist): correction race condition inscription simultanée
chore(deps): mise à jour next 15.5.3 → 15.5.4

Types  : feat, fix, hotfix, chore, refactor, docs, test, infra, perf
Scopes : mkt, waitlist, contact, newsletter, dashboard, infra, seo
```

### Incidents vs Bugs

| | Bug | Incident |
|---|---|---|
| Branche | `fix/*` depuis `develop` | `hotfix/*` depuis `main` |
| Reviews | 1 reviewer | 2 reviewers |
| Staging | Obligatoire | Optionnel si P1 |
| Post-mortem | Non | Obligatoire P1/P2 (48h) |

---

## Documentation

### Spécifications fonctionnelles

Les features de la landing (système de waitlist, referral, formulaire contact) ont leur spec dans `docs/specs/mkt/F-MKT-{NN}-{slug}.md`. Une PR qui modifie un système fonctionnel sans mettre à jour la spec est rejetée.

### Conventions JSDoc

```typescript
/**
 * Insère un email dans la liste d'attente et attribue un code de référral.
 * Idempotent sur l'email — retourne le profil existant si déjà inscrit.
 *
 * @param email - Email validé par Zod avant appel
 * @param referralCode - Code de parrainage optionnel (QTF-XXXXX)
 * @returns L'entrée waitlist créée ou existante
 * @throws {WaitlistError} Si la contrainte de rate limiting est dépassée
 */
export async function addToWaitlist(email: string, referralCode?: string): Promise<WaitlistEntry>
```

---

## Tests

### Pyramide & seuils

```
E2E (5%) — flux critiques inscription/contact (Playwright)
Intégration (25%) — routes API avec Supabase mocké (MSW)
Unitaires (70%) — validation Zod, utilitaires, hooks
```

Coverage minimum : **70% global** — enforced CI.

### Nommage (Jest)

```typescript
describe('waitlistSchema', () => {
  describe('validation email', () => {
    it('accepte un email valide', () => { ... })
    it('rejette un email sans domaine', () => { ... })
    it('rejette un email avec caractères interdits', () => { ... })
  })
})
```

### Tests unitaires — validation et utilitaires

```typescript
// lib/validation/waitlist.test.ts
describe('waitlistSchema', () => {
  it('valide un email correct avec code referral optionnel', () => {
    const result = waitlistSchema.safeParse({ email: 'user@example.com', referralCode: 'QTF-ABC12' })
    expect(result.success).toBe(true)
  })

  it('rejette si le code referral ne respecte pas le format QTF-XXXXX', () => {
    const result = waitlistSchema.safeParse({ email: 'user@example.com', referralCode: 'invalid' })
    expect(result.success).toBe(false)
  })
})
```

### Tests d'intégration — routes API (MSW)

```typescript
// app/api/waitlist/__tests__/route.test.ts
import { server } from '@/shared/testing/msw-server'
import { http, HttpResponse } from 'msw'

test('POST /api/waitlist — retourne 201 avec email valide', async () => {
  server.use(
    http.post('*/rest/v1/waitlist', () => HttpResponse.json([{ id: 'wl-001' }], { status: 201 }))
  )
  const response = await fetch('/api/waitlist', {
    method: 'POST',
    body: JSON.stringify({ email: 'test@example.com' }),
  })
  expect(response.status).toBe(201)
})

test('POST /api/waitlist — retourne 422 avec email invalide', async () => {
  const response = await fetch('/api/waitlist', {
    method: 'POST',
    body: JSON.stringify({ email: 'not-an-email' }),
  })
  expect(response.status).toBe(422)
})
```

### Tests E2E — flux critiques (Playwright, staging uniquement)

```
E2E-L01 : Landing → formulaire waitlist → confirmation email
E2E-L02 : Landing → formulaire contact → message enregistré
E2E-L03 : Inscription newsletter → confirmation
E2E-L04 : Lien referral → inscription → attribution parrainage
```

```typescript
// e2e/waitlist.spec.ts
test.describe('Flux inscription waitlist [E2E-L01]', () => {
  test('cas nominal — email valide → message de confirmation', async ({ page }) => {
    await page.goto('/')
    await page.fill('[data-testid="waitlist-email"]', 'test@example.com')
    await page.click('[data-testid="waitlist-submit"]')
    await expect(page.locator('[data-testid="waitlist-success"]')).toBeVisible()
  })

  test('email déjà inscrit → message adapté', async ({ page }) => { ... })
  test('rate limit atteint → message d\'erreur', async ({ page }) => { ... })
})
```

### Tests de propriétés (fast-check)

```typescript
import * as fc from 'fast-check'

test('le générateur de codes referral produit toujours des codes uniques au format QTF-XXXXX', () => {
  fc.assert(
    fc.property(fc.integer({ min: 1, max: 1000 }), () => {
      const code = generateReferralCode()
      return /^QTF-[A-Z0-9]{5}$/.test(code)
    })
  )
})
```

### Checks CI enforced

```
lint (eslint + tsc --noEmit) · test-unit (jest) · test-integration · coverage-guard (≥70%)
file-diff-guard · doc-coverage-guard · conventional-commits
# Sur staging : e2e-tests (Playwright)
```
