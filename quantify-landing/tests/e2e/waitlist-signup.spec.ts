// ============================================
// tests/e2e/waitlist-signup.spec.ts - Tests E2E inscription waitlist
// ============================================

import { test, expect, Page } from '@playwright/test'

// Helper pour remplir le formulaire de waitlist
async function fillWaitlistForm(page: Page, data: {
  email: string
  phone?: string
  fullName: string
  country: string
  userType: string
  referralCode?: string
}) {
  await page.fill('[data-testid="email-input"]', data.email)
  
  if (data.phone) {
    await page.fill('[data-testid="phone-input"]', data.phone)
  }
  
  await page.fill('[data-testid="fullname-input"]', data.fullName)
  
  // Sélectionner le pays
  await page.click('[data-testid="country-select"]')
  await page.click(`[data-value="${data.country}"]`)
  
  // Sélectionner le type d'utilisateur
  await page.click('[data-testid="usertype-select"]')
  await page.click(`[data-value="${data.userType}"]`)
  
  // Code de parrainage si fourni
  if (data.referralCode) {
    await page.fill('[data-testid="referral-input"]', data.referralCode)
  }
  
  // Accepter les conditions
  await page.check('[data-testid="accept-terms"]')
}

test.describe('Waitlist Signup Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Quantify/)
  })

  test('should display landing page correctly', async ({ page }) => {
    // Vérifier les éléments principaux de la landing page
    await expect(page.locator('h1')).toContainText('L\'appli pour')
    await expect(page.locator('h1')).toContainText('mieux gérer votre énergie')
    
    // Vérifier la présence du bouton CTA principal
    const ctaButton = page.locator('[data-testid="main-cta-button"]')
    await expect(ctaButton).toBeVisible()
    await expect(ctaButton).toContainText('Créer mon compte gratuit')
    
    // Vérifier les statistiques
    await expect(page.locator('[data-testid="user-count"]')).toBeVisible()
    await expect(page.locator('[data-testid="target-users"]')).toContainText('200K')
    
    // Vérifier les sections importantes
    await expect(page.locator('[data-testid="problem-section"]')).toBeVisible()
    await expect(page.locator('[data-testid="solution-section"]')).toBeVisible()
    await expect(page.locator('[data-testid="features-section"]')).toBeVisible()
  })

  test('should open waitlist modal when CTA is clicked', async ({ page }) => {
    // Cliquer sur le CTA principal
    await page.click('[data-testid="main-cta-button"]')
    
    // Vérifier que la modal s'ouvre
    const modal = page.locator('[data-testid="waitlist-modal"]')
    await expect(modal).toBeVisible()
    
    // Vérifier le contenu de la modal
    await expect(page.locator('[data-testid="modal-title"]')).toContainText('Rejoindre la liste d\'attente')
    await expect(page.locator('[data-testid="waitlist-form"]')).toBeVisible()
  })

  test('should successfully submit waitlist form with valid data', async ({ page }) => {
    // Intercepter la requête API
    await page.route('**/api/waitlist', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              id: 'wl_test_123',
              email: 'test@example.com',
              position: 1
            },
            position: 1,
            referralCode: 'TESTREF1',
            estimatedLaunchDate: '2025-03-01T00:00:00Z',
            message: 'Inscription réussie !'
          })
        })
      }
    })

    // Ouvrir la modal
    await page.click('[data-testid="main-cta-button"]')
    
    // Remplir le formulaire
    await fillWaitlistForm(page, {
      email: 'test@example.com',
      phone: '+22893131874',
      fullName: 'John Doe Test',
      country: 'TG',
      userType: 'particulier'
    })
    
    // Soumettre le formulaire
    await page.click('[data-testid="submit-waitlist-btn"]')
    
    // Vérifier le succès
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Inscription réussie')
    await expect(page.locator('[data-testid="position-display"]')).toContainText('Position: 1')
    await expect(page.locator('[data-testid="referral-code"]')).toContainText('TESTREF1')
  })

  test('should handle form validation errors', async ({ page }) => {
    // Ouvrir la modal
    await page.click('[data-testid="main-cta-button"]')
    
    // Essayer de soumettre un formulaire vide
    await page.click('[data-testid="submit-waitlist-btn"]')
    
    // Vérifier les messages d'erreur
    await expect(page.locator('[data-testid="email-error"]')).toContainText('Email requis')
    await expect(page.locator('[data-testid="fullname-error"]')).toContainText('Nom complet requis')
    await expect(page.locator('[data-testid="country-error"]')).toContainText('Pays requis')
    await expect(page.locator('[data-testid="terms-error"]')).toContainText('Vous devez accepter les conditions')
  })

  test('should validate email format', async ({ page }) => {
    // Ouvrir la modal
    await page.click('[data-testid="main-cta-button"]')
    
    // Entrer un email invalide
    await page.fill('[data-testid="email-input"]', 'invalid-email')
    await page.blur('[data-testid="email-input"]')
    
    // Vérifier l'erreur
    await expect(page.locator('[data-testid="email-error"]')).toContainText('Format d\'email invalide')
  })

  test('should handle duplicate email error', async ({ page }) => {
    // Intercepter la requête API pour simuler un email dupliqué
    await page.route('**/api/waitlist', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 409,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: 'EMAIL_EXISTS',
            message: 'Cet email est déjà inscrit sur la liste d\'attente'
          })
        })
      }
    })

    await page.click('[data-testid="main-cta-button"]')
    
    await fillWaitlistForm(page, {
      email: 'existing@example.com',
      fullName: 'Existing User',
      country: 'TG',
      userType: 'particulier'
    })
    
    await page.click('[data-testid="submit-waitlist-btn"]')
    
    // Vérifier le message d'erreur
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Cet email est déjà inscrit')
  })

  test('should handle referral code correctly', async ({ page }) => {
    // Intercepter pour simuler un parrainage valide
    await page.route('**/api/waitlist', async (route) => {
      if (route.request().method() === 'POST') {
        const body = await route.request().postDataJSON()
        if (body.referredBy === 'VALIDREF') {
          await route.fulfill({
            status: 201,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              data: { id: 'wl_123', position: 50 },
              position: 50,
              referralCode: 'NEWREF123',
              message: 'Inscription réussie avec parrainage !'
            })
          })
        }
      }
    })

    await page.click('[data-testid="main-cta-button"]')
    
    await fillWaitlistForm(page, {
      email: 'referred@example.com',
      fullName: 'Referred User',
      country: 'TG',
      userType: 'particulier',
      referralCode: 'VALIDREF'
    })
    
    await page.click('[data-testid="submit-waitlist-btn"]')
    
    // Vérifier le succès avec bonus de parrainage
    await expect(page.locator('[data-testid="success-message"]')).toContainText('parrainage')
    await expect(page.locator('[data-testid="position-display"]')).toContainText('50')
  })

  test('should close modal when clicking outside or on close button', async ({ page }) => {
    // Ouvrir la modal
    await page.click('[data-testid="main-cta-button"]')
    await expect(page.locator('[data-testid="waitlist-modal"]')).toBeVisible()
    
    // Fermer en cliquant sur le bouton fermer
    await page.click('[data-testid="close-modal-btn"]')
    await expect(page.locator('[data-testid="waitlist-modal"]')).toBeHidden()
    
    // Rouvrir la modal
    await page.click('[data-testid="main-cta-button"]')
    await expect(page.locator('[data-testid="waitlist-modal"]')).toBeVisible()
    
    // Fermer en cliquant à l'extérieur (sur l'overlay)
    await page.click('[data-testid="modal-overlay"]', { position: { x: 10, y: 10 } })
    await expect(page.locator('[data-testid="waitlist-modal"]')).toBeHidden()
  })

  test('should handle loading states correctly', async ({ page }) => {
    // Intercepter pour simuler une réponse lente
    let resolveRequest: (value: any) => void
    const requestPromise = new Promise(resolve => {
      resolveRequest = resolve
    })

    await page.route('**/api/waitlist', async (route) => {
      await requestPromise
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { id: 'wl_123', position: 1 }
        })
      })
    })

    await page.click('[data-testid="main-cta-button"]')
    
    await fillWaitlistForm(page, {
      email: 'loading@example.com',
      fullName: 'Loading User',
      country: 'TG',
      userType: 'particulier'
    })
    
    // Cliquer pour soumettre
    await page.click('[data-testid="submit-waitlist-btn"]')
    
    // Vérifier l'état de chargement
    await expect(page.locator('[data-testid="submit-waitlist-btn"]')).toBeDisabled()
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible()
    
    // Résoudre la requête
    resolveRequest!(null)
    
    // Vérifier que le chargement disparaît
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeHidden()
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
  })

  test('should work on mobile viewport', async ({ page }) => {
    // Définir un viewport mobile
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('/')
    
    // Vérifier que la landing page est responsive
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('[data-testid="main-cta-button"]')).toBeVisible()
    
    // Ouvrir la modal
    await page.click('[data-testid="main-cta-button"]')
    
    // Vérifier que la modal est bien affichée sur mobile
    const modal = page.locator('[data-testid="waitlist-modal"]')
    await expect(modal).toBeVisible()
    
    // Le formulaire doit être accessible
    await expect(page.locator('[data-testid="waitlist-form"]')).toBeVisible()
    
    // Tester le scroll si nécessaire
    await page.fill('[data-testid="email-input"]', 'mobile@example.com')
    await expect(page.locator('[data-testid="email-input"]')).toHaveValue('mobile@example.com')
  })

  test('should handle keyboard navigation', async ({ page }) => {
    await page.click('[data-testid="main-cta-button"]')
    
    // Tester la navigation au clavier
    await page.keyboard.press('Tab') // Focus sur email
    await page.keyboard.type('keyboard@example.com')
    
    await page.keyboard.press('Tab') // Focus sur téléphone
    await page.keyboard.type('+22893131874')
    
    await page.keyboard.press('Tab') // Focus sur nom
    await page.keyboard.type('Keyboard User')
    
    // Vérifier que les valeurs sont correctement saisies
    await expect(page.locator('[data-testid="email-input"]')).toHaveValue('keyboard@example.com')
    await expect(page.locator('[data-testid="phone-input"]')).toHaveValue('+22893131874')
    await expect(page.locator('[data-testid="fullname-input"]')).toHaveValue('Keyboard User')
  })
})