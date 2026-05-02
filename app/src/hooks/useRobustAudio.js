import { useState, useEffect, useRef, useCallback } from 'react'

const normalizeAudioPath = (path) => {
  if (!path || typeof path !== 'string') return path
  if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('/')) {
    return path
  }
  return `/${path.replace(/^\/+/, '')}`
}

/**
 * Hook pour la gestion robuste de l'audio pédagogique
 * Gère le chargement, les erreurs et la synchronisation
 */
export const useRobustAudio = (url, fallbackText = '') => {
  const [status, setStatus] = useState('idle') // idle, loading, ready, error, playing
  const [error, setError] = useState(null)
  const audioRef = useRef(null)

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setStatus('ready')
    }
    // Arrêter aussi le TTS au cas où
    if (window.speechSynthesis) window.speechSynthesis.cancel()
  }, [])

  const play = useCallback(() => {
    if (status === 'error' || !url) {
      // Fallback TTS si pas de fichier
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
        const u = new SpeechSynthesisUtterance(fallbackText)
        u.lang = 'ar'
        u.rate = 0.7
        u.onstart = () => setStatus('playing')
        u.onend = () => setStatus('ready')
        window.speechSynthesis.speak(u)
      }
      return
    }

    if (audioRef.current) {
      // Arrêter toute synthèse vocale avant de lancer le fichier
      if (window.speechSynthesis) window.speechSynthesis.cancel()
      
      setStatus('playing')
      audioRef.current.play().catch(err => {
        console.error('Audio play error:', err)
        setStatus('error')
        // Tentative de fallback TTS en cas d'échec de lecture
        if (window.speechSynthesis) {
          const u = new SpeechSynthesisUtterance(fallbackText)
          u.lang = 'ar'
          window.speechSynthesis.speak(u)
        }
      })
    }
  }, [status, url, fallbackText])

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

    // Charger explicitement
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
