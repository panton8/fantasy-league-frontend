<template>
  <div class="user-info">
    <div class="user-details">
      <span class="username">{{ userStore.profile?.username }}</span>
      <span class="budget">Бюджет: {{ userStore.profile?.budget || 0 }}M</span>
      <button class="logout-btn" @click="handleLogout">Выйти</button>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const handleLogout = async () => {
  try {
    await userStore.logout()
    await router.push('/auth')
  } catch (error) {
    console.error('Ошибка при выходе:', error)
  }
}
</script>

<style scoped>
.user-info {
  position: absolute;
  right: -22rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 1.7rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.6rem 1.1rem;
  border-radius: 8px;
  backdrop-filter: blur(5px);
}

.user-details {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 0;
  padding-left: 0;
  border-left: none;
}

.username {
  color: #fff;
  font-weight: 500;
  font-size: 0.85rem;
  background: rgba(255, 255, 255, 0.15);
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
}

.budget {
  background: rgba(0, 196, 140, 0.2);
  color: #fff;
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  border: 1px solid rgba(0, 196, 140, 0.3);
}

.logout-btn {
  background: #ff2e6e;
  color: #fff;
  border: none;
  padding: 0.3rem 0.85rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(255,46,110,0.2);
}

.logout-btn:hover {
  background: #b3003c;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255,46,110,0.3);
}
</style> 