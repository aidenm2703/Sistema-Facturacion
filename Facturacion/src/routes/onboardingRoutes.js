import { WelcomeScreen, BusinessNameScreen, AccountSetup } from '../pages'

export const onboardingSteps = [
  { id: 'welcome', label: 'Bienvenida', Component: WelcomeScreen },
  { id: 'empresa', label: 'Nombre de la empresa', Component: BusinessNameScreen },
  { id: 'cuenta', label: 'Cuenta de administrador', Component: AccountSetup },
]

export function getOnboardingStep(id) {
  return onboardingSteps.find((s) => s.id === id) || null
}