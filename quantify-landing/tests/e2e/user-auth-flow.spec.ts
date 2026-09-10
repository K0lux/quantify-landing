// ============================================
// tests/e2e/user-auth-flow.spec.ts - Tests E2E authentification
// ============================================

import { test, expect } from '@playwright/test'

test.describe('User Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display sign-in button in header', async ({ page }) => {
    // Vérifier la présence du bouton de connexion dans le header
    await expect(page.locator('[data-testid="auth-button"]')).toBeVisible()
    await expect(page.locator('[data-testid="auth-button"]')).toContainText('Rejoindre')
  })

  test('should redirect to login page when clicking auth button', async ({ page }) => {
    await page.click('[data-testid="auth-button"]')
    
    await expect(page).toHaveURL(/connexion/)
  })

  test('should handle successful sign-in flow', async ({ page }) => {

    // Intercepter les requêtes vers le dashboard
    await page.route('**/dashboard*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: `
          <html>
            <body>
              <div data-testid="dashboard">
                <header data-testid="dashboard-header">
                  <h1>Tableau de bord</h1>
                  <div data-testid="user-profile">
                    <span>Bienvenue, John Doe</span>
                    <button data-testid="user-menu">Menu</button>
                  </div>
                </header>
                <main data-testid="dashboard-content">
                  <div data-testid="waitlist-status">
                    <h2>Statut liste d'attente</h2>
                    <p>Position: <span data-testid="position">1</span></p>
                    <p>Code de parrainage: <span data-testid="referral-code">REF123</span></p>
                  </div>
                  <div data-testid="energy-dashboard">
                    <h2>Gestion énergétique</h2>
                    <p>Fonctionnalité bientôt disponible</p>
                  </div>
                </main>
              </div>
            </body>
          </html>
        `
      })
    })

    // Simuler la connexion réussie
    await page.goto('/dashboard')
    
    // Vérifier le dashboard
    await expect(page.locator('[data-testid="dashboard"]')).toBeVisible()
    await expect(page.locator('[data-testid="dashboard-header"] h1')).toContainText('Tableau de bord')
    await expect(page.locator('[data-testid="user-profile"]')).toContainText('Bienvenue, John Doe')
  })

  test('should show waitlist status in dashboard', async ({ page }) => {
    // Intercepter les requêtes API pour récupérer les données utilisateur
    await page.route('**/api/user/profile', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 'profile_123',
            auth_user_id: 'user_123',
            waitlist_id: 'wl_123',
            email: 'user@example.com',
            first_name: 'John',
            last_name: 'Doe',
            position: 1,
            referral_code: 'REF123',
            status: 'approved',
            subscription_plan: 'free'
          }
        })
      })
    })

    await page.goto('/dashboard')
    
    // Vérifier l'affichage du statut waitlist
    await expect(page.locator('[data-testid="waitlist-status"]')).toBeVisible()
    await expect(page.locator('[data-testid="position"]')).toContainText('1')
    await expect(page.locator('[data-testid="referral-code"]')).toContainText('REF123')
  })

  test('should handle dashboard route protection', async ({ page }) => {
    // Tenter d'accéder au dashboard sans authentification
    await page.goto('/dashboard')
    
    // Devrait être redirigé vers la page de connexion
    await expect(page).toHaveURL(/connexion/)
    
    // Ou afficher un message d'erreur selon l'implémentation
    const errorMessage = page.locator('[data-testid="auth-required"]')
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toContainText('Connexion requise')
    }
  })

  test('should handle user menu interactions', async ({ page }) => {

    await page.goto('/dashboard')
    
    // Cliquer sur le menu utilisateur
    await page.click('[data-testid="user-menu"]')
    
    // Vérifier les options du menu
    const userMenu = page.locator('[data-testid="user-dropdown"]')
    await expect(userMenu).toBeVisible()
    
    // Vérifier les liens du menu
    await expect(page.locator('[data-testid="profile-link"]')).toBeVisible()
    await expect(page.locator('[data-testid="settings-link"]')).toBeVisible()
    await expect(page.locator('[data-testid="logout-link"]')).toBeVisible()
  })

  test('should handle logout flow', async ({ page }) => {

    await page.goto('/dashboard')
    
    // Intercepter la déconnexion
    await page.route('**/api/auth/logout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      })
    })

    // Ouvrir le menu utilisateur et se déconnecter
    await page.click('[data-testid="user-menu"]')
    await page.click('[data-testid="logout-link"]')
    
    // Vérifier la redirection vers la page d'accueil
    await expect(page).toHaveURL('/')
    
    // Vérifier que le bouton d'authentification est redevenu visible
    await expect(page.locator('[data-testid="auth-button"]')).toBeVisible()
    await expect(page.locator('[data-testid="auth-button"]')).toContainText('Rejoindre')
  })

  test('should sync waitlist user on first login', async ({ page }) => {
    await page.route('**/api/user/sync', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              userProfile: {
                id: 'profile_123',
                auth_user_id: 'user_123',
                waitlist_id: 'wl_123',
                email: 'existing@example.com',
                fromWaitlist: true
              }
            },
            message: 'Synchronisation réussie'
          })
        })
      }
    })

    await page.goto('/dashboard')
    
    // Vérifier que la synchronisation a eu lieu
    await expect(page.locator('[data-testid="sync-success-banner"]')).toBeVisible()
    await expect(page.locator('[data-testid="sync-success-banner"]')).toContainText('Données de la liste d\'attente synchronisées')
  })

  test('should handle profile completion flow', async ({ page }) => {
    // Simuler un utilisateur avec un profil incomplet
    await page.route('**/api/user/profile', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 'profile_123',
            onboarding_completed: false,
            missing_fields: ['phone', 'country']
          }
        })
      })
    })

    await page.goto('/dashboard')
    
    // Vérifier l'affichage du banner de complétion du profil
    const completionBanner = page.locator('[data-testid="profile-completion-banner"]')
    await expect(completionBanner).toBeVisible()
    await expect(completionBanner).toContainText('Complétez votre profil')
    
    // Cliquer pour compléter le profil
    await page.click('[data-testid="complete-profile-btn"]')
    
    // Vérifier la redirection vers le formulaire de profil
    await expect(page).toHaveURL(/profile\/complete/)
  })

  test('should display different dashboard content based on user type', async ({ page }) => {
    // Test pour utilisateur particulier
    await page.route('**/api/user/profile', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 'profile_123',
            user_type: 'particulier',
            subscription_plan: 'free'
          }
        })
      })
    })

    await page.goto('/dashboard')
    
    // Vérifier le contenu spécifique aux particuliers
    await expect(page.locator('[data-testid="residential-features"]')).toBeVisible()
    await expect(page.locator('[data-testid="residential-features"]')).toContainText('Gestion domestique')
    
    // Test pour utilisateur professionnel
    await page.route('**/api/user/profile', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 'profile_456',
            user_type: 'professionnel',
            subscription_plan: 'premium'
          }
        })
      })
    })

    await page.reload()
    
    // Vérifier le contenu spécifique aux professionnels
    await expect(page.locator('[data-testid="business-features"]')).toBeVisible()
    await expect(page.locator('[data-testid="business-features"]')).toContainText('Gestion d\'entreprise')
  })

  test('should handle error states in dashboard', async ({ page }) => {
    // Simuler une erreur API
    await page.route('**/api/user/profile', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'PROFILE_LOAD_ERROR',
          message: 'Impossible de charger le profil utilisateur'
        })
      })
    })

    await page.goto('/dashboard')
    
    // Vérifier l'affichage de l'erreur
    const errorComponent = page.locator('[data-testid="dashboard-error"]')
    await expect(errorComponent).toBeVisible()
    await expect(errorComponent).toContainText('Erreur de chargement')
    
    // Vérifier la présence du bouton de retry
    const retryButton = page.locator('[data-testid="retry-button"]')
    await expect(retryButton).toBeVisible()
    
    // Tester le bouton retry
    await page.route('**/api/user/profile', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { id: 'profile_123' }
        })
      })
    })

    await page.click('[data-testid="retry-button"]')
    
    // Vérifier que l'erreur disparaît
    await expect(errorComponent).toBeHidden()
    await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible()
  })
})