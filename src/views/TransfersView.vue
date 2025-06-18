<template>
  <div class="fantasy-container">
    <FantasyHeader :active-menu="activeMenu" />
    <div v-if="userStore.profile?.is_team_created" class="main-content">
      <div class="fantasy-squad-setup">
        <div class="squad-header">
          <div class="header-left">
            <div class="gameweek">Тур 1</div>
            <div class="deadline">Дедлайн: 11 августа, 18:45</div>
          </div>
          <div class="squad-stats">
            <span class="budget">{{ userStore.profile?.budget || 0 }}</span>
          </div>
        </div>

        <div class="squad-container">
          <!-- Основной состав -->
          <div class="squad-section">
            <div class="squad-row">
              <div v-for="player in squad.gkp" :key="player.id" class="player-slot" @click="openTransferModal(player)">
                <div class="player-card">
                  <img :src="player.t_shirt" :alt="player.surname" class="player-shirt">
                  <div class="player-info">
                    <span class="player-name">{{ player.surname }}</span>
                    <span class="player-position">{{ getPositionLabel(player.position) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="squad-row">
              <div v-for="player in squad.def" :key="player.id" class="player-slot" @click="openTransferModal(player)">
                <div class="player-card">
                  <img :src="player.t_shirt" :alt="player.surname" class="player-shirt">
                  <div class="player-info">
                    <span class="player-name">{{ player.surname }}</span>
                    <span class="player-position">{{ getPositionLabel(player.position) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="squad-row">
              <div v-for="player in squad.mid" :key="player.id" class="player-slot" @click="openTransferModal(player)">
                <div class="player-card">
                  <img :src="player.t_shirt" :alt="player.surname" class="player-shirt">
                  <div class="player-info">
                    <span class="player-name">{{ player.surname }}</span>
                    <span class="player-position">{{ getPositionLabel(player.position) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="squad-row">
              <div v-for="player in squad.fwd" :key="player.id" class="player-slot" @click="openTransferModal(player)">
                <div class="player-card">
                  <img :src="player.t_shirt" :alt="player.surname" class="player-shirt">
                  <div class="player-info">
                    <span class="player-name">{{ player.surname }}</span>
                    <span class="player-position">{{ getPositionLabel(player.position) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Запасные -->
          <div class="bench-section">
            <h3>Запасные</h3>
            <div class="bench-row">
              <div 
                v-for="player in [...bench.gkp, ...bench.def, ...bench.mid, ...bench.fwd]" 
                :key="player.id" 
                class="player-slot"
                @click="openTransferModal(player)"
              >
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
          <div class="fantasy-under-construction" style="padding: 2rem;">Страница в разработке</div>
        </div>
      </div>
    </div>

    <TransferPlayerModal
      :is-open="isTransferModalOpen"
      :current-player="selectedPlayer"
      @close="closeTransferModal"
      @transfer-completed="handleTransferCompleted"
    />
    <PlayerListModal
      :visible="showPlayerList"
      :position="selectedPlayer?.position"
      :players="availablePlayers"
      :player-to-replace="selectedPlayer?.id"
      @close="closePlayerList"
      @select="handlePlayerSelect"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import axios from 'axios'
import FantasyHeader from '@/components/FantasyHeader.vue'
import TransferPlayerModal from '@/components/TransferPlayerModal.vue'
import PlayerListModal from '@/components/PlayerListModal.vue'

const router = useRouter()
const userStore = useUserStore()

const activeMenu = ref('transfers')
const teamName = ref('')
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

const showTransferModal = ref(false)
const selectedPlayer = ref(null)
const isSwapMode = ref(false)
const playerToSwap = ref(null)
const isTransferModalOpen = ref(false)
const oldPlayer = ref(null)
const newPlayer = ref(null)

const showPlayerList = ref(false)
const availablePlayers = ref([])

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
        console.log('Обработка запасного:', { surname: player.surname, position })
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

    // Обновляем имя команды
    teamName.value = data.name || 'Моя команда'
  } catch (error) {
    console.error('Ошибка при получении информации о команде:', error)
  }
}

const fetchBudget = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/internal/v1/user/team/budget/', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })

    if (!response.ok) {
      throw new Error('Ошибка при получении бюджета')
    }

    const data = await response.json()
    userStore.profile.budget = data.budget
  } catch (error) {
    console.error('Ошибка при получении бюджета:', error)
  }
}

onMounted(() => {
  if (!userStore.profile?.is_team_created) {
    router.replace('/create-team')
  } else {
    fetchTeamInfo()
  }
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
      router.push('/transfers')
      break
    case 'leagues':
      router.push('/fantasy/leagues')
      break
  }
}

const openTransferModal = (player) => {
  console.log('ID выбранного игрока:', player.id)
  oldPlayer.value = player.id
  selectedPlayer.value = player
  isTransferModalOpen.value = true
}

const closeTransferModal = () => {
  console.log('Closing transfer modal')
  isTransferModalOpen.value = false
  selectedPlayer.value = null
}

const handleTransfer = (player) => {
  console.log('ID нового игрока:', player.id)
  newPlayer.value = player.id
  // Обновляем состав команды
  fetchTeamInfo()
}

const closePlayerList = () => {
  showPlayerList.value = false
  availablePlayers.value = []
}

const handlePlayerSelect = async (player) => {
  try {
    console.log('Выбран новый игрок:', player)
    const response = await fetch('http://127.0.0.1:8000/api/internal/v1/user/team/transfer/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify({
        new_player: player.id,
        old_player: selectedPlayer.value.id
      })
    })

    if (!response.ok) {
      throw new Error('Ошибка при совершении трансфера')
    }

    // Закрываем все модальные окна
    isTransferModalOpen.value = false
    showPlayerList.value = false
    selectedPlayer.value = null

    // Обновляем информацию о команде и бюджете
    await Promise.all([
      fetchTeamInfo(),
      fetchBudget()
    ])
    
    // Показываем уведомление об успешном трансфере
    alert('Трансфер успешно совершен!')
  } catch (error) {
    console.error('Ошибка при совершении трансфера:', error)
    alert('Произошла ошибка при совершении трансфера')
  }
}

const handleTransferCompleted = async () => {
  // Обновляем информацию о команде и бюджете
  await Promise.all([
    fetchTeamInfo(),
    fetchBudget()
  ])
}

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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #23244a;
  border-radius: 8px;
  margin-bottom: 1rem;
  color: #fff;
  position: relative;
}

.header-left {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex: 1;
  justify-content: center;
}

.gameweek {
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  text-align: center;
}

.deadline {
  font-size: 0.9rem;
  color: #a0a0a0;
  text-align: center;
}

.squad-stats {
  display: flex;
  gap: 1rem;
  align-items: center;
  position: absolute;
  right: 1.5rem;
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

/* Специальные стили для ряда с вратарем */
.squad-row:first-child {
  justify-content: center;
  min-height: 135px;
}

.squad-row:first-child .player-slot {
  margin: 0 auto;
}

.squad-row:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.player-slot {
  width: 97px;
  height: 125px;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.player-slot:hover {
  transform: translateY(-2px);
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
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid #ddd;
}

.player-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.bench-position {
  position: absolute;
  top: 0.5rem;
  left: 0;
  right: 0;
  text-align: center;
  color: #fff;
  background: #37003c;
  font-size: 0.7rem;
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

.player-info {
  position: absolute;
  bottom: 0.5rem;
  left: 0;
  right: 0;
}

.captain-badge {
  display: none; /* Скрываем капитанскую повязку */
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

/* Удаленные стили для обмена и подсветки */
/*
.squad-section.swap-mode .player-card {
  opacity: 0.5;
  pointer-events: none;
}

.player-slot.highlighted {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
}
*/
</style> 
