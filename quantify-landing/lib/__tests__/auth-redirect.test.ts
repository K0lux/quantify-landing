import { getLocalRedirectPath } from '@/lib/auth-redirect'

describe('getLocalRedirectPath', () => {
  it('accepts a local path with query parameters', () => {
    expect(getLocalRedirectPath('/dashboard/stats?period=month')).toBe('/dashboard/stats?period=month')
  })

  it.each([
    'https://example.com',
    '//example.com',
    '/\\example.com',
  ])('uses the fallback for an unsafe destination: %s', (value) => {
    expect(getLocalRedirectPath(value)).toBe('/dashboard')
  })

  it('uses the supplied fallback when the destination is missing', () => {
    expect(getLocalRedirectPath(null, '/compte')).toBe('/compte')
  })
})
