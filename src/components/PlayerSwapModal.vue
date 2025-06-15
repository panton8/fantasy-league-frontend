<template>
  <div v-if="visible" class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Трансфер игрока</h3>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>
      
      <div class="player-card">
        <img :src="currentPlayer.t_shirt" :alt="currentPlayer.surname" class="player-shirt">
        <div class="player-info">
          <span class="player-name">{{ currentPlayer.surname }}</span>
          <span class="player-position">{{ getPositionLabel(currentPlayer.position) }}</span>
          <span class="player-cost">{{ currentPlayer.cost }}M</span>
        </div>
      </div>

      <div class="modal-footer">
        <button class="transfer-button" @click="handleTransfer">Совершить трансфер</button>
      </div>
    </div>
  </div>

  <PlayerListModal
    :visible="showPlayersList"
    :position="currentPlayer?.position"
    :players="availablePlayers"
    @close="closePlayersList"
    @select="selectPlayer"
  />
</template>

<script setup>
import { ref } from 'vue'
import PlayerListModal from './PlayerListModal.vue'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  visible: Boolean,
  currentPlayer: Object
})

const emit = defineEmits(['close', 'startSwap'])
const showPlayersList = ref(false)
const availablePlayers = ref([])
const userStore = useUserStore()

const getPositionLabel = (position) => {
  const labels = {
    'gkp': 'Вратарь',
    'def': 'Защитник',
    'mid': 'Полузащитник',
    'fwd': 'Нападающий'
  }
  return labels[position.toLowerCase()] || position
}

const handleTransfer = async () => {
  const accessToken = userStore.accessToken
  if (!accessToken) {
    return
  }

  const response = await fetch(`http://127.0.0.1:8000/api/internal/v1/player/?position=${props.currentPlayer.position}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })

  if (!response.ok) {
    return
  }

  const data = await response.json()
  if (data.results) {
    availablePlayers.value = data.results
    showPlayersList.value = true
    emit('close')
  }
}

const closePlayersList = () => {
  showPlayersList.value = false
  availablePlayers.value = []
}

const selectPlayer = (player) => {
  emit('startSwap', player)
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

.player-card {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
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

.modal-footer {
  margin-top: 20px;
  text-align: center;
}

.transfer-button {
  background-color: #00c48c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.transfer-button:hover {
  background-color: #00a87a;
}
</style> 