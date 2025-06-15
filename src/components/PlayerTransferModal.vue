<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Трансфер игрока</h3>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>
      
      <div class="current-player">
        <div class="player-card">
          <img :src="player.t_shirt" :alt="player.surname" class="player-shirt">
          <div class="player-info">
            <span class="player-name">{{ player.surname }}</span>
            <span class="player-position">{{ getPositionLabel(player.position) }}</span>
            <span class="player-cost">{{ player.cost }}M</span>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button 
          class="transfer-button" 
          @click="$emit('initiate-player-selection')"
        >
          Совершить трансфер
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  player: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'initiate-player-selection'])

const getPositionLabel = (position) => {
  const labels = {
    'gkp': 'Вратарь',
    'def': 'Защитник',
    'mid': 'Полузащитник',
    'fwd': 'Нападающий'
  }
  return labels[position.toLowerCase()] || position
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.current-player {
  margin-bottom: 20px;
  text-align: center;
}

.player-card {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  text-align: center;
}

.player-shirt {
  width: 100%;
  height: auto;
  max-height: 120px;
  object-fit: contain;
}

.player-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}

.player-name {
  font-weight: bold;
}

.player-position {
  color: #666;
  font-size: 0.9em;
}

.player-cost {
  color: #00c48c;
  font-weight: bold;
  font-size: 0.9em;
  margin-top: 5px;
}

.modal-footer {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.transfer-button {
  background-color: #00c48c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  min-width: 150px;
}

.transfer-button:hover {
  background-color: #00a67a;
}
</style> 