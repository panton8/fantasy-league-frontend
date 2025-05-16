<template>
  <div v-if="loading" class="loading">
    <div class="debug-box">
      <h3>Загрузка профиля...</h3>
    </div>
  </div>
  <div v-else-if="error" class="error">
    <div class="debug-box">
      <h3>Ошибка: {{ error }}</h3>
        </div>
      </div>
  <div v-else>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'

const userStore = useUserStore()
const router = useRouter()
const loading = ref(true)
const error = ref(null)

const checkTeam = async () => {
  try {
    console.log('Начинаем проверку команды')
    // Загружаем профиль пользователя
    const response = await fetch('http://127.0.0.1:8000/api/internal/v1/user/profile/', {
      headers: {
        'Authorization': `Bearer ${userStore.accessToken}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Ошибка при загрузке профиля')
    }
    
    const profileData = await response.json()
    console.log('Получены данные профиля:', profileData)
    
    // Сохраняем профиль в store
    userStore.setUserProfile(profileData)
    
    // Перенаправляем на соответствующий компонент
    if (profileData.is_team_created) {
      console.log('Команда создана, перенаправляем на /my-team')
      router.push({
        path: '/my-team',
        state: { profile: profileData }
      })
    } else {
      console.log('Команда не создана, перенаправляем на /create-team')
      router.push({
        path: '/create-team',
        state: { profile: profileData }
      })
    }
  } catch (error) {
    console.error('Error:', error)
    error.value = 'Произошла ошибка при проверке команды'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  console.log('FantasyView смонтирован')
  checkTeam()
})
</script>

<style scoped>
.loading, .error {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 1.2rem;
  color: #fff;
  background: linear-gradient(135deg, #1e3c72 0%, #2d0066 100%);
}

.error {
  color: #ff2e6e;
}

.debug-container {
  position: relative;
  min-height: 100vh;
}

.debug-box {
  position: fixed;
  top: 20px;
  left: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.9);
  color: #00ff87;
  padding: 20px;
  border-radius: 10px;
  z-index: 1000;
  font-family: monospace;
  border: 2px solid #00ff87;
}

.debug-box h3 {
  margin: 0 0 10px 0;
  color: #fff;
}

.debug-box pre {
  background: #1a1a1a;
  padding: 10px;
  border-radius: 5px;
  overflow-x: auto;
  margin: 10px 0;
  }

.debug-box p {
  margin: 5px 0;
  font-size: 14px;
}
</style> 
