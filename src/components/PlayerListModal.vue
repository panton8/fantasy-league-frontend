<template>
  <div v-if="visible" class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Выберите игрока</h2>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="players-list">
          <div
            v-for="player in filteredPlayers"
            :key="player.id"
            class="player-item"
            :class="{ 'selected': player.id === selectedPlayerId }"
            @click="selectPlayer(player)"
          >
            <img :src="player.t_shirt" :alt="player.surname" class="player-shirt">
            <div class="player-info">
              <span class="player-name">{{ player.surname }} {{ player.name }}</span>
            </div>
            <div class="player-stats">
              <span class="stat">{{ player.cost }}M</span>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button 
          class="confirm-button" 
          :class="{ 'disabled': !selectedPlayerId }"
          :disabled="!selectedPlayerId"
          @click="confirmSelection"
        >
          Подтвердить выбор
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  visible: Boolean,
  position: String,
  players: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'select'])
const userStore = useUserStore()
const selectedPlayerId = ref(null)

const getPositionLabel = (position) => {
  const labels = {
    'gkp': 'Вратарь',
    'def': 'Защитник',
    'mid': 'Полузащитник',
    'fwd': 'Нападающий'
  }
  return labels[position.toLowerCase()] || position
}

// Получаем список ID игроков, которые уже есть в команде
const teamPlayerIds = computed(() => {
  if (!userStore.profile?.team?.squad) return []
  const ids = []
  Object.values(userStore.profile.team.squad).forEach(players => {
    if (Array.isArray(players)) {
      players.forEach(player => {
        if (player.id) {
          ids.push(player.id)
        }
      })
    }
  })
  return ids
})

// Фильтруем список доступных игроков, исключая тех, кто уже в команде
const filteredPlayers = computed(() => {
  return props.players.filter(player => !teamPlayerIds.value.includes(player.id))
})

const selectPlayer = (player) => {
  selectedPlayerId.value = player.id
}

const confirmSelection = () => {
  if (selectedPlayerId.value) {
    const selectedPlayer = props.players.find(p => p.id === selectedPlayerId.value)
    if (selectedPlayer) {
      emit('select', selectedPlayer)
    }
  }
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
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  max-height: 60vh;
  margin-top: 80px;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border-bottom: 1px solid #eee;
  border-radius: 8px 8px 0 0;
  position: sticky;
  top: 0;
  z-index: 2;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 5px;
  line-height: 1;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-button:hover {
  background-color: #f5f5f5;
  color: #333;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.players-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.player-item {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.player-item:hover {
  background-color: #f5f5f5;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.player-item.selected {
  border-color: #00c48c;
  background-color: #f0fff9;
  box-shadow: 0 2px 8px rgba(0, 196, 140, 0.2);
}

.player-shirt {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.player-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.player-name {
  font-weight: bold;
  font-size: 1.1em;
}

.player-stats {
  display: flex;
  gap: 10px;
  align-items: center;
}

.stat {
  color: #00c48c;
  font-weight: bold;
  font-size: 1.1em;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: center;
  background: white;
  border-radius: 0 0 8px 8px;
}

.confirm-button {
  background-color: #00c48c;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 200px;
}

.confirm-button:hover:not(.disabled) {
  background-color: #00a87a;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 196, 140, 0.2);
}

.confirm-button.disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style> 