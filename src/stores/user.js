import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    accessToken: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token'),
    profile: null
  }),

  actions: {
    setTokens(access, refresh) {
      this.accessToken = access
      this.refreshToken = refresh
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
    },

    setUserProfile(profile) {
      this.profile = profile
    },

    logout() {
      this.accessToken = null
      this.refreshToken = null
      this.profile = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    },

    async initializeUser() {
      const accessToken = localStorage.getItem('access_token')
      if (!accessToken) return

      try {
        const response = await fetch('http://127.0.0.1:8000/api/internal/v1/user/profile/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })

        if (!response.ok) {
          // Если токен протух, очищаем хранилище
          if (response.status === 401) {
            this.logout()
            return
          }
          throw new Error('Ошибка при получении профиля')
        }

        const data = await response.json()
        this.setUserProfile(data)
      } catch (error) {
        console.error('Ошибка при инициализации пользователя:', error)
      }
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    username: (state) => state.profile?.username,
    budget: (state) => state.profile?.budget
  }
}) 