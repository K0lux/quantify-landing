// ============================================
// lib/email/templates.ts
// ============================================
export const waitlistWelcomeEmail = (data: {
  fullName: string
  position: number
  referralCode: string
}) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue sur Quantify</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F9FAFB; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #FBBF24 0%, #F97316 100%); padding: 40px 20px; text-align: center; border-radius: 12px;">
      <h1 style="color: white; margin: 0; font-size: 32px;">🎉 Bienvenue sur Quantify !</h1>
    </div>
    
    <div style="padding: 40px 20px; background: white; border-radius: 12px; margin-top: 20px;">
      <p style="font-size: 18px; color: #1F2937;">Bonjour <strong>${data.fullName}</strong>,</p>
      
      <p style="color: #4B5563; line-height: 1.6;">
        Merci de rejoindre la révolution énergétique ! Vous êtes maintenant inscrit(e) sur la liste d'attente de Quantify.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <div style="display: inline-block; background: #FEF3C7; border: 2px solid #FBBF24; padding: 8px 16px; border-radius: 20px; font-weight: bold; color: #92400E; margin-bottom: 10px;">
          Votre position
        </div>
        <div style="font-size: 48px; font-weight: bold; color: #FBBF24; margin: 20px 0;">#${data.position}</div>
      </div>
      
      <div style="background: #F9FAFB; border: 2px solid #E5E7EB; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
        <h2 style="color: #1F2937; margin-top: 0;">📢 Parrainez vos amis !</h2>
        <p style="color: #6B7280;">Remontez de 5 places par parrainage</p>
        <div style="margin: 20px 0;">
          <div style="font-size: 14px; color: #6B7280; margin-bottom: 8px;">Votre code de parrainage</div>
          <div style="font-size: 24px; font-weight: bold; font-family: monospace; color: #1F2937; background: white; padding: 12px; border-radius: 8px; margin: 10px 0;">
            ${data.referralCode}
          </div>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}?ref=${data.referralCode}" style="display: inline-block; background: linear-gradient(135deg, #FBBF24 0%, #F97316 100%); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0;">
          Partager mon lien
        </a>
      </div>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #6B7280; font-size: 14px;">
      <p>© 2025 Quantify - L'Énergie Sous Contrôle</p>
      <p>Made with ❤️ in Togo</p>
    </div>
  </div>
</body>
</html>
  `
}