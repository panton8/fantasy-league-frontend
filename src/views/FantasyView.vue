<template>
  <div class="fantasy-container">
    <header class="header">
      <div class="user-info">
        <div class="user-profile">
          <span class="user-avatar">{{ userStore.username[0].toUpperCase() }}</span>
          <span class="username">{{ userStore.username }}</span>
        </div>
        <div class="budget">{{ userStore.budget }}</div>
        <button class="logout-btn" @click="handleLogout">
          <span class="logout-icon">🚪</span>
          <span class="logout-text">Выйти</span>
        </button>
      </div>
    </header>
    
    <main class="main-content">
      <!-- Здесь будет основной контент страницы фэнтези -->
      <h1>Фэнтези лига</h1>
      <p>Страница в разработке...</p>
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
  
  // Если пользователь аутентифицирован, но профиль еще не загружен
  if (!userStore.profile) {
    await userStore.initializeUser()
    // Если после попытки инициализации токен оказался недействительным
    if (!userStore.isAuthenticated) {
      router.push('/auth')
    }
  }
})
</script>

<style scoped lang="scss">
.fantasy-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding-right: 2rem;
  transform: translateX(200px);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
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

  .logout-icon {
    font-size: 18px;
  }

  .logout-text {
    margin-top: 2px;
  }
}

.main-content {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
}
</style> 