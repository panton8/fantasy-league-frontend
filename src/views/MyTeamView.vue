<template>
  <div class="fantasy-container">
    <FantasyHeader active-menu="myteam" />
    <CreateTeamView v-if="!userStore.profile?.is_team_created" />
    <div v-else class="main-content">
      <div class="fantasy-squad-setup">
        <div class="squad-header">
          <div class="header-left">
            <div class="gameweek">Тур 1</div>
            <div class="deadline">Дедлайн: 11 августа, 18:45</div>
          </div>
          <div class="team-name">{{ teamName }}</div>
        </div>

        <div class="squad-container">
          <!-- Основной состав -->
          <div class="squad-section">
            <div class="squad-row">
              <div v-for="player in squad.gkp" :key="player.id" class="player-slot">
                <div class="player-card">
                  <img :src="player.t_shirt" :alt="player.surname" class="player-shirt">
                  <div class="player-info">
                    <span class="player-name">{{ player.surname }}</span>
                    <span class="player-position">{{ getPositionLabel(player.position) }}</span>
                    <span v-if="player.is_captain" class="captain-badge">C</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="squad-row">
              <div v-for="player in squad.def" :key="player.id" class="player-slot">
                <div class="player-card">
                  <img :src="player.t_shirt" :alt="player.surname" class="player-shirt">
                  <div class="player-info">
                    <span class="player-name">{{ player.surname }}</span>
                    <span class="player-position">{{ getPositionLabel(player.position) }}</span>
                    <span v-if="player.is_captain" class="captain-badge">C</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="squad-row">
              <div v-for="player in squad.mid" :key="player.id" class="player-slot">
                <div class="player-card">
                  <img :src="player.t_shirt" :alt="player.surname" class="player-shirt">
                  <div class="player-info">
                    <span class="player-name">{{ player.surname }}</span>
                    <span class="player-position">{{ getPositionLabel(player.position) }}</span>
                    <span v-if="player.is_captain" class="captain-badge">C</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="squad-row">
              <div v-for="player in squad.fwd" :key="player.id" class="player-slot">
                <div class="player-card">
                  <img :src="player.t_shirt" :alt="player.surname" class="player-shirt">
                  <div class="player-info">
                    <span class="player-name">{{ player.surname }}</span>
                    <span class="player-position">{{ getPositionLabel(player.position) }}</span>
                    <span v-if="player.is_captain" class="captain-badge">C</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Запасные -->
          <div class="bench-section">
            <h3>Запасные</h3>
            <div class="bench-row">
              <div v-for="player in [...bench.gkp, ...bench.def, ...bench.mid, ...bench.fwd]" :key="player.id" class="player-slot">
                <div class="player-card">
                  <div class="bench-position">{{ getPositionLabel(player.position) }}</div>
                  <img :src="player.t_shirt" :alt="player.surname" class="player-shirt">
                  <div class="player-info bench-info">
                    <span class="player-name bench-name">{{ player.surname }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import axios from 'axios'
import UserInfo from '@/components/UserInfo.vue'
import FantasyHeader from '@/components/FantasyHeader.vue'
import CreateTeamView from '@/views/CreateTeamView.vue'

const router = useRouter()
const userStore = useUserStore()

const activeMenu = ref('myteam')
const squad = ref({
  gkp: [],
  def: [],
  mid: [],
  fwd: []
})
const bench = ref({
  gkp: [],
  def: [],
  mid: [],
  fwd: []
})

// Вычисляемое свойство для имени команды
const teamName = computed(() => {
  return userStore.teamInfo?.name ||'Моя команда'
})

const getPositionLabel = (position) => {
  const labels = {
    'gkp': 'Вратарь',
    'def': 'Защитник',
    'mid': 'Полузащитник',
    'fwd': 'Нападающий'
  }
  return labels[position.toLowerCase()] || position
}

const handleMenuClick = (menu) => {
  activeMenu.value = menu
  switch (menu) {
    case 'home':
      router.push('/fantasy')
      break
    case 'points':
      router.push('/fantasy/stats')
      break
    case 'myteam':
      router.push('/my-team')
      break
    case 'transfers':
      router.push('/fantasy/transfers')
      break
    case 'leagues':
      router.push('/fantasy/leagues')
      break
  }
}

const handleLogout = async () => {
  try {
    await userStore.logout()
    await router.push('/auth')
  } catch (error) {
    console.error('Ошибка при выходе:', error)
  }
}

const fetchTeamInfo = async () => {
  console.log('Начало загрузки информации о команде')
  try {
    const accessToken = userStore.accessToken
    if (!accessToken) {
      console.error('Нет токена доступа')
      return
    }

    const response = await fetch('http://127.0.0.1:8000/api/internal/v1/user/team/team-info/', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      console.error('Ошибка при получении информации о команде:', response.status)
      return
    }

    const data = await response.json()
    console.log('Получены данные команды:', data)

    // Очищаем текущие данные
    squad.value = {
      gkp: [],
      def: [],
      mid: [],
      fwd: []
    }
    bench.value = {
      gkp: [],
      def: [],
      mid: [],
      fwd: []
    }

    // Обрабатываем стартовый состав
    if (data.start_players && data.start_players.length > 0) {
      console.log('Обработка стартового состава:', data.start_players)
      data.start_players.forEach(player => {
        const position = player.position.toLowerCase()
        console.log('Обработка игрока:', { surname: player.surname, position })
        if (squad.value[position]) {
          squad.value[position].push({
            id: player.id,
            surname: player.surname,
            position: position,
            t_shirt: player.t_shirt,
            is_captain: player.is_captain
          })
        }
      })
    }

    // Обрабатываем запасных
    if (data.bench_players && data.bench_players.length > 0) {
      console.log('Обработка запасных:', data.bench_players)
      data.bench_players.forEach(player => {
        const position = player.position.toLowerCase()
        console.log('Обработка запасного игрока:', { surname: player.surname, position })
        if (bench.value[position]) {
          bench.value[position].push({
            id: player.id,
            surname: player.surname,
            position: position,
            t_shirt: player.t_shirt,
            is_captain: player.is_captain
          })
        }
      })
    }

    console.log('Итоговый состав:', { squad: squad.value, bench: bench.value })
  } catch (error) {
    console.error('Ошибка при загрузке информации о команде:', error)
  }
}

const fetchUserProfile = async () => {
  console.log('Начало загрузки профиля пользователя')
  try {
    const accessToken = userStore.accessToken
    if (!accessToken) {
      console.error('Нет токена доступа')
      return
    }

    const response = await fetch('http://127.0.0.1:8000/api/internal/v1/user/profile/', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      console.error('Ошибка при получении профиля:', response.status)
      return
    }

    const data = await response.json()
    console.log('Получены данные профиля:', data)
    userStore.setUserProfile(data)
  } catch (error) {
    console.error('Ошибка при загрузке профиля:', error)
  }
}

onMounted(async () => {
  console.log('Компонент MyTeamView смонтирован')
  await Promise.all([fetchUserProfile(), fetchTeamInfo()])
  console.log('Загрузка данных завершена')
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

.fantasy-squad-setup {
  background: #23244a;
  border-radius: 18px;
  box-shadow: 0 6px 32px rgba(30,60,114,0.13), 0 1.5px 6px rgba(0,0,0,0.08);
  margin: 0.5rem auto 1rem auto;
  max-width: 700px;
  padding: 0 0 1.5rem 0;
  overflow: hidden;
}

.squad-header {
  background: linear-gradient(90deg, #1e3c72 0%, #37003c 100%);
  padding: 0.8rem 2rem 0.6rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 18px 18px 0 0;
  position: relative;
}

.header-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.squad-header .team-name {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
  background: rgba(255, 255, 255, 0.08);
  padding: 0.4rem 1rem;
  border-radius: 6px;
  backdrop-filter: blur(5px);
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
}

.squad-header .gameweek {
  color: #fff;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.1rem;
  text-align: center;
}

.squad-header .deadline {
  color: #c7c7e6;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
}

.squad-stats {
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.squad-stats .players-selected {
  background: #ff2e6e;
  color: #fff;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 20px;
  padding: 0.4rem 1.2rem;
  box-shadow: 0 2px 8px rgba(255,46,110,0.08);
}

.squad-stats .budget {
  background: #00c48c;
  color: #fff;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 20px;
  padding: 0.4rem 1.2rem;
  box-shadow: 0 2px 8px rgba(0,196,140,0.08);
}

.squad-container {
  display: flex;
  flex-direction: column;
  gap: 0rem;  
  margin-bottom: 0rem;
  margin-top: -15px;
}

.squad-section {
  margin-bottom: 0;
}

.section-header-row {
  display: flex;
  align-items: center;
  margin-bottom: 0.2rem;
  justify-content: space-between;
}

.section-title {
  min-width: 180px;
  max-width: 180px;
  flex-basis: 180px;
  text-align: center;
  display: inline-block;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  position: relative;
}

.section-title.gk { 
  background: #00c48c; 
  color: #fff; 
}

.section-title.def { 
  background: #37003c; 
  color: #fff; 
}

.section-title.mid { 
  background: #3a8fff; 
  color: #fff; 
}

.section-title.fwd { 
  background: #ff2e6e; 
  color: #fff; 
}

.section-title.bench { 
  background: #3a8fff; 
  color: #fff; 
}

.squad-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 0.3rem 1.5rem;
  background: #23244a;
  border-bottom: 1px solid #2d2e5a;
  font-size: 1.05rem;
  font-weight: 500;
  color: #fff;
  position: relative;
  margin-bottom: 0.3rem;
  flex-wrap: wrap;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

.squad-row:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.player-slot {
  width: 97px;
  height: 125px;
  position: relative;
}

.player-card {
  background: white;
  border-radius: 8px;
  padding: 0.6rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  position: relative;
}

.player-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

.player-shirt {
  width: 69px;
  height: 69px;
  object-fit: contain;
  margin-bottom: 0.3rem;
}

.player-info {
  text-align: center;
  width: 100%;
  position: absolute;
  bottom: 0.5rem;
  left: 0;
  right: 0;
}

.player-name {
  display: block;
  font-weight: bold;
  color: #1a237e;
  margin-bottom: 0.2rem;
  font-size: 0.85rem;
}

.player-position {
  display: none;
}

.squad-row .player-position {
  display: none;
}

.bench-section {
  background: #23244a;
  border-radius: 8px;
  padding: 0.2rem 1rem 0.5rem 1rem;
  margin-top: 0.2rem;
  position: relative;
}

.bench-section h3 {
  color: #fff;
  text-align: center;
  margin-bottom: 0.2rem;
  font-size: 1.4rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  padding: 0.1rem 0;
}

.bench-row {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 0.2rem;
  flex-wrap: nowrap;
  margin-top: 0;
}

.bench-row .player-slot {
  width: 97px;
  height: 125px;
  position: relative;
  flex-shrink: 0;
  margin-top: 0;
}

.bench-row .player-card {
  padding: 1rem;
}

.bench-row .player-shirt {
  width: 69px;
  height: 69px;
  margin-top: 1.4rem;
  margin-bottom: 0.3rem;
}

.bench-row .player-info {
  text-align: center;
  width: 100%;
  position: absolute;
  bottom: 1rem;
  left: 0;
  right: 0;
}

.bench-row .player-name {
  display: block;
  font-weight: bold;
  color: #1a237e;
  font-size: 0.85rem;
}

.captain-badge {
  position: absolute;
  top: -5.5rem;
  left: 0.5rem;
  background: #ff2e6e;
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  z-index: 2;
}

.bench-position {
  position: absolute;
  top: 0.5rem;
  left: 0;
  right: 0;
  text-align: center;
  color: #fff;
  background: #37003c;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 4px 4px 0 0;
  padding: 0.1rem 0;
  z-index: 2;
  width: 90%;
  margin: 0 auto;
}

.bench-info {
  bottom: 0.1rem;
}

.bench-name {
  display: block;
  margin-bottom:-1.25rem;
}

@media (max-width: 1100px) {
  .fantasy-main-flex {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .fantasy-players-panel {
    width: 100%;
    max-width: 100vw;
    position: static;
    margin-top: 1.5rem;
    max-height: none;
  }
}

@media (max-width: 1000px) {
  .fantasy-squad-setup {
    max-width: 99vw;
    margin: 1.2rem 0.2rem;
    padding: 0 0 1.2rem 0;
  }
  
  .squad-header {
    padding: 1.1rem 0.5rem 1rem 0.5rem;
  }
  
  .section-title {
    min-width: 120px;
    max-width: 120px;
    flex-basis: 120px;
  }
  
  .price {
    margin-left: 20px;
    min-width: 50px;
  }
}

@media (max-width: 600px) {
  .fantasy-squad-setup {
    margin: 0.5rem 0.1rem;
    padding: 0 0 0.5rem 0;
  }
  
  .squad-header {
    padding: 0.7rem 0.2rem 0.7rem 0.2rem;
  }
  
  .squad-row {
    padding: 0.5rem 0.5rem;
    font-size: 0.95rem;
  }
  
  .squad-actions {
    flex-direction: column;
    gap: 0.7rem;
    margin-top: 1.2rem;
  }
  
  .section-title {
    min-width: 90px;
    max-width: 90px;
    flex-basis: 90px;
  }
  
  .price {
    margin-left: 10px;
  }
}
</style> 