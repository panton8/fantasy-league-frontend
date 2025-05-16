<template>
  <div class="results-container">
    <div class="gameweek-container" v-for="gameweek in sortedMatchResults" :key="gameweek.gameweek">
      <div class="gameweek-header">
        <h3>{{ gameweek.gameweek }} тур</h3>
      </div>
      <div class="matches-list">
        <div class="match-card" v-for="match in gameweek.matches" :key="match.id" @click="goToMatch(match)">
          <div class="match-time">
            {{ formatDate(match.start_time) }}
          </div>
          <div class="match-content">
            <div class="team home-team">
              <div class="team-info">
                <img :src="match.home_club.logo_url" :alt="match.home_club.name" class="team-logo">
                <span class="team-name">{{ match.home_club.name }}</span>
              </div>
            </div>
            <div class="score-divider">:</div>
            <div class="team away-team">
              <div class="team-info">
                <img :src="match.away_club.logo_url" :alt="match.away_club.name" class="team-logo">
                <span class="team-name">{{ match.away_club.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const matchResults = ref([])

const sortedMatchResults = computed(() => {
  return [...matchResults.value].sort((a, b) => a.gameweek - b.gameweek)
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const goToMatch = (match) => {
  router.push({
    path: `/match/${match.id}`,
    query: {
      home_club_logo: match.home_club.logo_url,
      away_club_logo: match.away_club.logo_url,
      home_club: match.home_club.name,
      away_club: match.away_club.name,
      start_time: match.start_time,
      from: 'upcoming'
    }
  })
}

onMounted(async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/internal/v1/match/?full_time=false')
    matchResults.value = response.data
  } catch (error) {
    console.error('Ошибка при загрузке предстоящих матчей:', error)
  }
})
</script>

<style scoped lang="scss">
.results-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.gameweek-container {
  margin-bottom: 2.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(55, 0, 60, 0.1);
  overflow: hidden;
  border: 1px solid rgba(55, 0, 60, 0.08);
}

.gameweek-header {
  background: linear-gradient(45deg, #37003c, #2d0066);
  padding: 1.2rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    color: white;
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .betera-logo {
    height: 30px;
    object-fit: contain;
  }
}

.matches-list {
  padding: 1.5rem;
}

.match-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(55, 0, 60, 0.05);
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(55, 0, 60, 0.12);
  }
}

.match-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 1.2rem;
  padding: 0.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(55, 0, 60, 0.05);
}

.team {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  
  &.home-team {
    justify-content: flex-end;
    text-align: right;
  }
  
  &.away-team {
    justify-content: flex-start;
    text-align: left;
  }
}

.team-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.team-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.team-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #37003c;
}

.score-divider {
  font-size: 2rem;
  font-weight: 700;
  color: #37003c;
  padding: 0 0.5rem;
  opacity: 0.5;
}

.match-status {
  font-size: 0.9rem;
  color: #00ff87;
  text-align: center;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  .status-indicator {
    width: 8px;
    height: 8px;
    background: #00ff87;
    border-radius: 50%;
    display: inline-block;
    box-shadow: 0 0 8px rgba(0, 255, 135, 0.5);
  }
}

.match-upcoming-status {
  color: #3498db;
}
.status-indicator.upcoming {
  background: #3498db;
}

@media (max-width: 768px) {
  .results-container {
    padding: 1rem;
  }

  .team-name {
    font-size: 0.9rem;
  }
  
  .score {
    font-size: 1.6rem;
  }
  
  .team-logo {
    width: 32px;
    height: 32px;
  }

  .match-content {
    gap: 0.8rem;
  }

  .team {
    gap: 0.8rem;
  }
}

@media (max-width: 480px) {
  .team-name {
    font-size: 0.8rem;
  }

  .team-logo {
    width: 24px;
    height: 24px;
  }

  .score {
    font-size: 1.4rem;
  }
}

.upcoming-match-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 1.2rem;
  padding: 0.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(55, 0, 60, 0.05);
}
.upcoming-date-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 70px;
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
</style> 
