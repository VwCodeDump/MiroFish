<template>
  <div class="auto-advance-toggle">
    <button 
      class="toggle-btn"
      :class="{ 'is-active': isAutoAdvance }"
      @click="toggleAutoAdvance"
      :title="isAutoAdvance ? $t('main.autoAdvanceOnDesc') : $t('main.autoAdvanceOffDesc')"
    >
      <span class="pulse-indicator" :class="{ 'active': isAutoAdvance }"></span>
      <span class="icon">⚡</span>
      <span class="label">{{ isAutoAdvance ? $t('main.autoAdvanceOn') : $t('main.autoAdvanceOff') }}</span>
    </button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { isAutoAdvance, toggleAutoAdvance } from '../store/autoAdvance'

const { t } = useI18n()
</script>

<style scoped>
.auto-advance-toggle {
  display: inline-flex;
  align-items: center;
}

.toggle-btn {
  background: transparent;
  color: #666;
  border: 1px solid #DCDCDC;
  border-radius: 4px;
  padding: 4px 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.76rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  user-select: none;
}

.toggle-btn:hover {
  border-color: #999;
  color: #333;
}

.toggle-btn.is-active {
  background: #FFF7ED;
  border-color: #FDBA74;
  color: #C2410C;
}

.toggle-btn.is-active:hover {
  border-color: #FB923C;
  background: #FFEDD5;
}

.pulse-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #A8A29E;
  display: inline-block;
  transition: background 0.2s;
}

.pulse-indicator.active {
  background: #EA580C;
  box-shadow: 0 0 6px rgba(234, 88, 12, 0.6);
  animation: pulse-dot 1.8s infinite;
}

@keyframes pulse-dot {
  0% { transform: scale(0.9); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.8; }
}

.icon {
  font-size: 0.72rem;
  line-height: 1;
}

.label {
  letter-spacing: 0.02em;
}
</style>

