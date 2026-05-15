// Utilitaire pour jouer des fichiers audio
// Les fichiers ne sont pas encore créés — les boutons afficheront un feedback visuel

let currentAudio = null

const normalizeAudioPath = (path) => {
  if (!path || typeof path !== 'string') return path
  if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('/')) {
    return path
  }
  return `/${path.replace(/^\/+/, '')}`
}

const enhanceArabicText = (text) => {
  if (!text) return ''
  return text.split(' ').map(word => {
    const core = word.replace(/\u0640/g, '')
    if (core.length === 1 && core >= '\u0621' && core <= '\u064A') {
      return core + '\u064E'
    }
    return word
  }).join(' . ')
}

const getBestArabicVoice = () => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices()
  const premium = voices.find(v => v.lang.includes('ar-SA') || v.lang.includes('ar-AE') || v.name.includes('Google') || v.name.includes('Maged') || v.name.includes('Tarik'))
  if (premium) return premium
  return voices.find(v => v.lang.startsWith('ar')) || null
}

function speakFallback(text) {
  if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) return
  
  // Ensure we are truly starting fresh
  window.speechSynthesis.cancel()
  
  const enhancedText = enhanceArabicText(text)
  const utterance = new SpeechSynthesisUtterance(enhancedText)
  
  const bestVoice = getBestArabicVoice()
  if (bestVoice) {
    utterance.voice = bestVoice
    utterance.lang = bestVoice.lang
  } else {
    utterance.lang = 'ar-SA'
  }
  
  utterance.rate = 0.75 // Slower for better clarity
  utterance.pitch = 1.1
  
  // Bug fix for some browsers: wait a tiny bit after cancel
  setTimeout(() => {
    window.speechSynthesis.speak(utterance)
  }, 50)
}

export function playAudio(path, fallbackText = '') {
  try {
    // 1. Stop Speech Synthesis immediately
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }

    // 2. Stop any existing audio file
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.onended = null
      currentAudio.onerror = null
      currentAudio = null
    }

    const normalizedPath = normalizeAudioPath(path)
    if (!normalizedPath) {
      speakFallback(fallbackText)
      return
    }

    // 3. Create and play new audio
    const audio = new Audio(normalizedPath)
    audio.preload = 'auto'
    currentAudio = audio

    const playPromise = audio.play()
    
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn("Audio file play failed, using fallback:", error)
        speakFallback(fallbackText)
      })
    }

    // Handle case where audio loads but then fails
    audio.onerror = () => {
      console.warn("Audio file error, using fallback")
      speakFallback(fallbackText)
    }

  } catch (e) {
    console.error("Global audio error:", e)
    speakFallback(fallbackText)
  }
}

export function stopAudio() {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
    currentAudio = null
  }
}
