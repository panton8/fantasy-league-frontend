<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Игрок</h2>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>
      <div class="modal-body">
        <div v-if="!showAvailablePlayers" class="player-info">
          <img :src="currentPlayer.t_shirt" :alt="currentPlayer.surname" class="player-shirt">
          <div class="player-details">
            <span class="player-name">{{ currentPlayer.surname }}</span>
            <span class="player-position">{{ getPositionLabel(currentPlayer.position) }}</span>
            <span class="player-cost">{{ currentPlayer.cost }}M</span>
          </div>
        </div>
        <div v-else class="available-players">
          <h3>Доступные игроки</h3>
          <div class="players-list">
            <div 
              v-for="player in availablePlayers" 
              :key="player.id" 
              class="player-card" 
              :class="{ 'selected': selectedPlayer?.id === player.id }"
              @click="selectPlayerForTransfer(player)"
            >
              <img :src="player.t_shirt" :alt="player.surname" class="player-shirt">
              <div class="player-details">
                <span class="player-name">{{ player.surname }}</span>
                <span class="player-position">{{ getPositionLabel(player.position) }}</span>
                <span class="player-cost">{{ player.cost }}M</span>
                <span class="player-team">{{ player.team }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button v-if="!showAvailablePlayers" class="transfer-button" @click="handleTransfer">Совершить трансфер</button>
        <div v-else class="transfer-actions">
          <button class="confirm-button" :disabled="!selectedPlayer" @click="confirmTransfer">Подтвердить</button>
          <button class="cancel-button" @click="closeModal">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TransferPlayerModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    currentPlayer: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showAvailablePlayers: false,
      availablePlayers: [],
      selectedPlayer: null,
      newPlayer: null
    }
  },
  methods: {
    closeModal() {
      this.showAvailablePlayers = false
      this.availablePlayers = []
      this.selectedPlayer = null
      this.newPlayer = null
      this.$emit('close')
    },
    async handleTransfer() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/internal/v1/player/?position=${this.currentPlayer.position}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        })

        if (!response.ok) {
          throw new Error('Ошибка при получении списка игроков')
        }

        const data = await response.json()
        console.log('Полученные игроки с сервера:', data)
        
        const players = Array.isArray(data) ? data : data.results || []
        console.log('Подготовленные данные игроков:', players)
        
        this.availablePlayers = players
        this.showAvailablePlayers = true
      } catch (error) {
        console.error('Ошибка при получении списка игроков:', error)
      }
    },
    selectPlayerForTransfer(player) {
      this.selectedPlayer = player
      this.newPlayer = player.id
    },
    async confirmTransfer() {
      if (this.selectedPlayer) {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/internal/v1/user/team/make-transfer/', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
              new_player: this.newPlayer,
              old_player: this.currentPlayer.id
            })
          })

          if (!response.ok) {
            throw new Error('Ошибка при совершении трансфера')
          }

          const data = await response.json()
          console.log('Трансфер успешно выполнен:', data)
          
          // Обновляем состав команды и закрываем окно
          this.$emit('transfer', this.selectedPlayer)
          this.$emit('close')
          this.showAvailablePlayers = false
          this.availablePlayers = []
          this.selectedPlayer = null
          this.newPlayer = null
        } catch (error) {
          console.error('Ошибка при совершении трансфера:', error)
        }
      }
    },
    getPositionLabel(position) {
      const positions = {
        'GKP': 'Вратарь',
        'DEF': 'Защитник',
        'MID': 'Полузащитник',
        'FWD': 'Нападающий',
        'gkp': 'Вратарь',
        'def': 'Защитник',
        'mid': 'Полузащитник',
        'fwd': 'Нападающий'
      }
      return positions[position] || position
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
  background: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 1rem;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.player-shirt {
  width: 100px;
  height: auto;
}

.player-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.player-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.player-position {
  color: #666;
  font-size: 0.9rem;
}

.player-cost {
  color: #ff2e6e;
  font-weight: bold;
}

.player-team {
  color: #666;
  font-size: 0.9rem;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.transfer-button {
  background: #ff2e6e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.transfer-button:hover {
  background: #e6255f;
}

.available-players {
  margin-top: 1rem;
}

.available-players h3 {
  margin-bottom: 1rem;
  color: #333;
}

.players-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.players-list .player-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  border: 1px solid #eee;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.players-list .player-card:hover {
  background-color: #f5f5f5;
}

.players-list .player-card.selected {
  border-color: #ff2e6e;
  background-color: #fff5f8;
}

.players-list .player-shirt {
  width: 60px;
  height: auto;
}

.transfer-actions {
  display: flex;
  gap: 1rem;
}

.confirm-button {
  background: #ff2e6e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.confirm-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.confirm-button:not(:disabled):hover {
  background: #e6255f;
}

.cancel-button {
  background: #eee;
  color: #666;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background: #ddd;
}
</style> 