<template>
  <div v-if="visible" class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Доступные игроки</h3>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>
      
      <div class="players-list">
        <div v-for="player in players" :key="player.id" class="player-card" @click="selectPlayer(player)">
          <img :src="player.t_shirt" :alt="player.surname" class="player-shirt">
          <div class="player-info">
            <span class="player-name">{{ player.surname }}</span>
            <span class="player-position">{{ getPositionLabel(player.position) }}</span>
            <span class="player-cost">{{ player.cost }}M</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: Boolean,
  players: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'select'])

// Добавляем watch для отладки
watch(() => props.players, (newPlayers) => {
  console.log('Получен новый список игроков:', newPlayers)
}, { immediate: true })

const getPositionLabel = (position) => {
  const labels = {
    'gkp': 'Вратарь',
    'def': 'Защитник',
    'mid': 'Полузащитник',
    'fwd': 'Нападающий'
  }
  return labels[position.toLowerCase()] || position
}

const selectPlayer = (player) => {
  emit('select', player)
  emit('close')
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
  max-height: 80vh;
  overflow-y: auto;
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

.players-list {
  max-height: 60vh;
  overflow-y: auto;
}

.player-card {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 10px;
}

.player-card:hover {
  background-color: #f5f5f5;
}

.player-shirt {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.player-info {
  display: flex;
  flex-direction: column;
  flex: 1;
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
</style> 