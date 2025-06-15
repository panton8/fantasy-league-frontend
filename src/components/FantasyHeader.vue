<template>
  <div class="fantasy-hero">
    <div class="fantasy-hero-bg"></div>
    <div class="fantasy-hero-content">
      <div class="fantasy-logo-block">
        <img src="@/assets/fantasy-logo.png" alt="Fantasy League" class="fantasy-logo">
      </div>
      <UserInfo />
    </div>
    <nav class="fantasy-menu">
      <button class="menu-btn" :class="{active: activeMenu === 'home'}" @click="handleMenuClick('home')">Главная</button>
      <button class="menu-btn" :class="{active: activeMenu === 'myteam'}" @click="handleMenuClick('myteam')">Моя команда</button>
      <button v-if="userStore.profile?.is_team_created" class="menu-btn" :class="{active: activeMenu === 'points'}" @click="handleMenuClick('points')">Очки</button>
      <button v-if="userStore.profile?.is_team_created" class="menu-btn" :class="{active: activeMenu === 'transfers'}" @click="handleMenuClick('transfers')">Трансферы</button>
      <button v-if="userStore.profile?.is_team_created" class="menu-btn" :class="{active: activeMenu === 'leagues'}" @click="handleMenuClick('leagues')">Лиги</button>
    </nav>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import UserInfo from '@/components/UserInfo.vue'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  activeMenu: {
    type: String,
    required: true
  }
})

const router = useRouter()
const userStore = useUserStore()

const handleMenuClick = (key) => {
  if (key === 'home') {
    router.push('/fantasy')
  } else if (key === 'myteam') {
    if (userStore.profile?.is_team_created) {
      router.push('/my-team')
    } else {
      router.push('/create-team')
    }
  } else if (key === 'points') {
    router.push('/points')
  } else if (key === 'transfers') {
    router.push('/transfers')
  } else if (key === 'leagues') {
    router.push('/leagues')
  }
}
</script>

<style scoped>
.fantasy-hero {
  position: relative;
  width: 100vw;
  max-width: 100%;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  min-height: 120px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-top: 0 !important;
  padding-top: 0 !important;
  top: 0 !important;
}

.fantasy-hero-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(90deg, #1e3c72 0%, #37003c 100%);
}

.fantasy-hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  height: 70px;
  max-width: 1500px;
  margin: 0 auto;
  padding: 0 2rem;
}

.fantasy-logo-block {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.fantasy-logo {
  height: 230px;
  width: auto;
  filter: drop-shadow(0 10px 8px rgba(0,0,0,0.08));
  margin-left: 45rem;
}

.fantasy-menu {
  position: relative;
  z-index: 4;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  margin-bottom: 0.1rem;
  padding: 0 2rem;
  flex-wrap: wrap;
}

.menu-btn {
  background: #23244a;
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  border: none;
  border-radius: 6px 6px 0 0;
  padding: 0.9rem 1.5rem 0.7rem 1.5rem;
  margin-bottom: -2px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.menu-btn.active {
  background: #37003c;
  color: #00ff87;
  box-shadow: 0 2px 8px rgba(0,0,0,0.18);
}

.menu-btn:hover:not(.active) {
  background: #2d0066;
}
</style> 