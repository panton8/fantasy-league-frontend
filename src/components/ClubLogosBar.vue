<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const clubs = ref([])
const router = useRouter()

const fetchClubs = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/internal/v1/club/?limit=16')
    const data = await response.json()
    clubs.value = data.results
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching clubs:', error)
  }
}

const handleClubClick = (pk) => {
  router.push(`/league/club/${pk}`)
}

onMounted(fetchClubs)
</script>

<template>
  <div class="club-logos-bar">
    <img
      v-for="club in clubs"
      :key="club.pk"
      :src="club.logo_url"
      :alt="'Club logo'"
      class="club-logo"
      @click="handleClubClick(club.pk)"
      :style="{ cursor: 'pointer' }"
    />
  </div>
</template>

<style scoped>
.club-logos-bar {
  width: 100vw;
  background: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 8px 0 8px 0;
  position: relative;
  z-index: 100;
  overflow-x: auto;
}
.club-logo {
  width: 50px;
  height: 50px;
  object-fit: contain;
  margin: 0 18px;
  transition: transform 0.2s ease;
}
.club-logo:hover {
  transform: scale(1.1);
}
</style> 