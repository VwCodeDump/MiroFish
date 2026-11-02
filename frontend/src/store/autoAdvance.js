import { ref } from 'vue'

const STORAGE_KEY = 'mirofish_auto_advance'

const saved = localStorage.getItem(STORAGE_KEY)
// Default to true so everything runs automatically
export const isAutoAdvance = ref(saved !== null ? saved === 'true' : true)

export function setAutoAdvance(val) {
  isAutoAdvance.value = Boolean(val)
  try {
    localStorage.setItem(STORAGE_KEY, String(isAutoAdvance.value))
  } catch (e) {
    console.warn('Failed to save auto advance preference:', e)
  }
}

export function toggleAutoAdvance() {
  setAutoAdvance(!isAutoAdvance.value)
}

