<template>
  <div class="fantasy-container">
    <FantasyHeader active-menu="leagues" />
    <div class="main-content">
      <div class="placeholder-content">
        <h1>Лиги</h1>
        <p>Страница в разработке</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import FantasyHeader from '@/components/FantasyHeader.vue'

const router = useRouter()
const userStore = useUserStore()

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

<style scoped>
.fantasy-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2d0066 100%);
  margin-top: 0 !important;
  padding-top: 0 !important;
}

.main-content {
  max-width: 1500px;
  margin: 0 auto;
  padding: 2rem;
}

.placeholder-content {
  background: #23244a;
  border-radius: 18px;
  padding: 3rem;
  text-align: center;
  color: #fff;
}

.placeholder-content h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.placeholder-content p {
  font-size: 1.2rem;
  color: #c7c7e6;
}
</style> 