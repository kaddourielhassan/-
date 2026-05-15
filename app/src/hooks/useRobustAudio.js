import { useState, useEffect, useRef, useCallback } from 'react'

const normalizeAudioPath = (path) => {
  if (!path || typeof path !== 'string') return path
  if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('/')) {
    return path
  }
  return `/${path.replace(/^\/+/, '')}`
}

/**
 * Optimise le texte arabe pour une prononciation claire par la synthèse vocale (TTS).
 * Ajoute une "Fatha" (َ) sur les lettres uniques pour que l'enfant entende le son (ex: "ba") 
 * plutôt que le nom de la lettre (ex: "baa").
 */
const enhanceArabicText = (text) => {
  if (!text) return ''
  return text.split(' ').map(word => {
    // Retirer le Tatweel (ـ) pour l'analyse
    const core = word.replace(/\u0640/g, '')
    // Si c'est une lettre arabe seule (sans voyelle)
    if (core.length === 1 && core >= '\u0621' && core <= '\u064A') {
      return core + '\u064E' // Ajoute la Fatha
    }
    return word
  }).join(' . ') // Ajoute une petite pause entre les mots/lettres
}

/**
 * Recherche la meilleure voix arabe disponible dans le navigateur.
 * Privilégie les voix d'Arabie Saoudite (ar-SA) ou des EAU (ar-AE) qui sont souvent de meilleure qualité.
 */
const getBestArabicVoice = () => {
  if (!window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices()
  const premium = voices.find(v => v.lang.includes('ar-SA') || v.lang.includes('ar-AE') || v.name.includes('Google') || v.name.includes('Maged') || v.name.includes('Tarik'))
  if (premium) return premium
  return voices.find(v => v.lang.startsWith('ar')) || null
}

/**
 * Hook pour la gestion robuste de l'audio pédagogique
 * Gère le chargement, les erreurs, la synchronisation et propose une synthèse vocale (TTS) Premium en fallback.
 */
export const useRobustAudio = (url, fallbackText = '') => {
  const [status, setStatus] = useState('idle') // idle, loading, ready, error, playing
  const [error, setError] = useState(null)
  const audioRef = useRef(null)

  // Pré-charger les voix pour éviter le délai au premier clic (spécificité de Chrome)
  useEffect(() => {
    if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices()
    }
  }, [])

  const speakTTS = useCallback((text) => {
    if (!window.speechSynthesis || !text) return false
    
    window.speechSynthesis.cancel() // Stop any current audio
    
    const enhancedText = enhanceArabicText(text)
    const utterance = new SpeechSynthesisUtterance(enhancedText)
    
    const bestVoice = getBestArabicVoice()
    if (bestVoice) {
      utterance.voice = bestVoice
      utterance.lang = bestVoice.lang
    } else {
      utterance.lang = 'ar-SA' // Fallback forcé
    }
    
    // Réglages optimisés pour les enfants : plus lent et très clair
    utterance.rate = 0.75 
    utterance.pitch = 1.1 
    
    utterance.onstart = () => setStatus('playing')
    utterance.onend = () => setStatus('ready')
    utterance.onerror = (e) => {
      console.warn('TTS Error:', e)
      setStatus('ready')
    }
    
    window.speechSynthesis.speak(utterance)
    return true
  }, [])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setStatus('ready')
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel()
  }, [])

  const play = useCallback(() => {
    if (status === 'error' || !url) {
      speakTTS(fallbackText)
      return
    }

    if (audioRef.current) {
      if (window.speechSynthesis) window.speechSynthesis.cancel()
      
      setStatus('playing')
      audioRef.current.play().catch(err => {
        console.warn('Audio play error, fallback to TTS:', err)
        setStatus('error')
        speakTTS(fallbackText)
      })
    }
  }, [status, url, fallbackText, speakTTS])

  useEffect(() => {
    if (!url) return

    const normalizedUrl = normalizeAudioPath(url)
    setStatus('loading')
    const audio = new Audio(normalizedUrl)
    audio.preload = 'auto'
    audioRef.current = audio

    const handleCanPlay = () => setStatus('ready')
    const handleError = (e) => {
      console.warn(`Erreur de chargement audio (${normalizedUrl}):`, e)
      setStatus('error')
      setError(e)
    }
    const handleEnded = () => setStatus('ready')

    audio.addEventListener('canplaythrough', handleCanPlay)
    audio.addEventListener('error', handleError)
    audio.addEventListener('ended', handleEnded)

    audio.load()

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('ended', handleEnded)
      audio.pause()
      audioRef.current = null
    }
  }, [url])

  return { status, error, play, stop }
}
