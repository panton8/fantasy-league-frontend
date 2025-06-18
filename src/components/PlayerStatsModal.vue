<template>
  <div v-if="visible" class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Статистика игрока</h3>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>
      
      <div class="player-card">
        <img :src="player.t_shirt" :alt="player.surname" class="player-shirt">
        <div class="player-info">
          <span class="player-name">{{ player.surname }}</span>
          <span class="player-position">{{ getPositionLabel(player.position) }}</span>
          <span class="player-points">{{ player.total_points }} очков</span>
        </div>
      </div>

      <div class="stats-section">
        <h4>Статистика за тур</h4>
        <div class="stats-table">
          <div class="stats-header">
            <div class="stat-cell">Действие</div>
            <div class="stat-cell">Очки</div>
          </div>
          <div v-for="(stat, key) in player.stats" :key="key" class="stats-row" v-if="stat.count > 0">
            <div class="stat-cell">
              <span class="stat-label">{{ getStatLabel(key) }}</span>
              <span class="stat-count">({{ stat.count }})</span>
            </div>
            <div class="stat-cell">
              <span class="stat-points" :class="{ 'negative': stat.points < 0 }">
                {{ stat.points > 0 ? '+' : '' }}{{ stat.points }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: Boolean,
  player: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const getPositionLabel = (position) => {
  const labels = {
    'gkp': 'Вратарь',
    'def': 'Защитник',
    'mid': 'Полузащитник',
    'fwd': 'Нападающий'
  }
  return labels[position.toLowerCase()] || position
}

const getStatLabel = (key) => {
  const labels = {
    goal: 'Голы',
    assist: 'Передачи',
    yellow_card: 'Желтые карточки',
    red_card: 'Красные карточки',
    save: 'Сейвы',
    minute: 'Минуты',
    own_goal: 'Автоголы',
    penalty_saved: 'Спасенные пенальти',
    penalty_missed: 'Незабитые пенальти',
    goals_conceded: 'Пропущенные голы'
  }
  return labels[key] || key
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
  width: 400px;
  height: 300px;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.modal-header h3 {
  margin: 0;
  color: #1a237e;
  font-size: 1.2rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.player-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 6px;
  margin-bottom: 15px;
}

.player-shirt {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.player-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.player-name {
  font-weight: bold;
  color: #1a237e;
  font-size: 1.1rem;
}

.player-position {
  color: #666;
  font-size: 0.9rem;
}

.player-points {
  color: #00c48c;
  font-weight: bold;
  font-size: 1rem;
}

.stats-section {
  flex: 1;
  overflow-y: auto;
  padding-right: 5px;
}

.stats-section h4 {
  margin-bottom: 15px;
  color: #1a237e;
  font-size: 1.1rem;
}

.stats-table {
  background: white;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stats-header {
  display: grid;
  grid-template-columns: 2fr 1fr;
  background: #1a237e;
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
}

.stats-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  padding: 8px 12px;
  border-bottom: 1px solid #eee;
}

.stats-row:last-child {
  border-bottom: none;
}

.stats-row:hover {
  background: #f8f9fa;
}

.stat-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
}

.stat-label {
  color: #333;
  font-size: 0.9rem;
}

.stat-count {
  color: #666;
  font-size: 0.8rem;
}

.stat-points {
  color: #00c48c;
  font-weight: bold;
  font-size: 0.9rem;
}

.stat-points.negative {
  color: #ff4d4d;
}

.stats-section::-webkit-scrollbar {
  width: 4px;
}

.stats-section::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.stats-section::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 2px;
}
</style>