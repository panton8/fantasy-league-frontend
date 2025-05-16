import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    accessToken: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token'),
    profile: null,
    teamInfo: null
  }),

  actions: {
    setTokens(access, refresh) {
      console.log('Устанавливаем токены:', { access, refresh })
      this.accessToken = access
      this.refreshToken = refresh
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
    },

    setUserProfile(profile) {
      console.log('Устанавливаем профиль пользователя:', profile)
      this.profile = profile
    },

    setTeamInfo(teamInfo) {
      console.log('Устанавливаем информацию о команде:', teamInfo)
      this.teamInfo = teamInfo
    },

    async logout() {
      console.log('Выход из системы')
      try {
        // Очищаем локальное хранилище
      this.accessToken = null
      this.refreshToken = null
      this.profile = null
        this.teamInfo = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      } catch (error) {
        console.error('Ошибка при выходе:', error)
        throw error
      }
    },

    async initializeUser() {
      console.log('Инициализация пользователя')
      const accessToken = localStorage.getItem('access_token')
      if (!accessToken) {
        console.log('Нет токена доступа')
        return
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/internal/v1/user/profile/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })

        if (!response.ok) {
          if (response.status === 401) {
            console.log('Токен истек, очищаем хранилище')
            this.logout()
            return
          }
          throw new Error('Ошибка при получении профиля')
        }

        const data = await response.json()
        console.log('Получены данные профиля:', data)
        this.setUserProfile(data)

        if (data.is_team_created) {
          console.log('У пользователя есть команда, загружаем данные')
          const teamResponse = await fetch('http://127.0.0.1:8000/api/internal/v1/user/team/team-info/', {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          })

          if (teamResponse.ok) {
            const teamData = await teamResponse.json()
            console.log('Получены данные команды:', teamData)
            this.setTeamInfo(teamData)
          }
        }
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