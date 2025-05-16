<template>
  <div class="lineup-section">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Загрузка составов...</p>
    </div>
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
    </div>
    <div v-else class="teams-lineup">
      <div
        v-for="(team, teamName) in lineups"
        :key="teamName"
        class="team-lineup"
      >
        <div class="team-header">
          <h4>{{ teamName }}</h4>
        </div>
        <div class="team-squad">
          <div class="squad-section">
            <h5>Основной состав</h5>
            <ul class="player-list">
              <li v-for="player in team.start" :key="player.id" class="player-item player-main">
                <div class="player-photo" v-if="player.card_image_link">
                  <img :src="player.card_image_link" :alt="player.display_name">
                </div>
                <div class="player-info">
                  <div class="player-header">
                    <span class="player-number" v-if="player.t_short_number">#{{ player.t_short_number }}</span>
                    <span class="player-position">{{ getPositionLabel(player.position) }}</span>
                  </div>
                  <span class="player-name">{{ player.display_name }}</span>
                </div>
              </li>
            </ul>
          </div>
          <div v-if="team.bench.length" class="squad-section bench-section">
            <h5>Запасные</h5>
            <ul class="player-list">
              <li v-for="player in team.bench" :key="player.id" class="player-item player-bench">
                <div class="player-photo" v-if="player.card_image_link">
                  <img :src="player.card_image_link" :alt="player.display_name">
                </div>
                <div class="player-info">
                  <div class="player-header">
                    <span class="player-number" v-if="player.t_short_number">#{{ player.t_short_number }}</span>
                    <span class="player-position">{{ getPositionLabel(player.position) }}</span>
                  </div>
                  <span class="player-name">{{ player.display_name }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  lineups: Object,
  loading: Boolean,
  error: String
})

const getPositionLabel = (position) => {
  const positions = {
    'gkp': 'ВРТ',
    'def': 'ЗАЩ',
    'mid': 'ПЗ',
    'fwd': 'НАП'
  }
  return positions[position] || position
}
</script>

<style scoped>
.lineup-section {
  background: white;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.10);
}
.teams-lineup {
  display: flex;
  gap: 2.5rem;
  flex-wrap: wrap;
  justify-content: center;
}
.team-lineup {
  flex: 1;
  min-width: 320px;
  max-width: 480px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e0eafc 100%);
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(44,62,80,0.08);
  overflow: hidden;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}
.team-header {
  background: linear-gradient(90deg, #1e3c72 0%, #2d0066 100%);
  padding: 1.2rem;
  text-align: center;
}
.team-header h4 {
  color: #fff;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 1px;
}
.team-squad {
  padding: 1.5rem 1.2rem 1.2rem 1.2rem;
}
.squad-section {
  margin-bottom: 2rem;
}
.squad-section h5 {
  color: #1e3c72;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #cfdef3;
  letter-spacing: 0.5px;
}
.bench-section h5 {
  color: #b36f00;
  border-bottom: 2px solid #ffe0a3;
}
.player-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.player-item {
  display: flex;
  align-items: center;
  padding: 0.7rem 1rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(44,62,80,0.07);
  transition: box-shadow 0.2s, transform 0.2s;
  gap: 1.1rem;
  position: relative;
}
.player-item.player-main {
  border-left: 5px solid #1e3c72;
}
.player-item.player-bench {
  border-left: 5px solid #ffe0a3;
}
.player-item:hover {
  box-shadow: 0 4px 16px rgba(44,62,80,0.13);
  transform: translateY(-2px) scale(1.01);
}
.player-photo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background: #f0f0f0;
  box-shadow: 0 2px 8px rgba(44,62,80,0.07);
  display: flex;
  align-items: center;
  justify-content: center;
}
.player-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.player-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
}
.player-header {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 0.1rem;
}
.player-number {
  background: #eaf6fb;
  color: #3498db;
  padding: 0.2rem 0.7rem;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 700;
  box-shadow: 0 1px 4px #3498db22;
}
.player-position {
  background: #2c3e50;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 600;
  display: inline-block;
  width: fit-content;
  letter-spacing: 0.5px;
}
.player-name {
  font-size: 1.1rem;
  color: #2c3e50;
  font-weight: 500;
  letter-spacing: 0.2px;
}
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}
.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(52, 152, 219, 0.2);
  border-radius: 50%;
  border-top-color: #3498db;
  animation: spin 1s ease-in-out infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.error-container {
  color: #dc3545;
  text-align: center;
  padding: 2rem;
}
@media (max-width: 900px) {
  .team-lineup {
    min-width: 220px;
    max-width: 100%;
  }
  .team-header h4 {
    font-size: 1rem;
  }
}
@media (max-width: 600px) {
  .teams-lineup {
    flex-direction: column;
    gap: 1.2rem;
  }
  .team-lineup {
    min-width: 100%;
    padding: 0;
  }
  .team-header {
    padding: 0.7rem;
  }
  .team-squad {
    padding: 1rem 0.5rem 0.5rem 0.5rem;
  }
  .player-photo {
    width: 36px;
    height: 36px;
  }
  .player-number, .player-position {
    font-size: 0.8rem;
    padding: 0.1rem 0.4rem;
  }
  .player-name {
    font-size: 0.95rem;
  }
}
</style> 
 