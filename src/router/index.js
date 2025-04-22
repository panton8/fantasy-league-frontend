import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/fantasy'
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/AuthView.vue')
    },
    {
      path: '/fantasy',
      name: 'fantasy',
      component: () => import('@/views/FantasyView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/fantasy/prizes',
      name: 'prizes',
      component: () => import('../views/PrizesView.vue')
    },
    {
      path: '/fantasy/stats',
      name: 'stats',
      component: () => import('../views/StatsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/fantasy/help',
      name: 'help',
      component: () => import('../views/HelpView.vue')
    },
    // Маршруты Высшей Лиги (не требуют авторизации)
    {
      path: '/league/clubs',
      name: 'clubs',
      component: () => import('../views/ClubsView.vue')
    },
    {
      path: '/league/club/:pk',
      name: 'club-detail',
      component: () => import('../views/ClubDetailView.vue')
    },
    {
      path: '/league/upcoming',
      name: 'upcoming',
      component: () => import('../views/UpcomingGamesView.vue')
    },
    {
      path: '/league/results',
      name: 'results',
      component: () => import('../views/ResultsView.vue')
    },
    {
      path: '/league/table',
      name: 'table',
      component: () => import('../views/TableView.vue')
    },
    {
      path: '/league/stats',
      name: 'leagueStats',
      component: () => import('../views/LeagueStatsView.vue')
    },
    {
      path: '/league/news',
      name: 'news',
      component: () => import('../views/NewsView.vue')
    }
  ]
})

// Защита маршрутов
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth) {
    if (!userStore.isAuthenticated) {
      next('/auth')
      return
    }
    
    // Если пользователь аутентифицирован, но профиль еще не загружен
    if (!userStore.profile) {
      await userStore.initializeUser()
      // Если после инициализации токен оказался недействительным
      if (!userStore.isAuthenticated) {
        next('/auth')
        return
      }
    }
  }
  
  next()
})

export default router 