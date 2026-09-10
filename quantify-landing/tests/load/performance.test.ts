// ============================================
// tests/load/performance.test.ts - Tests de charge et performance
// ============================================

import { NextRequest } from 'next/server'
import { POST, GET } from '@/app/api/waitlist/route'

// Mock Supabase avec simulation de latence
const mockSupabaseClient = {
  from: jest.fn(),
}

jest.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: () => mockSupabaseClient,
}))

jest.mock('@/lib/auth', () => ({
  getCurrentUser: () => Promise.resolve(null),
}))

// Helper pour simuler la latence réseau
const simulateNetworkDelay = (ms: number) => 
  new Promise(resolve => setTimeout(resolve, ms))

describe('Performance and Load Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock avec latence simulée
    mockSupabaseClient.from = jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          maybeSingle: jest.fn(async () => {
            await simulateNetworkDelay(50) // 50ms de latence
            return Promise.resolve({ data: null, error: null })
          }),
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(async () => {
            await simulateNetworkDelay(100) // 100ms de latence
            return Promise.resolve({ 
              data: {
                id: `wl_${Math.random().toString(36).substring(2)}`,
                email: 'test@example.com',
                position: Math.floor(Math.random() * 1000),
              }, 
              error: null 
            })
          }),
        })),
      })),
    }))
  })

  describe('API Response Time Tests', () => {
    const validFormData = {
      email: 'perf@example.com',
      fullName: 'Performance Test User',
      country: 'TG',
      userType: 'particulier',
      acceptTerms: true,
      acceptMarketing: false,
    }

    it('should respond within 2 seconds under normal load', async () => {
      const startTime = Date.now()
      
      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(validFormData),
      })

      const response = await POST(request)
      const endTime = Date.now()
      
      const responseTime = endTime - startTime
      
      expect(response.status).toBe(201)
      expect(responseTime).toBeLessThan(2000) // Moins de 2 secondes
    })

    it('should handle concurrent requests efficiently', async () => {
      const concurrentRequests = 50
      const maxResponseTime = 5000 // 5 secondes max
      
      const requests = Array.from({ length: concurrentRequests }, (_, i) => {
        const data = {
          ...validFormData,
          email: `user${i}@example.com`
        }
        
        return {
          promise: POST(new NextRequest('http://localhost:3000/api/waitlist', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(data),
          })),
          startTime: Date.now()
        }
      })

      const startTime = Date.now()
      const responses = await Promise.all(requests.map(r => r.promise))
      const totalTime = Date.now() - startTime

      // Vérifier que toutes les requêtes ont réussi
      responses.forEach(response => {
        expect(response.status).toBe(201)
      })

      // Vérifier le temps total
      expect(totalTime).toBeLessThan(maxResponseTime)
      
      // Calculer le débit (requêtes par seconde)
      const throughput = concurrentRequests / (totalTime / 1000)
      expect(throughput).toBeGreaterThan(10) // Au moins 10 req/sec
      
      console.log(`Concurrent requests test:`)
      console.log(`- ${concurrentRequests} requests in ${totalTime}ms`)
      console.log(`- Throughput: ${throughput.toFixed(2)} req/sec`)
    })

    it('should maintain performance under sustained load', async () => {
      const duration = 10000 // 10 secondes
      const requestInterval = 100 // Une requête tous les 100ms
      const maxResponseTime = 3000 // 3 secondes max par requête
      
      const results: { responseTime: number; success: boolean }[] = []
      let requestCount = 0
      
      const endTime = Date.now() + duration
      
      while (Date.now() < endTime) {
        const startTime = Date.now()
        
        try {
          const data = {
            ...validFormData,
            email: `sustained${requestCount}@example.com`
          }
          
          const response = await POST(new NextRequest('http://localhost:3000/api/waitlist', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(data),
          }))
          
          const responseTime = Date.now() - startTime
          
          results.push({
            responseTime,
            success: response.status === 201
          })
          
          requestCount++
          
          // Attendre avant la prochaine requête
          const elapsed = Date.now() - startTime
          if (elapsed < requestInterval) {
            await new Promise(resolve => setTimeout(resolve, requestInterval - elapsed))
          }
          
        } catch (error) {
          results.push({
            responseTime: Date.now() - startTime,
            success: false
          })
        }
      }
      
      // Analyser les résultats
      const successRate = results.filter(r => r.success).length / results.length
      const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length
      const maxActualResponseTime = Math.max(...results.map(r => r.responseTime))
      
      // Assertions
      expect(successRate).toBeGreaterThan(0.95) // 95% de taux de succès
      expect(avgResponseTime).toBeLessThan(1500) // Temps moyen < 1.5s
      expect(maxActualResponseTime).toBeLessThan(maxResponseTime)
      
      console.log(`Sustained load test:`)
      console.log(`- Duration: ${duration}ms`)
      console.log(`- Requests: ${requestCount}`)
      console.log(`- Success rate: ${(successRate * 100).toFixed(2)}%`)
      console.log(`- Avg response time: ${avgResponseTime.toFixed(0)}ms`)
      console.log(`- Max response time: ${maxActualResponseTime}ms`)
    })
  })

  describe('Memory and Resource Usage Tests', () => {
    it('should not leak memory during repeated operations', async () => {
      const iterations = 1000
      const initialMemory = process.memoryUsage()
      
      for (let i = 0; i < iterations; i++) {
        const data = {
          email: `memory${i}@example.com`,
          fullName: `Memory Test User ${i}`,
          country: 'TG',
          userType: 'particulier',
          acceptTerms: true,
          acceptMarketing: false,
        }
        
        const request = new NextRequest('http://localhost:3000/api/waitlist', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(data),
        })

        await POST(request)
        
        // Force garbage collection every 100 iterations
        if (i % 100 === 0 && global.gc) {
          global.gc()
        }
      }
      
      // Force final garbage collection
      if (global.gc) {
        global.gc()
      }
      
      const finalMemory = process.memoryUsage()
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed
      
      // La mémoire ne devrait pas augmenter de plus de 10MB
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024)
      
      console.log(`Memory test:`)
      console.log(`- Initial memory: ${(initialMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`)
      console.log(`- Final memory: ${(finalMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`)
      console.log(`- Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`)
    })
  })

  describe('Error Handling Under Load', () => {
    it('should handle database errors gracefully under load', async () => {
      // Simuler des erreurs intermittentes
      let errorRate = 0
      const targetErrorRate = 0.1 // 10% d'erreurs
      
      mockSupabaseClient.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            maybeSingle: jest.fn(async () => {
              await simulateNetworkDelay(50)
              
              // Simuler des erreurs aléatoirement
              if (Math.random() < targetErrorRate) {
                errorRate++
                return Promise.resolve({ 
                  data: null, 
                  error: { message: 'Database timeout', code: 'TIMEOUT' }
                })
              }
              
              return Promise.resolve({ data: null, error: null })
            }),
          })),
        })),
      }))

      const concurrentRequests = 100
      const requests = Array.from({ length: concurrentRequests }, (_, i) => {
        const data = {
          email: `error${i}@example.com`,
          fullName: `Error Test User ${i}`,
          country: 'TG',
          userType: 'particulier',
          acceptTerms: true,
          acceptMarketing: false,
        }
        
        return POST(new NextRequest('http://localhost:3000/api/waitlist', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(data),
        }))
      })

      const responses = await Promise.all(requests)
      
      // Compter les succès et les erreurs
      const successCount = responses.filter(r => r.status === 201).length
      const errorCount = responses.filter(r => r.status >= 400).length
      
      // Vérifier que l'application gère les erreurs sans crasher
      expect(successCount + errorCount).toBe(concurrentRequests)
      expect(errorCount).toBeGreaterThan(0) // On s'attend à avoir des erreurs
      expect(successCount).toBeGreaterThan(concurrentRequests * 0.8) // Au moins 80% de succès
      
      console.log(`Error handling test:`)
      console.log(`- Total requests: ${concurrentRequests}`)
      console.log(`- Successful: ${successCount}`)
      console.log(`- Errors: ${errorCount}`)
      console.log(`- Success rate: ${(successCount / concurrentRequests * 100).toFixed(2)}%`)
    })
  })

  describe('GET Endpoint Performance', () => {
    it('should serve statistics quickly', async () => {
      const iterations = 100
      const maxResponseTime = 500 // 500ms max
      
      const responseTimes: number[] = []
      
      for (let i = 0; i < iterations; i++) {
        const startTime = Date.now()
        
        const request = new NextRequest('http://localhost:3000/api/waitlist', {
          method: 'GET',
        })

        const response = await GET(request)
        const responseTime = Date.now() - startTime
        
        responseTimes.push(responseTime)
        
        expect(response.status).toBe(200)
        expect(responseTime).toBeLessThan(maxResponseTime)
      }
      
      const avgResponseTime = responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length
      const maxActualResponseTime = Math.max(...responseTimes)
      
      expect(avgResponseTime).toBeLessThan(200) // Temps moyen < 200ms
      
      console.log(`GET endpoint performance:`)
      console.log(`- Iterations: ${iterations}`)
      console.log(`- Avg response time: ${avgResponseTime.toFixed(0)}ms`)
      console.log(`- Max response time: ${maxActualResponseTime}ms`)
    })

    it('should handle concurrent GET requests efficiently', async () => {
      const concurrentGets = 200
      
      const requests = Array.from({ length: concurrentGets }, () => 
        GET(new NextRequest('http://localhost:3000/api/waitlist', {
          method: 'GET',
        }))
      )

      const startTime = Date.now()
      const responses = await Promise.all(requests)
      const totalTime = Date.now() - startTime
      
      // Toutes les requêtes doivent réussir
      responses.forEach(response => {
        expect(response.status).toBe(200)
      })
      
      // Calculer le débit
      const throughput = concurrentGets / (totalTime / 1000)
      expect(throughput).toBeGreaterThan(50) // Au moins 50 req/sec pour GET
      
      console.log(`Concurrent GET requests:`)
      console.log(`- ${concurrentGets} requests in ${totalTime}ms`)
      console.log(`- Throughput: ${throughput.toFixed(2)} req/sec`)
    })
  })

  describe('Stress Testing', () => {
    it('should survive extreme load conditions', async () => {
      const extremeLoad = 500 // 500 requêtes simultanées
      const timeout = 30000 // 30 secondes de timeout
      
      // Augmenter artificiellement la latence pour le test de stress
      mockSupabaseClient.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            maybeSingle: jest.fn(async () => {
              await simulateNetworkDelay(Math.random() * 200) // 0-200ms aléatoire
              return Promise.resolve({ data: null, error: null })
            }),
          })),
        })),
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(async () => {
              await simulateNetworkDelay(Math.random() * 300) // 0-300ms aléatoire
              return Promise.resolve({ 
                data: { id: 'stress_test', position: 1 }, 
                error: null 
              })
            }),
          })),
        })),
      }))

      const requests = Array.from({ length: extremeLoad }, (_, i) => {
        const data = {
          email: `stress${i}@example.com`,
          fullName: `Stress Test User ${i}`,
          country: 'TG',
          userType: 'particulier',
          acceptTerms: true,
          acceptMarketing: false,
        }
        
        return POST(new NextRequest('http://localhost:3000/api/waitlist', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(data),
        }))
      })

      const startTime = Date.now()
      
      // Utiliser Promise.allSettled pour capturer toutes les réponses
      const results = await Promise.allSettled(requests)
      const totalTime = Date.now() - startTime
      
      const fulfilled = results.filter(r => r.status === 'fulfilled').length
      const rejected = results.filter(r => r.status === 'rejected').length
      
      // L'application ne doit pas crasher
      expect(totalTime).toBeLessThan(timeout)
      
      // On tolère quelques échecs sous charge extrême
      const successRate = fulfilled / extremeLoad
      expect(successRate).toBeGreaterThan(0.7) // Au moins 70% de succès
      
      console.log(`Extreme load test:`)
      console.log(`- ${extremeLoad} concurrent requests`)
      console.log(`- Total time: ${totalTime}ms`)
      console.log(`- Fulfilled: ${fulfilled}`)
      console.log(`- Rejected: ${rejected}`)
      console.log(`- Success rate: ${(successRate * 100).toFixed(2)}%`)
    })
  })
})