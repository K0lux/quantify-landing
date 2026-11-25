export function getAuthErrorMessage(code: string | null): string | null {
  switch (code) {
    case 'not_in_waitlist':
      return 'Cette adresse Google n’est pas inscrite sur la waitlist. Inscrivez-vous d’abord à la waitlist.'
    case 'account_already_linked':
      return 'Cette inscription waitlist est déjà liée à un autre compte.'
    case 'google_email_missing':
      return 'Google n’a pas transmis d’adresse email. Vérifiez les autorisations de votre compte Google.'
    case 'google_callback':
      return 'La connexion avec Google n’a pas abouti. Veuillez réessayer.'
    default:
      return null
  }
}
