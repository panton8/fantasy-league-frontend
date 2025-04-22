<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import BeteraLogo from './assets/betera-logo.png'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const clubs = ref([])
const userStore = useUserStore()

const handleFantasyClick = (route) => {
  // Страницы без авторизации
  if (route === '/fantasy/prizes' || route === '/fantasy/help') {
    router.push(route)
    return
  }
  
  // Для всех остальных страниц фэнтези требуется авторизация
  if (!userStore.isAuthenticated) {
    router.push('/auth')
    return
  }
  router.push(route)
}

const fetchClubs = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/internal/v1/club/?limit=16')
    const data = await response.json()
    clubs.value = data.results
  } catch (error) {
    console.error('Error fetching clubs:', error)
  }
}

const handleClubClick = (pk) => {
  router.push(`/league/club/${pk}`)
}

onMounted(async () => {
  fetchClubs()
  
  if (userStore.isAuthenticated && !userStore.profile) {
    await userStore.initializeUser()
  }
})
</script>

<template>
  <div class="app">
    <img 
      v-for="club in clubs" 
      :key="club.pk" 
      :src="club.logo_url" 
      :alt="'Club logo'"
      class="club-logo"
      @click="handleClubClick(club.pk)"
      :style="{ cursor: 'pointer' }"
    />
    <div class="logo-wrapper">
      <img :src="BeteraLogo" alt="Betera Logo" class="betera-logo" />
    </div>
    <nav class="navbar">
      <div class="nav-content">
        <div class="dropdown-menu">
          <div class="dropdown-item">
            <span>Высшая Лига</span>
            <div class="dropdown-content">
              <a @click.prevent="router.push('/league/clubs')">Клубы</a>
              <a @click.prevent="router.push('/league/upcoming')">Предстоящие игры</a>
              <a @click.prevent="router.push('/league/results')">Результаты</a>
              <a @click.prevent="router.push('/league/table')">Таблица</a>
              <a @click.prevent="router.push('/league/stats')">Статистика</a>
              <a @click.prevent="router.push('/league/news')">Новости</a>
            </div>
          </div>
          <div class="dropdown-item">
            <span>Фэнтези</span>
            <div class="dropdown-content">
              <a @click.prevent="handleFantasyClick('/fantasy')">Фэнтези</a>
              <a @click.prevent="handleFantasyClick('/fantasy/prizes')">Призы</a>
              <a @click.prevent="handleFantasyClick('/fantasy/stats')">Статистика</a>
              <a @click.prevent="handleFantasyClick('/fantasy/help')">Помощь</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped lang="scss">
.app {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  background: white;
}

.club-logo {
  position: absolute;
  top: 5px;
  width: 50px;
  height: 50px;
  object-fit: contain;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  &:nth-child(1) { left: 130px; }
  &:nth-child(2) { left: 220px; }
  &:nth-child(3) { left: 310px; }
  &:nth-child(4) { left: 400px; }
  &:nth-child(5) { left: 490px; }
  &:nth-child(6) { left: 580px; }
  &:nth-child(7) { left: 670px; }
  &:nth-child(8) { left: 760px; }
  &:nth-child(9) { left: 850px; }
  &:nth-child(10) { left: 940px; }
  &:nth-child(11) { left: 1030px; }
  &:nth-child(12) { left: 1120px; }
  &:nth-child(13) { left: 1210px; }
  &:nth-child(14) { left: 1300px; }
  &:nth-child(15) { left: 1390px; }
  &:nth-child(16) { left: 1480px; }
}

.logo-wrapper {
  position: fixed;
  top: 60px;
  left: 0;
  width: 120px;
  height: 120px;
  z-index: 1000;
}

.betera-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: transparent;
}

.navbar {
  background: #1e3c72;
  padding: 0.5rem 2rem;
  flex-shrink: 0;
  width: 100%;
  margin-top: 65px;
  height: 120px;
  position: relative;
  z-index: 1000;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: 100%;
}

.dropdown-menu {
  display: flex;
  gap: 40px;
  transform: translateX(-100px);
  position: relative;
  z-index: 1001;
}

.dropdown-item {
  position: relative;
  
  > span {
    color: white;
    font-size: 24px;
    font-weight: 700;
    cursor: pointer;
    padding: 10px 30px;
    display: block;
    min-width: 280px;
    text-align: center;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }
  }

  &:hover .dropdown-content {
    display: block;
  }
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: white;
  min-width: 280px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  border-radius: 4px;
  padding: 8px 0;
  z-index: 1002;
  
  a {
    color: #333;
    text-decoration: none;
    padding: 12px 20px;
    display: block;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    
    &:hover {
      background-color: #f5f5f5;
    }
  }
}

.main-content {
  flex: 1;
  width: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  overflow-y: auto;
  position: relative;
  z-index: 1;
  
  .auth-container {
    max-width: 800px;
    margin: 40px auto;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
}

@media (max-width: 1400px) {
  .club-logo {
    &:nth-child(1) { left: 5%; }
    &:nth-child(2) { left: 11%; }
    &:nth-child(3) { left: 17%; }
    &:nth-child(4) { left: 23%; }
    &:nth-child(5) { left: 29%; }
    &:nth-child(6) { left: 35%; }
    &:nth-child(7) { left: 41%; }
    &:nth-child(8) { left: 47%; }
    &:nth-child(9) { left: 53%; }
    &:nth-child(10) { left: 59%; }
    &:nth-child(11) { left: 65%; }
    &:nth-child(12) { left: 71%; }
    &:nth-child(13) { left: 77%; }
    &:nth-child(14) { left: 83%; }
    &:nth-child(15) { left: 89%; }
    &:nth-child(16) { left: 95%; }
  }
}
</style>
