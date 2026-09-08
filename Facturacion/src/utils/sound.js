const SOUND_KEY = 'aiden-sound'

export function isSoundEnabled() {
  try {
    return localStorage.getItem(SOUND_KEY) !== 'off'
  } catch {
    return true
  }
}

export function setSoundEnabled(on) {
  try {
    localStorage.setItem(SOUND_KEY, on ? 'on' : 'off')
  } catch {
    /* ignore */
  }
}

let audioCtx = null
function ctx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (AC) audioCtx = new AC()
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

// Campanilla de bienvenida (dos notas suaves descendentes).
export function playChime() {
  if (!isSoundEnabled()) return
  const ac = ctx()
  if (!ac) return
  try {
    const now = ac.currentTime
    const notes = [
      { f: 783.99, t: 0, d: 0.22 }, // Sol5
      { f: 587.33, t: 0.16, d: 0.5 }, // Re5
    ]
    notes.forEach(({ f, t, d }) => {
      const osc = ac.createOscillator()
      const gain = ac.createGain()
      osc.type = 'sine'
      osc.frequency.value = f
      gain.gain.setValueAtTime(0.0001, now + t)
      gain.gain.exponentialRampToValueAtTime(0.18, now + t + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + t + d)
      osc.connect(gain)
      gain.connect(ac.destination)
      osc.start(now + t)
      osc.stop(now + t + d + 0.05)
    })
  } catch {
    /* ignore */
  }
}

// Lectura en voz alta (Web Speech API) con voz en español si está disponible.
export function speak(text) {
  if (!isSoundEnabled() || !('speechSynthesis' in window)) return
  try {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'es-ES'
    u.rate = 0.98
    u.pitch = 1.05
    const voices = window.speechSynthesis.getVoices()
    const es = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('es'))
    if (es) u.voice = es
    window.speechSynthesis.speak(u)
  } catch {
    /* ignore */
  }
}

export function stopSpeech() {
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel()
    } catch {
      /* ignore */
    }
  }
}