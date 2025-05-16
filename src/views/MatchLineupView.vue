<template>
  <div class="match-page">
    <!-- Шапка матча: эмблемы, счет или дата, статус -->
    <div class="match-header">
      <div class="match-info">
        <div class="team home-team">
          <img :src="matchData?.home_club_logo || $route.query.home_club_logo" :alt="matchData?.home_club || $route.query.home_club" class="team-logo-large">
          <span class="team-name-large">{{ matchData?.home_club || $route.query.home_club }}</span>
        </div>
        <div class="score-container">
          <div v-if="matchData?.full_time" class="score-large">
            <span class="home-score">{{ matchData?.home_club_goals ?? $route.query.homeGoals ?? '-' }}</span>
            <span class="score-divider-large">:</span>
            <span class="away-score">{{ matchData?.away_club_goals ?? $route.query.awayGoals ?? '-' }}</span>
          </div>
          <div v-else class="upcoming-date-block">
            <div class="upcoming-time">{{ formatTime(matchData?.start_time || $route.query.start_time) }}</div>
            <div class="upcoming-date">{{ formatDayMonth(matchData?.start_time || $route.query.start_time) }}</div>
          </div>
          <div v-if="matchData?.full_time" class="match-status">
            <span class="status-indicator"></span>
            Матч завершен
          </div>
        </div>
        <div class="team away-team">
          <img :src="matchData?.away_club_logo || $route.query.away_club_logo" :alt="matchData?.away_club || $route.query.away_club" class="team-logo-large">
          <span class="team-name-large">{{ matchData?.away_club || $route.query.away_club }}</span>
        </div>
      </div>
    </div>
    <!-- Табы -->
    <div class="match-tabs">
      <button 
        v-if="!isFromUpcoming"
        :class="['tab-btn', {active: activeTab === 'details'}]" 
        @click="activeTab = 'details'"
      >
        Детали
      </button>
      <button 
        :class="['tab-btn', {active: activeTab === 'lineup'}]" 
        @click="activeTab = 'lineup'"
      >
        Составы
      </button>
      <button 
        :class="['tab-btn', {active: activeTab === 'table'}]" 
        @click="activeTab = 'table'"
      >
        Таблица
      </button>
    </div>
    <!-- Контент -->
    <transition name="fade" mode="out-in">
      <div v-if="activeTab === 'details' && !isFromUpcoming" key="details">
        <MatchDetails :match-id="route.params.id" />
      </div>
      <div v-else-if="activeTab === 'lineup'" key="lineup">
        <template v-if="isFromUpcoming">
          <!-- Логика для предстоящих матчей -->
          <div v-if="showLineupMessage" class="lineup-message">
            <div class="message-box">
              Составы команд будут доступны за час до начала матча
            </div>
          </div>
          <MatchLineup v-else-if="!loading" 
            :lineups="lineups" 
            :loading="loading" 
            :error="error" />
        </template>
        <template v-else>
          <!-- Простая логика для страницы результатов -->
          <MatchLineup 
            :lineups="lineups" 
            :loading="loading" 
            :error="error" />
        </template>
        </div>
      <div v-else-if="activeTab === 'table'" key="table">
        <MatchTable 
          :tableData="tableData" 
          :tableLoading="tableLoading"
          :homeClubName="matchData?.home_club" 
          :awayClubName="matchData?.away_club" 
        />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import MatchSummary from '../components/MatchSummary.vue'
import MatchLineup from '../components/MatchLineup.vue'
import MatchTable from '../components/MatchTable.vue'
import MatchDetails from '@/components/MatchDetails.vue'

const route = useRoute()
const lineups = ref({})
const loading = ref(true)
const error = ref(null)
const matchData = ref(null)
const tableData = ref([])
const tableLoading = ref(true)
const activeTab = ref('details')
const matchId = route.params.id

const isFromUpcoming = computed(() => {
  return route.query.from === 'upcoming'
})

const showLineupMessage = computed(() => {
  // Проверяем, есть ли данные о составах хотя бы у одной команды
  const hasAnyLineup = lineups.value && Object.values(lineups.value).some(team => 
    team.start && team.start.length > 0
  )
  
  // Если есть хотя бы один состав - не показываем сообщение
  return !hasAnyLineup
})

const formatTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false })
}
const formatDayMonth = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    year: 'numeric'
  })
}

const getPositionLabel = (position) => {
  const positions = {
    'gkp': 'ВРТ',
    'def': 'ЗАЩ',
    'mid': 'ПЗ',
    'fwd': 'НАП'
  }
  return positions[position] || position
}

const getGoalDiffClass = (diff) => {
  if (diff > 0) return 'positive'
  if (diff < 0) return 'negative'
  return ''
}

const getPositionClass = (position) => {
  const totalTeams = tableData.value.length
  if (position === 1) return 'champions'
  if (position <= 3) return 'conference'
  if (position === totalTeams - 2) return 'playoff'
  if (position >= totalTeams - 1) return 'relegation'
  return ''
}

const fetchMatchData = async () => {
  try {
    const { id } = route.params
    const response = await axios.get(`http://127.0.0.1:8000/api/internal/v1/match/${id}/`)
    matchData.value = response.data
  } catch (e) {
    console.error('Error fetching match data:', e)
  }
}

const fetchTableData = async () => {
  try {
    tableLoading.value = true
    const response = await axios.get('http://127.0.0.1:8000/api/internal/v1/club/table/')
    tableData.value = response.data
  } catch (error) {
    console.error('Error fetching table data:', error)
  } finally {
    tableLoading.value = false
  }
}

const fetchLineup = async () => {
  loading.value = true
  error.value = null
  try {
    const { id } = route.params
    const response = await axios.get(`http://127.0.0.1:8000/api/internal/v1/match/${id}/line-up/`)
    lineups.value = response.data
  } catch (e) {
    console.error('Error fetching lineup:', e)
    error.value = 'Не удалось загрузить составы'
  } finally {
    loading.value = false
  }
}

const fetchMatch = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/internal/v1/match/${route.params.id}/`)
    matchData.value = await response.json()
  } catch (error) {
    console.error('Error fetching match:', error)
  }
}

onMounted(async () => {
  await Promise.all([
    fetchMatchData(),
    fetchTableData(),
    fetchLineup(),
    fetchMatch()
  ])
  if (isFromUpcoming.value) {
    activeTab.value = 'lineup'
  } else {
    activeTab.value = 'details'
  }
})
</script>

<style scoped>
.match-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.match-header {
  background: white;
  border-radius: 24px;
  padding: 2.5rem 2rem 2rem 2rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.13);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.match-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2.5rem;
  width: 100%;
}
.team {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  flex: 1;
}
.team-logo-large {
  width: 100px;
  height: 100px;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.10));
  background: #fff;
  border-radius: 50%;
  border: 2px solid #e0e0e0;
}
.team-name-large {
  font-size: 1.7rem;
  font-weight: 800;
  color: #1e3c72;
  text-align: center;
  margin-top: 0.5rem;
  letter-spacing: 1px;
  font-family: 'Montserrat', 'Arial', sans-serif;
  text-shadow: 0 2px 8px #e0eafc;
}
.score-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
}
.score-large {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  font-size: 3.5rem;
  font-weight: 800;
  color: #2c3e50;
  letter-spacing: 2px;
  background: linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%);
  border-radius: 16px;
  padding: 0.5rem 2.5rem;
  box-shadow: 0 2px 12px rgba(44,62,80,0.07);
}
.score-divider-large {
  font-size: 3.5rem;
  font-weight: 800;
  color: #2c3e50;
  opacity: 0.7;
}
.match-date {
  font-size: 2.2rem;
  font-weight: 700;
  color: #3498db;
  font-family: 'Montserrat', 'Arial', sans-serif;
  letter-spacing: 1px;
  background: linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%);
  border-radius: 16px;
  padding: 0.5rem 2.5rem;
  box-shadow: 0 2px 12px rgba(44,62,80,0.07);
  text-align: center;
}
.match-status {
  font-size: 1.1rem;
  color: #00c48c;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  margin-top: 0.2rem;
}
.status-indicator {
  width: 10px;
  height: 10px;
  background: #00ff87;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 8px rgba(0, 255, 135, 0.5);
}

.match-tabs {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(44,62,80,0.07);
  padding: 0.7rem 0.5rem;
}
.tab-btn {
  font-size: 1.15rem;
  font-weight: 600;
  color: #2c3e50;
  background: none;
  border: none;
  outline: none;
  padding: 0.7rem 2.2rem;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  box-shadow: none;
  position: relative;
}
.tab-btn.active {
  background: linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%);
  color: #1e3c72;
  box-shadow: 0 2px 8px rgba(44,62,80,0.10);
}
.tab-btn:not(.active):hover {
  background: #f5f7fa;
  color: #3498db;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 900px) {
  .match-header {
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
}
  .team-logo-large {
    width: 70px;
    height: 70px;
  }
  .score-large {
    font-size: 2.2rem;
    padding: 0.3rem 1.2rem;
}
  .team-name-large {
    font-size: 1.1rem;
}
}
@media (max-width: 600px) {
  .match-info {
    flex-direction: column;
    gap: 1.2rem;
}
  .score-large {
    font-size: 1.5rem;
    padding: 0.2rem 0.7rem;
  }
  .team-logo-large {
    width: 48px;
    height: 48px;
  }
  .team-name-large {
    font-size: 0.95rem;
}
  .match-tabs {
    gap: 0.5rem;
    padding: 0.3rem 0.1rem;
  }
  .tab-btn {
    font-size: 0.95rem;
    padding: 0.5rem 0.7rem;
  }
}

.upcoming-date-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 70px;
  margin: 0 1.5rem;
}
.upcoming-time {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  background: #222;
  border-radius: 8px;
  padding: 0.2rem 1.2rem;
  margin-bottom: 0.2rem;
  letter-spacing: 1px;
}
.upcoming-date {
  font-size: 1.1rem;
  color: #bdbdbd;
  font-weight: 600;
  margin-top: 0.1rem;
}

.lineup-message {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  padding: 2rem;
}

.message-box {
  background: white;
  padding: 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  font-size: 1.2rem;
  color: #2c3e50;
  text-align: center;
  font-weight: 600;
}
</style> 