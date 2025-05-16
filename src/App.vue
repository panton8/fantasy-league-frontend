<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import { useUserStore } from '@/stores/user'
import BeteraLogo from './assets/betera-logo.png'

const router = useRouter()
const clubs = ref([])
const userStore = useUserStore()
const activeDropdown = ref(null)

const handleFantasyClick = (route) => {
  // Страницы без авторизации
  if (route === '/fantasy/prizes' || route === '/fantasy/help') {
    return
  }
  
  // Для всех остальных страниц фэнтези требуется авторизация
  if (!userStore.isAuthenticated) {
    router.push('/auth')
  }
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
    <nav class="navbar">
      <div class="nav-content">
        <img :src="BeteraLogo" alt="Betera" class="betera-logo-nav" />
        <div class="dropdown-menu">
          <div class="dropdown-item" 
               @mouseenter="activeDropdown = 'league'"
               @mouseleave="activeDropdown = null">
            <span>Высшая Лига</span>
            <div class="dropdown-overlay" v-if="activeDropdown === 'league'"></div>
            <div class="dropdown-content">
              <router-link to="/league/clubs">Клубы</router-link>
              <router-link to="/league/upcoming">Предстоящие игры</router-link>
              <router-link to="/league/results">Результаты</router-link>
              <router-link to="/league/table">Таблица</router-link>
              <router-link to="/league/stats">Статистика</router-link>
              <router-link to="/league/news">Новости</router-link>
            </div>
          </div>
          <div class="dropdown-item"
               @mouseenter="activeDropdown = 'fantasy'"
               @mouseleave="activeDropdown = null">
            <span>Фэнтези</span>
            <div class="dropdown-overlay" v-if="activeDropdown === 'fantasy'"></div>
            <div class="dropdown-content">
              <router-link to="/fantasy" @click="handleFantasyClick('/fantasy')">Фэнтези</router-link>
              <router-link to="/fantasy/prizes" @click="handleFantasyClick('/fantasy/prizes')">Призы</router-link>
              <router-link to="/fantasy/stats" @click="handleFantasyClick('/fantasy/stats')">Статистика</router-link>
              <router-link to="/fantasy/help" @click="handleFantasyClick('/fantasy/help')">Помощь</router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <main class="main-content" :class="{ 'dropdown-active': activeDropdown !== null }">
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
  overflow: hidden;
}

.header {
  background: linear-gradient(45deg, #37003c, #2d0066);
  padding: 1rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.betera-logo {
  height: 40px;
  object-fit: contain;
}

.club-logo {
  position: absolute;
  top: 5px;
  width: 50px;
  height: 50px;
  object-fit: contain;
  transition: transform 0.2s ease;
  z-index: 1;

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
  border-bottom: none !important;
  box-shadow: none !important;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: 100%;
  position: relative;
}

.betera-logo-nav {
  height: 96px;
  object-fit: contain;
  position: absolute;
  left: -312px;
  z-index: 1001;
}

.dropdown-menu {
  display: flex;
  gap: 40px;
  transform: translateX(-100px);
  position: relative;
  z-index: 1002;
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
    position: relative;
    z-index: 1003;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }
  }

  &:hover {
    .dropdown-content {
      visibility: visible;
      opacity: 1;
      transform: translateY(0);
      pointer-events: all;
    }
    
    .dropdown-overlay {
      opacity: 1;
      visibility: visible;
      pointer-events: all;
    }
  }
}

.dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 1003;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  pointer-events: none;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  min-width: 280px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  border-radius: 4px;
  padding: 8px 0;
  z-index: 1004;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  pointer-events: none;
  
  a {
    color: #333;
    text-decoration: none;
    padding: 12px 20px;
    display: block;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    position: relative;
    z-index: 1005;
    transition: background-color 0.2s ease, color 0.2s ease;
    pointer-events: all;
    
    &:hover {
      background-color: #f5f5f5;
      color: #1e3c72;
    }
  }
}

.main-content {
  flex: 1;
  width: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  // padding: 20px;
  overflow-y: auto;
  position: relative;
  z-index: 1;
  pointer-events: auto;
  
  &.dropdown-active {
    pointer-events: none;
  }
  
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

@media (max-width: 768px) {
  .header {
    padding: 0.8rem 1rem;
  }
  
  .betera-logo {
    height: 30px;
  }

  .betera-logo-nav {
    height: 64px;
    left: -208px;
  }
}
</style>
