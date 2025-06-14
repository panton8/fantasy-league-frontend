<template>
  <div v-if="visible" class="popup-modal-overlay" @click.self="close">
    <div class="popup-modal-content">
      <slot>{{ message }}</slot>
      <button class="popup-modal-btn" @click="close">OK</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
const props = defineProps({
  visible: Boolean,
  message: String
})
const emit = defineEmits(['close'])
function close() {
  emit('close')
}
</script>

<style scoped>
.popup-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.popup-modal-content {
  background: #fff;
  padding: 2rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  min-width: 280px;
  text-align: center;
  font-size: 1.1rem;
}
.popup-modal-btn {
  margin-top: 1.5rem;
  padding: 0.5rem 1.5rem;
  background: #1e3c72;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}
.popup-modal-btn:hover {
  background: #3056a3;
}
</style> 