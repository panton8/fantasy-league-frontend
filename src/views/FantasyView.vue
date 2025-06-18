<template>
  <div class="fantasy-container">
    <FantasyHeader :active-menu="activeMenu" />
    <div class="fantasy-content">
      <div class="fantasy-header">
        <h1>Фэнтези Лига</h1>
        <div class="season-info">
          <span class="season">Сезон 2024/25</span>
          <span class="gameweek">Тур {{ currentWeek }}</span>
        </div>
      </div>

      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Загрузка данных...</p>
      </div>

      <div v-else-if="!hasTeam" class="no-team-container">
        <div class="no-team-content">
          <img src="@/assets/empty-team.svg" alt="Нет команды" class="no-team-image">
          <h2>У вас еще нет команды</h2>
          <p>Создайте свою команду, чтобы начать соревнование!</p>
          <router-link to="/my-team" class="create-team-button">
            Создать команду
          </router-link>
        </div>
      </div>

      <div v-else class="team-stats-container">
        <div class="team-stats-card">
          <div class="stats-header">
            <h2>Статистика команды</h2>
            <div class="team-rank" :class="getRankClass">
              {{ teamPlace }} место
            </div>
          </div>
          
          <div class="stats-content">
            <div class="stat-item">
              <span class="stat-label">Очки</span>
              <span class="stat-value">{{ teamPoints }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Тур</span>
              <span class="stat-value">{{ currentWeek }}</span>
            </div>
          </div>

          <div class="team-info">
            <div class="info-card">
              <h3>Советы</h3>
              <ul class="tips-list">
                <li>Следите за травмами игроков</li>
                <li>Проверяйте статистику перед трансферами</li>
                <li>Не забывайте менять капитана</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <router-link to="/my-team" class="action-button">
            <span class="action-icon">👥</span>
            Моя команда
          </router-link>
          <router-link to="/transfers" class="action-button">
            <span class="action-icon">🔄</span>
            Трансферы
          </router-link>
          <router-link to="/league" class="action-button">
            <span class="action-icon">🏆</span>
            Таблица
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import FantasyHeader from '@/components/FantasyHeader.vue'

export default {
  name: 'FantasyView',
  components: {
    FantasyHeader
  },
  setup() {
    const loading = ref(true)
    const teamPlace = ref(null)
    const teamPoints = ref(null)
    const currentWeek = ref(null)
    const hasTeam = ref(false)
    const activeMenu = ref('home')

    const getRankClass = computed(() => {
      if (!teamPlace.value) return ''
      if (teamPlace.value <= 3) return 'rank-top'
      if (teamPlace.value <= 10) return 'rank-good'
      if (teamPlace.value <= 20) return 'rank-average'
      return 'rank-low'
    })

    const fetchTeamStats = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/internal/v1/user/team/team-place/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        })

        if (!response.ok) {
          throw new Error('Ошибка при получении статистики команды')
        }

        const data = await response.json()
        console.log('Получены данные команды:', data)

        if (data.place === null || data.points === null) {
          hasTeam.value = false
        } else {
          hasTeam.value = true
          teamPlace.value = data.place
          teamPoints.value = data.points
          currentWeek.value = data.week
        }
      } catch (error) {
        console.error('Ошибка при получении статистики команды:', error)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchTeamStats()
    })

    return {
      loading,
      teamPlace,
      teamPoints,
      currentWeek,
      hasTeam,
      getRankClass,
      activeMenu
    }
  }
}
</script>

<style scoped>
.fantasy-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2d0066 100%);
  color: #fff;
  padding: 2rem;
}

.fantasy-content {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 2rem;
}

.fantasy-header {
  text-align: center;
  margin-bottom: 2rem;
}

.fantasy-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.season-info {
  display: flex;
  justify-content: center;
  gap: 2rem;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
}

.season, .gameweek {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  backdrop-filter: blur(5px);
}

.team-stats-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.stats-header h2 {
  font-size: 1.8rem;
  color: #fff;
}

.team-rank {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.1);
}

.rank-top {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}

.rank-good {
  background: rgba(52, 152, 219, 0.2);
  color: #3498db;
}

.rank-average {
  background: rgba(241, 196, 15, 0.2);
  color: #f1c40f;
}

.rank-low {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

.stats-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.stat-label {
  display: block;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
}

.team-info {
  margin-top: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.info-card {
  padding: 1rem;
}

.info-card h3 {
  color: #fff;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li {
  padding: 0.5rem 0;
  color: rgba(255, 255, 255, 0.8);
  position: relative;
  padding-left: 1.5rem;
}

.tips-list li:before {
  content: "•";
  color: #1e3c72;
  position: absolute;
  left: 0;
  font-size: 1.2rem;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.action-icon {
  font-size: 1.5rem;
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
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #1e3c72;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.no-team-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.no-team-content {
  text-align: center;
  max-width: 400px;
}

.no-team-image {
  width: 200px;
  height: 200px;
  margin-bottom: 2rem;
  opacity: 0.8;
}

.create-team-button {
  display: inline-block;
  padding: 1rem 2rem;
  background: #1e3c72;
  color: #fff;
  text-decoration: none;
  border-radius: 25px;
  font-weight: bold;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.create-team-button:hover {
  background: #2d0066;
  transform: translateY(-2px);
}
</style> 
