<template>
  <div class="fantasy-container">
    <FantasyHeader :active-menu="'myteam'" />
    <main class="main-content fantasy-main-flex">
      <div class="fantasy-squad-setup">
        <div class="squad-header">
          <div class="gameweek">Тур 1</div>
          <div class="deadline">Дедлайн: <b>10 мая 15:30</b></div>
          <div class="squad-stats">
            <span class="players-selected">{{ selectedCount }} / 15</span>
            <span class="budget">{{ budget.toFixed(1) }}</span>
          </div>
        </div>
        <div v-if="showLimitMsg" class="squad-limit-msg">{{ showLimitMsg }}</div>

        <div class="squad-container">
          <!-- Основной состав -->
          <div class="squad-section">
            <div class="squad-row">
              <div v-for="(player, idx) in squad.gkp" :key="'gk'+idx" class="player-slot">
                <div class="player-card" @click="handleSelectPosition('gkp')">
                  <div class="position-label">Вратарь</div>
                  <template v-if="player">
                    <img :src="player.t_shirt" :alt="player.surname" class="player-shirt">
                    <div class="player-info">
                      <span class="player-name">{{ player.surname }}</span>
                      <span class="player-cost">{{ player.cost }}M</span>
                      <span v-if="player.is_captain" class="captain-badge">C</span>
                    </div>
                  </template>
                  <template v-else>
                    <div class="add-player">
                      <span class="plus-icon">+</span>
                      <span class="add-text">Выбрать игрока</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <div class="squad-row">
              <div v-for="(player, idx) in squad.def" :key="'def'+idx" class="player-slot">
                <div class="player-card" @click="handleSelectPosition('def')">
                  <div class="position-label">Защитник</div>
                  <template v-if="player">
                    <img :src="player.t_shirt" :alt="player.surname" class="player-shirt">
                    <div class="player-info">
                      <span class="player-name">{{ player.surname }}</span>
                      <span class="player-cost">{{ player.cost }}M</span>
                      <span v-if="player.is_captain" class="captain-badge">C</span>
                    </div>
                  </template>
                  <template v-else>
                    <div class="add-player">
                      <span class="plus-icon">+</span>
                      <span class="add-text">Выбрать игрока</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <div class="squad-row">
              <div v-for="(player, idx) in squad.mid" :key="'mid'+idx" class="player-slot">
                <div class="player-card" @click="handleSelectPosition('mid')">
                  <div class="position-label">Полузащитник</div>
                  <template v-if="player">
                    <img :src="player.t_shirt" :alt="player.surname" class="player-shirt">
                    <div class="player-info">
                      <span class="player-name">{{ player.surname }}</span>
                      <span class="player-cost">{{ player.cost }}M</span>
                      <span v-if="player.is_captain" class="captain-badge">C</span>
                    </div>
                  </template>
                  <template v-else>
                    <div class="add-player">
                      <span class="plus-icon">+</span>
                      <span class="add-text">Выбрать игрока</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <div class="squad-row">
              <div v-for="(player, idx) in squad.fwd" :key="'fwd'+idx" class="player-slot">
                <div class="player-card" @click="handleSelectPosition('fwd')">
                  <div class="position-label">Нападающий</div>
                  <template v-if="player">
                    <img :src="player.t_shirt" :alt="player.surname" class="player-shirt">
                    <div class="player-info">
                      <span class="player-name">{{ player.surname }}</span>
                      <span class="player-cost">{{ player.cost }}M</span>
                      <span v-if="player.is_captain" class="captain-badge">C</span>
                    </div>
                  </template>
                  <template v-else>
                    <div class="add-player">
                      <span class="plus-icon">+</span>
                      <span class="add-text">Выбрать игрока</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <div class="squad-actions">
            <button class="reset" @click="handleResetSquad">Сбросить состав</button>
            <button class="enter-squad" @click="handleSubmitSquad">Подтвердить состав</button>
          </div>
        </div>
      </div>

      <aside class="fantasy-players-panel">
        <div class="players-filter-block">
          <div class="filter-title">Фильтры игроков</div>
          <div class="filter-row">
            <label>Позиция:</label>
            <select v-model="filterPosition" class="filter-select">
              <option value="">Все</option>
              <option value="gkp">Вратари</option>
              <option value="def">Защитники</option>
              <option value="mid">Полузащитники</option>
              <option value="fwd">Нападающие</option>
            </select>
          </div>
          <div class="filter-row">
            <label>Клуб:</label>
            <select v-model="filterClub" class="filter-select">
              <option value="">Все</option>
              <option v-for="club in clubs" :key="club" :value="club">{{ club }}</option>
            </select>
          </div>
          <div class="filter-row">
            <label>Цена от:</label>
            <input type="number" v-model="filterMinPrice" class="filter-input" min="0" max="15" step="0.1">
          </div>
          <div class="filter-row">
            <label>Цена до:</label>
            <input type="number" v-model="filterMaxPrice" class="filter-input" min="0" max="15" step="0.1">
          </div>
        </div>
        <div class="players-list">
          <div v-for="player in filteredPlayers" :key="player.id" class="player-item" @click="handleSelectPlayer(player)">
            <img :src="player.t_shirt" class="player-shirt" :alt="player.surname">
            <div class="player-details">
              <span class="player-name">{{ player.surname }}</span>
              <span class="player-club">{{ player.club }}</span>
              <span class="player-cost">{{ player.cost }}M</span>
            </div>
          </div>
        </div>
      </aside>
    </main>
    <PopupModal :visible="showPopup" :message="popupMsg" @close="showPopup = false" />
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { onMounted, computed, ref, watch } from 'vue'
import UserInfo from '@/components/UserInfo.vue'
import PopupModal from '@/components/PopupModal.vue'
import FantasyHeader from '@/components/FantasyHeader.vue'

const userStore = useUserStore()
const router = useRouter()

const activeMenu = ref('myteam')
const handleMenuClick = (key) => {
  activeMenu.value = key
  if (key === 'home') {
    router.push('/fantasy')
  } else if (key === 'myteam') {
    if (userStore.profile?.is_team_created) {
      router.push('/my-team')
    } else {
      router.push('/create-team')
    }
  }
}

// --- Состав и бюджет ---
const SQUAD_LIMITS = { gkp: 2, def: 5, mid: 5, fwd: 3 }
const squad = ref({
  gkp: Array(2).fill(null),
  def: Array(5).fill(null),
  mid: Array(5).fill(null),
  fwd: Array(3).fill(null)
})
const budget = ref(100.0)
const maxPlayers = 15
const selectedCount = computed(() =>
  [...squad.value.gkp, ...squad.value.def, ...squad.value.mid, ...squad.value.fwd].filter(Boolean).length
)
const showLimitMsg = ref('')
const showPopup = ref(false)
const popupMsg = ref('')

function addPlayerToSquad(player) {
  const pos = player.position
  const idx = squad.value[pos].findIndex(p => p === null)
  if (idx === -1) {
    popupMsg.value = `Максимальное количество игроков позиции уже выбрано!`
    showPopup.value = true
    return
  }
  if (budget.value < parseFloat(player.cost)) {
    popupMsg.value = 'Недостаточно бюджета!'
    showPopup.value = true
    return
  }
  // Проверка на лимит игроков из одного клуба
  const allPlayers = [...squad.value.gkp, ...squad.value.def, ...squad.value.mid, ...squad.value.fwd].filter(Boolean)
  const sameClubCount = allPlayers.filter(p => p.club === player.club).length
  if (sameClubCount >= 3) {
    popupMsg.value = 'В составе не может быть больше 3 игроков из одного клуба!'
    showPopup.value = true
    return
  }
  // Запретить дублирование одного и того же игрока
  if (allPlayers.some(p => p && p.id === player.id)) {
    popupMsg.value = 'Этот игрок уже в составе!'
    showPopup.value = true
    return
  }
  squad.value[pos][idx] = player
  budget.value -= parseFloat(player.cost)
}

function removePlayerFromSquad(pos, idx) {
  const player = squad.value[pos][idx]
  if (player) {
    budget.value += parseFloat(player.cost)
    squad.value[pos][idx] = null
  }
}

// --- Список игроков и фильтры справа ---
const playerList = ref([])
const playerLoading = ref(false)
const playerError = ref('')
const filterPosition = ref('')
const filterClub = ref('')
const filterMinPrice = ref('')
const filterMaxPrice = ref('')
const clubs = ref([])

const fetchPlayers = async () => {
  playerLoading.value = true
  playerError.value = ''
  let url = 'http://127.0.0.1:8000/api/internal/v1/player/?'
  if (filterPosition.value) url += `position=${filterPosition.value}&`
  if (filterClub.value) url += `club=${filterClub.value}&`
  if (filterMinPrice.value) url += `cost_min=${filterMinPrice.value}&`
  if (filterMaxPrice.value) url += `cost_max=${filterMaxPrice.value}&`
  try {
    const res = await fetch(url)
    const data = await res.json()
    playerList.value = data.results
    const clubSet = new Set(data.results.map(p => p.club))
    clubs.value = Array.from(clubSet)
  } catch (e) {
    playerError.value = 'Ошибка загрузки игроков'
  } finally {
    playerLoading.value = false
  }
}

onMounted(async () => {
  if (!userStore.isAuthenticated) {
    router.push('/auth')
    return
  }
  
  if (!userStore.profile) {
    await userStore.initializeUser()
    if (!userStore.isAuthenticated) {
      router.push('/auth')
      return
    }
  }

  // Если команда уже создана, перенаправляем на страницу команды
  if (userStore.profile?.is_team_created) {
    router.push('/my-team')
    return
  }

  fetchPlayers()
})

watch([filterPosition, filterClub, filterMinPrice, filterMaxPrice], fetchPlayers)

const handleSelectPosition = (pos) => {
  filterPosition.value = pos
}

const handleResetSquad = () => {
  // Сбрасываем состав
  squad.value = {
    gkp: Array(2).fill(null),
    def: Array(5).fill(null),
    mid: Array(5).fill(null),
    fwd: Array(3).fill(null)
  }
  // Восстанавливаем бюджет
  budget.value = 100.0
}

const handleSubmitSquad = async () => {
  try {
    // Собираем всех выбранных игроков
    const allPlayers = [
      ...squad.value.gkp,
      ...squad.value.def,
      ...squad.value.mid,
      ...squad.value.fwd
    ].filter(Boolean)

    // Проверяем, что все позиции заполнены
    if (allPlayers.length !== 15) {
      showLimitMsg.value = 'Необходимо выбрать всех игроков!'
      setTimeout(() => showLimitMsg.value = '', 2000)
      return
    }
    
    // Собираем массив ID игроков
    const playerIds = allPlayers.map(player => player.id)

    // Отправляем запрос на сервер
    const response = await fetch('http://127.0.0.1:8000/api/internal/v1/user/team/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.accessToken}`
      },
      body: JSON.stringify({
        players: playerIds
      })
    })

    if (!response.ok) {
      throw new Error('Ошибка при сохранении состава')
    }

    showLimitMsg.value = 'Состав успешно сохранен!'
    setTimeout(() => showLimitMsg.value = '', 2000)
    
    // После успешного создания команды перенаправляем на страницу команды
    router.push('/my-team')
  } catch (error) {
    showLimitMsg.value = 'Произошла ошибка при сохранении состава'
    setTimeout(() => showLimitMsg.value = '', 2000)
    console.error('Error:', error)
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

const filteredPlayers = computed(() => {
  return playerList.value.filter(player => {
    const positionMatch = filterPosition.value === '' || player.position === filterPosition.value
    const clubMatch = filterClub.value === '' || player.club === filterClub.value
    const priceMatch = (filterMinPrice.value === '' || parseFloat(player.cost) >= parseFloat(filterMinPrice.value)) &&
                      (filterMaxPrice.value === '' || parseFloat(player.cost) <= parseFloat(filterMaxPrice.value))
    return positionMatch && clubMatch && priceMatch
  })
})

const handleSelectPlayer = (player) => {
  addPlayerToSquad(player)
}

const getPositionLabel = (position) => {
  switch (position) {
    case 'gkp':
      return 'Вратарь'
    case 'def':
      return 'Защитник'
    case 'mid':
      return 'Полузащитник'
    case 'fwd':
      return 'Нападающий'
    default:
      return position.charAt(0).toUpperCase() + position.slice(1)
  }
}
</script>

<style scoped lang="scss">
.fantasy-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2d0066 100%);
  margin-top: 0 !important;
  padding-top: 0 !important;
}

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
  margin-top: -1rem;
  margin-left: 35rem;
}

.fantasy-logo {
  height: 230px;
  width: auto;
  filter: drop-shadow(0 10px 8px rgba(0,0,0,0.08));
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

.main-content {
  max-width: 1500px;
  margin: 0 auto;
  padding: 2rem;
}

.fantasy-main-flex {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  max-width: 1350px;
  margin: 0 auto;
  padding: 2rem;
  box-sizing: border-box;
}

.fantasy-squad-setup {
  flex: 1;
  background: #23244a;
  border-radius: 18px;
  box-shadow: 0 6px 32px rgba(30,60,114,0.13), 0 1.5px 6px rgba(0,0,0,0.08);
  margin: 0;
  padding: 0 0 2.5rem 0;
  overflow: hidden;
  max-width: 950px;
}

.squad-header {
  background: linear-gradient(90deg, #1e3c72 0%, #37003c 100%);
  padding: 1.5rem 2.5rem 1.2rem 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 18px 18px 0 0;
  position: relative;
}

.squad-header .gameweek {
  color: #fff;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
}

.squad-header .deadline {
  color: #c7c7e6;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 1.1rem;
}

.squad-stats {
  display: flex;
  gap: 2.5rem;
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

.squad-row {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
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
  min-height: 135px;
}

.player-slot {
  width: 97px;
  height: 135px;
  position: relative;
  margin: 0.5rem 0;
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

.position-label {
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

.player-shirt {
  width: 69px;
  height: 69px;
  object-fit: contain;
  margin-top: 1.4rem;
  margin-bottom: 0.3rem;
}

.player-info {
  text-align: center;
  width: 100%;
  position: absolute;
  bottom: 0.8rem;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.player-name {
  display: block;
  font-weight: bold;
  color: #1a237e;
  font-size: 0.85rem;
  margin-bottom:-1.0rem;
  margin-top: 10px;
}

.player-cost {
  display: block;
  color: #666;
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: 9px;
  margin-bottom: -15px;
}

.add-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  margin-top: 5px;
  padding-top: 15px;
}

.plus-icon {
  font-size: 2rem;
  font-weight: bold;
  color: #37003c;
  margin-bottom: 0.5rem;
  margin-top: 5px;
}

.add-text {
  font-size: 0.8rem;
  text-align: center;
  color: #666;
  margin-top: 5px;
  padding-top: 5px;
}

.squad-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  padding: 0 1rem;
}

.reset {
  background: #ff2e6e;
  color: #fff;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.enter-squad {
  background: #00c48c;
  color: #fff;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.reset:hover, .enter-squad:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.fantasy-players-panel {
  width: 350px;
  flex-shrink: 0;
  background: #23244a;
  border-radius: 18px;
  padding: 1.5rem;
  position: sticky;
  top: 2rem;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
  margin-left: 2.5rem;
}

.players-filter-block {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.2rem;
  margin-bottom: 1.5rem;
}

.filter-title {
  color: #fff;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.filter-row label {
  color: #fff;
  font-size: 0.9rem;
  min-width: 80px;
}

.filter-select, .filter-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 0.5rem;
  color: #fff;
  font-size: 0.9rem;
}

.filter-select:focus, .filter-input:focus {
  outline: none;
  border-color: #00ff87;
}

.players-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.player-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.player-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.player-item .player-shirt {
  width: 40px;
  height: 40px;
  margin: 0;
}

.player-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.player-item .player-name {
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
}

.player-item .player-club {
  color: #c7c7e6;
  font-size: 0.85rem;
}

.player-item .player-cost {
  color: #00ff87;
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
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
}
</style> 
