<template>
  <div class="leagues-container">
    <header class="header">
      <div class="header-content">
        <div class="logo-section">
          <img src="@/assets/fantasy-logo.png" alt="Fantasy League" class="logo">
          <nav class="main-nav">
            <router-link to="/fantasy" class="nav-item">Главная</router-link>
            <router-link to="/transfers" class="nav-item">Трансферы</router-link>
            <router-link to="/leagues" class="nav-item active">Лиги</router-link>
            <router-link to="/stats" class="nav-item">Статистика</router-link>
          </nav>
        </div>
        
        <div class="user-section">
          <div class="user-info">
          <div class="user-details">
            <span class="username">{{ userStore.profile?.username }}</span>
            <span class="budget">Бюджет: {{ userStore.profile?.budget || 0 }}M</span>
            <button class="logout-btn" @click="handleLogout">Выйти</button>
          </div>
        </div>
        </div>
      </div>
    </header>
    
    <main class="main-content">
      <div class="leagues-dashboard">
        <div class="dashboard-header">
          <h1>Мои лиги</h1>
          <button class="create-league-btn">
            <span class="action-icon">➕</span>
            Создать лигу
          </button>
        </div>
        
        <div class="leagues-content">
          <div class="leagues-list">
            <div class="league-card">
              <div class="league-header">
                <h3>Глобальная лига</h3>
                <span class="league-type">Публичная</span>
              </div>
              <div class="league-stats">
                <div class="stat">
                  <span class="stat-label">Место</span>
                  <span class="stat-value">1,234</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Участников</span>
                  <span class="stat-value">10,000+</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Очки</span>
                  <span class="stat-value">1,234</span>
                </div>
              </div>
              <button class="view-league-btn">Просмотр таблицы</button>
            </div>
            
            <div class="league-card">
              <div class="league-header">
                <h3>Лига друзей</h3>
                <span class="league-type">Приватная</span>
              </div>
              <div class="league-stats">
                <div class="stat">
                  <span class="stat-label">Место</span>
                  <span class="stat-value">3</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Участников</span>
                  <span class="stat-value">10</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Очки</span>
                  <span class="stat-value">1,234</span>
                </div>
              </div>
              <button class="view-league-btn">Просмотр таблицы</button>
            </div>
          </div>
          
          <div class="join-league">
            <h2>Присоединиться к лиге</h2>
            <div class="join-form">
              <input type="text" placeholder="Введите код лиги" class="league-code-input">
              <button class="join-btn">Присоединиться</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const userStore = useUserStore()
const router = useRouter()

const handleLogout = () => {
  userStore.logout()
  router.push('/auth')
}

onMounted(async () => {
  if (!userStore.isAuthenticated) {
    router.push('/auth')
    return
  }
  
  if (!userStore.profile) {
    await userStore.initializeUser()
    if (!userStore.isAuthenticated) {
      router.push('/auth')
    }
  }
})
</script>

<style scoped lang="scss">
.leagues-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  height: 40px;
  object-fit: contain;
}

.main-nav {
  display: flex;
  gap: 1.5rem;
}

.nav-item {
  color: #37003c;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(55, 0, 60, 0.1);
  }

  &.active {
    background: #37003c;
    color: white;
  }
}

.user-section {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: #37003c;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
}

.username {
  font-weight: 600;
  color: #37003c;
  font-size: 16px;
}

.budget {
  background: #37003c;
  color: #00ff87;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 16px;
  position: relative;
  
  &::before {
    content: '💰';
    margin-right: 8px;
  }
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #c82333;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

.main-content {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
}

.leagues-dashboard {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    color: #37003c;
    font-size: 24px;
    font-weight: 700;
  }
}

.create-league-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #37003c;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #4a0050;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

.leagues-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.leagues-list {
  display: grid;
  gap: 1.5rem;
}

.league-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
}

.league-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h3 {
    color: #37003c;
    font-size: 18px;
    font-weight: 600;
  }
}

.league-type {
  background: #e9ecef;
  color: #6c757d;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.league-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat {
  text-align: center;

  .stat-label {
    display: block;
    color: #6c757d;
    font-size: 12px;
    margin-bottom: 0.25rem;
  }

  .stat-value {
    color: #37003c;
    font-size: 18px;
    font-weight: 600;
  }
}

.view-league-btn {
  width: 100%;
  background: #37003c;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #4a0050;
  }
}

.join-league {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;

  h2 {
    color: #37003c;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }
}

.join-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.league-code-input {
  padding: 0.75rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #37003c;
  }
}

.join-btn {
  background: #37003c;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #4a0050;
  }
}
</style> 