<template>
  <div class="club-detail-container">
    <div v-if="club" class="club-content">
      <!-- Шапка с логотипом и названием -->
      <div class="club-header">
        <img :src="club.logo_url" :alt="club.name" class="club-logo">
        <h1>{{ club.name }}</h1>
      </div>

      <!-- Основная информация -->
      <div class="info-grid">
        <div class="info-card">
          <h2>О клубе</h2>
          <div class="info-row">
            <span class="label">Название:</span>
            <span class="value">{{ club.name }}</span>
          </div>
          <div class="info-row">
            <span class="label">Год основания:</span>
            <span class="value">{{ club.foundation_date }}</span>
          </div>
          <div class="info-row">
            <span class="label">Стадион:</span>
            <span class="value">{{ club.stadium }}</span>
          </div>
          <div class="info-row">
            <span class="label">Вместимость стадиона:</span>
            <span class="value">{{ club.stadium_capacity }} зрителей</span>
          </div>
          <div class="info-row">
            <span class="label">Сайт клуба:</span>
            <span class="value">
              <a :href="club.site_link" target="_blank" class="club-link">Перейти на сайт</a>
            </span>
          </div>
        </div>

        <!-- История клуба -->
        <div class="info-card history-card">
          <h2>История</h2>
          <p class="club-history">{{ club.info }}</p>
        </div>
      </div>
    </div>

    <!-- Загрузка -->
    <div v-else-if="loading" class="loading">
      <p>Загрузка информации о клубе...</p>
    </div>

    <!-- Ошибка -->
    <div v-else class="error-message">
      <p>Не удалось загрузить информацию о клубе</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const club = ref(null)
const loading = ref(true)

const goalDifference = computed(() => {
  if (!club.value) return 0
  return club.value.goals_for - club.value.goals_against
})

const goalDiffClass = computed(() => {
  if (!goalDifference.value) return ''
  return goalDifference.value > 0 ? 'positive' : 'negative'
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const fetchClubDetails = async () => {
  try {
    loading.value = true
    const response = await fetch(`http://127.0.0.1:8000/api/internal/v1/club/${route.params.pk}/`)
    if (!response.ok) throw new Error('Failed to fetch club details')
    club.value = await response.json()
  } catch (error) {
    console.error('Error fetching club details:', error)
    club.value = null
  } finally {
    loading.value = false
  }
}

// Следим за изменением параметра pk в маршруте
watch(() => route.params.pk, (newPk) => {
  if (newPk) {
    fetchClubDetails()
  }
}, { immediate: true })

onMounted(() => {
  fetchClubDetails()
})
</script>

<style scoped lang="scss">
.club-detail-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.club-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  .club-logo {
    width: 120px;
    height: 120px;
    object-fit: contain;
  }

  h1 {
    color: #37003c;
    font-size: 36px;
    font-weight: 700;
    margin: 0;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: minmax(300px, 2fr) minmax(300px, 3fr);
  gap: 20px;
  margin-bottom: 30px;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h2 {
    color: #37003c;
    font-size: 24px;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 2px solid #f0f0f0;
  }
}

.history-card {
  height: 100%;
  
  .club-history {
    color: #333;
    line-height: 1.6;
    font-size: 16px;
    margin: 0;
    white-space: pre-line;
  }
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  .label {
    color: #666;
    font-weight: 500;
  }

  .value {
    color: #333;
    font-weight: 600;
  }
}

.club-link {
  color: #1e3c72;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
}

.loading, .error-message {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  p {
    color: #666;
    font-size: 18px;
  }
}
</style> 