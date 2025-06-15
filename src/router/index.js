import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import AuthView from '@/views/AuthView.vue'
import MyTeamView from '@/views/MyTeamView.vue'
import CreateTeamView from '@/views/CreateTeamView.vue'
import MatchDetails from '@/components/MatchDetails.vue'
import PointsView from '@/views/PointsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      name: 'auth',
      component: AuthView
    },
    {
      path: '/my-team',
      name: 'my-team',
      component: MyTeamView,
      meta: { requiresAuth: true }
    },
    {
      path: '/create-team',
      name: 'create-team',
      component: CreateTeamView,
      meta: { requiresAuth: true }
    },
    {
      path: '/',
      redirect: '/fantasy'
    },
    {
      path: '/fantasy',
      name: 'fantasy',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/transfers',
      name: 'transfers',
      component: () => import('@/views/TransfersView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/leagues',
      name: 'leagues',
      component: () => import('@/views/LeagueView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/fantasy/stats',
      name: 'stats',
      component: () => import('@/views/PointsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/fantasy/prizes',
      name: 'prizes',
      component: () => import('../views/PrizesView.vue')
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
    },
    {
      path: '/match/:id',
      name: 'match-lineup',
      component: () => import('../views/MatchLineupView.vue')
    },
    {
      path: '/league/match/:id',
      name: 'match-details',
      component: MatchDetails
    },
    {
      path: '/points',
      name: 'points',
      component: PointsView,
      meta: { requiresAuth: true }
    }
  ]
})

// Защита маршрутов
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
      next('/auth')
  } else {
    next()
  }
})

export default router 
