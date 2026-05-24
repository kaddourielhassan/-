/**
 * Sécurité du PIN enseignant — SHA-256 + compteur de tentatives
 */

const PIN_HASH_KEY = 'hurufi-teacher-pin-hash'
const ATTEMPTS_KEY = 'hurufi-pin-attempts'
const LOCKOUT_KEY = 'hurufi-pin-lockout'
const MAX_ATTEMPTS = 3
const LOCKOUT_MS = 30000 // 30 secondes

/** Hacher un PIN avec SHA-256 + salt */
export async function hashPin(pin) {
  const encoder = new TextEncoder()
  const data = encoder.encode(pin + ':hurufi-salt-2026')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/** Initialiser le PIN par défaut s'il n'existe pas encore */
export async function ensureDefaultPin() {
  const stored = localStorage.getItem(PIN_HASH_KEY)
  if (!stored) {
    const hash = await hashPin('2026')
    localStorage.setItem(PIN_HASH_KEY, hash)
  }
}

/** Vérifier un PIN saisi — retourne un objet avec le résultat */
export async function verifyPin(pin) {
  // Vérifier le verrouillage
  const lockoutUntil = parseInt(localStorage.getItem(LOCKOUT_KEY) || '0')
  if (Date.now() < lockoutUntil) {
    const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000)
    return { success: false, locked: true, remainingSeconds: remaining }
  }

  await ensureDefaultPin()
  const storedHash = localStorage.getItem(PIN_HASH_KEY)
  const inputHash = await hashPin(pin)

  if (inputHash === storedHash) {
    localStorage.setItem(ATTEMPTS_KEY, '0')
    return { success: true }
  }

  // Tentative échouée
  const attempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0') + 1
  localStorage.setItem(ATTEMPTS_KEY, attempts.toString())

  if (attempts >= MAX_ATTEMPTS) {
    localStorage.setItem(LOCKOUT_KEY, (Date.now() + LOCKOUT_MS).toString())
    localStorage.setItem(ATTEMPTS_KEY, '0')
    return { success: false, locked: true, remainingSeconds: LOCKOUT_MS / 1000 }
  }

  return {
    success: false,
    locked: false,
    attemptsLeft: MAX_ATTEMPTS - attempts,
  }
}

/** Changer le PIN (nécessite l'ancien PIN) */
export async function changePin(oldPin, newPin) {
  const result = await verifyPin(oldPin)
  if (!result.success) return { success: false, message: 'الرمز القديم غير صحيح' }
  if (!newPin || newPin.length < 4) return { success: false, message: 'الرمز الجديد قصير جداً (4 أحرف على الأقل)' }

  const hash = await hashPin(newPin)
  localStorage.setItem(PIN_HASH_KEY, hash)
  return { success: true }
}

/** Obtenir le nombre de tentatives restantes */
export function getAttemptsInfo() {
  const lockoutUntil = parseInt(localStorage.getItem(LOCKOUT_KEY) || '0')
  if (Date.now() < lockoutUntil) {
    return { locked: true, remainingSeconds: Math.ceil((lockoutUntil - Date.now()) / 1000) }
  }
  const attempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0')
  return { locked: false, attemptsLeft: MAX_ATTEMPTS - attempts }
}
