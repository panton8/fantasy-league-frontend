<template>
  <div class="clubs-container">
    <div class="clubs-grid">
      <div v-for="club in clubs" :key="club.pk" class="club-card">
        <img :src="club.logo_url" :alt="club.name" class="club-logo">
        <h2 class="club-name">{{ club.name }}</h2>
        <button class="details-button" @click="goToClubDetails(club.pk)">
          Подробнее
        </button>
      </div>
    </div>
    
    <!-- Загрузка -->
    <div v-if="loading" class="loading">
      <p>Загрузка списка клубов...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const clubs = ref([])
const loading = ref(true)

const fetchClubs = async () => {
  try {
    loading.value = true
    const response = await fetch('http://127.0.0.1:8000/api/internal/v1/club/?limit=16')
    const data = await response.json()
    clubs.value = data.results
  } catch (error) {
    console.error('Error fetching clubs:', error)
  } finally {
    loading.value = false
  }
}

const goToClubDetails = (pk) => {
  router.push(`/league/club/${pk}`)
}

onMounted(() => {
  fetchClubs()
})
</script>

<style scoped lang="scss">
.clubs-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  height: calc(100vh - 300px); // Учитываем высоту навбара и отступы
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #1e3c72;
    border-radius: 4px;

    &:hover {
      background: #2a4d8f;
    }
  }
}

.clubs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.club-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }
}

.club-logo {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

.club-name {
  color: #37003c;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  text-align: center;
}

.details-button {
  background: #1e3c72;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #2a4d8f;
  }
}

.loading {
  text-align: center;
  padding: 40px;
  
  p {
    color: #666;
    font-size: 18px;
  }
}
</style> 