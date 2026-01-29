/**
 * Accessibility utilities for ARIA attributes and semantic HTML
 */

export const ariaLabels = {
  // Navigation
  mainNav: 'Main navigation',
  mobileMenu: 'Mobile menu',
  skipToContent: 'Skip to main content',
  
  // Forms
  searchInput: 'Search',
  emailInput: 'Email address',
  passwordInput: 'Password',
  submitButton: 'Submit form',
  
  // Buttons
  closeButton: 'Close',
  menuButton: 'Toggle menu',
  backButton: 'Go back',
  
  // Common
  loading: 'Loading',
  error: 'Error',
  success: 'Success',
}

export function getAriaDescribedBy(errorId?: string, hintId?: string): string | undefined {
  const ids = [errorId, hintId].filter(Boolean)
  return ids.length > 0 ? ids.join(' ') : undefined
}

export function getAriaInvalid(error?: string): boolean | undefined {
  return error ? true : undefined
}

