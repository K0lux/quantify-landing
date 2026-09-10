// ============================================
// lib/analytics/events.ts
// ============================================
/*export const trackEvent = (eventName: string, properties?: Record<string, unknown>) => 
    
    {
  // Google Analytics
  if (typeof window !== 'undefined' && (window as unknown).gtag) {
    (window as unknown).gtag('event', eventName, properties)
  }

  // Facebook Pixel
  if (typeof window !== 'undefined' && (window as unknown).fbq) {
    (window as unknown).fbq('trackCustom', eventName, properties)
  }

  // Console log en dev
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', eventName, properties)
  }
}

export const AnalyticsEvents = {
  // Waitlist
  WAITLIST_OPENED: 'waitlist_opened',
  WAITLIST_SUBMITTED: 'waitlist_submitted',
  WAITLIST_SUCCESS: 'waitlist_success',
  WAITLIST_ERROR: 'waitlist_error',
  
  // Referral
  REFERRAL_COPIED: 'referral_copied',
  REFERRAL_SHARED: 'referral_shared',
  
  // Navigation
  CTA_CLICKED: 'cta_clicked',
  SECTION_VIEWED: 'section_viewed',
  VIDEO_PLAYED: 'video_played',
  
  // Social
  SOCIAL_SHARE: 'social_share',
  NEWSLETTER_SUBSCRIBE: 'newsletter_subscribe',
}
*/

// ============================================
// lib/analytics/events.ts - CORRIGÉ typage
// ============================================

export type AnalyticsProperties = Record<string, string | number | boolean | undefined>;

export const trackEvent = (eventName: string, properties?: AnalyticsProperties) => {
  // Google Analytics
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as Window & { gtag?: (command: string, eventName: string, params?: AnalyticsProperties) => void })
      .gtag?.('event', eventName, properties);
  }

  // Facebook Pixel
  if (typeof window !== 'undefined' && 'fbq' in window) {
    (window as Window & { fbq?: (command: string, eventName: string, params?: AnalyticsProperties) => void })
      .fbq?.('trackCustom', eventName, properties);
  }

  // Console log en dev
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', eventName, properties);
  }
};

export const AnalyticsEvents = {
  // Waitlist
  WAITLIST_OPENED: 'waitlist_opened',
  WAITLIST_SUBMITTED: 'waitlist_submitted',
  WAITLIST_SUCCESS: 'waitlist_success',
  WAITLIST_ERROR: 'waitlist_error',

  // Referral
  REFERRAL_COPIED: 'referral_copied',
  REFERRAL_SHARED: 'referral_shared',

  // Navigation
  CTA_CLICKED: 'cta_clicked',
  SECTION_VIEWED: 'section_viewed',
  VIDEO_PLAYED: 'video_played',

  // Social
  SOCIAL_SHARE: 'social_share',
  NEWSLETTER_SUBSCRIBE: 'newsletter_subscribe',
} as const;
