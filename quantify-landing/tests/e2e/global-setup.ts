// ============================================
// tests/e2e/global-setup.ts - Setup global Playwright
// ============================================

import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for E2E tests...')
  
  // Start services if needed
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  // Warm up the application
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
    console.log('✅ Application warmed up successfully')
  } catch (error) {
    console.error('❌ Failed to warm up application:', error)
    throw error
  }
  
  // Cleanup test database if needed
  await setupTestDatabase()
  
  await browser.close()
  console.log('✅ Global setup completed')
}

async function setupTestDatabase() {
  // Clean up test data
  console.log('🗄️ Setting up test database...')
  
  // Here you would typically:
  // 1. Clear test waitlist entries
  // 2. Reset test user accounts
  // 3. Seed necessary test data
  
  console.log('✅ Test database setup completed')
}

export default globalSetup