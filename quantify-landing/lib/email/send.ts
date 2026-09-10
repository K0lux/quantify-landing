// ============================================
// lib/email/send.ts
// ============================================
import { Resend } from 'resend'
import { waitlistWelcomeEmail } from './templates'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWaitlistWelcomeEmail(data: {
  email: string
  fullName: string
  position: number
  referralCode: string
}) {
  try {
    await resend.emails.send({
      from: 'Quantify <hello@quantify.app>',
      to: data.email,
      subject: '🎉 Bienvenue sur Quantify - Vous êtes inscrit !',
      html: waitlistWelcomeEmail(data),
    })
  } catch (error) {
    console.error('Error sending welcome email:', error)
  }
}