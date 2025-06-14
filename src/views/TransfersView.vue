<template>
  <div class="fantasy-container">
    <div class="fantasy-hero">
      <div class="fantasy-hero-bg"></div>
      <div class="fantasy-hero-content">
        <div class="fantasy-logo-block">
          <img src="@/assets/fantasy-logo.png" alt="Fantasy League" class="fantasy-logo" />
        </div>
        <UserInfo />
      </div>
      <nav class="fantasy-menu">
        <button class="menu-btn" :class="{active: activeMenu === 'transfers'}" @click="handleMenuClick('transfers')">Трансферы</button>
        <button class="menu-btn" :class="{active: activeMenu === 'myteam'}" @click="handleMenuClick('myteam')">Моя команда</button>
      </nav>
    </div>
    <main class="main-content">
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
                <div class="player-card clickable" @click="selectPlayer(player)">
                  <img :src="player.t_shirt" :alt="player.surname" class="player-shirt">
                  <div class="player-info">
                    <span class="player-name">{{ player.surname }}</span>
                    <span class="player-position">{{ getPositionLabel(player.position) }}</span>
                  </div>
                  <span v-if="player.is_captain" class="captain-badge">C</span>
                </div>
              </div>
            </div>
            <div class="squad-row">
              <div v-for="player in squad.def" :key="player.id" class="player-slot">
                <div class="player-card clickable" @click="selectPlayer(player)">
                  <img :src="player.t_shirt" :alt="player.surname" class="player-shirt">
                  <div class="player-info">
                    <span class="player-name">{{ player.surname }}</span>
                    <span class="player-position">{{ getPositionLabel(player.position) }}</span>
                  </div>
                  <span v-if="player.is_captain" class="captain-badge">C</span>
                </div>
              </div>
            </div>
            <div class="squad-row">
              <div v-for="player in squad.mid" :key="player.id" class="player-slot">
                <div class="player-card clickable" @click="selectPlayer(player)">
                  <img :src="player.t_shirt" :alt="player.surname" class="player-shirt">
                  <div class="player-info">
                    <span class="player-name">{{ player.surname }}</span>
                    <span class="player-position">{{ getPositionLabel(player.position) }}</span>
                  </div>
                  <span v-if="player.is_captain" class="captain-badge">C</span>
                </div>
              </div>
            </div>
            <div class="squad-row">
              <div v-for="player in squad.fwd" :key="player.id" class="player-slot">
                <div class="player-card clickable" @click="selectPlayer(player)">
                  <img :src="player.t_shirt" :alt="player.surname" class="player-shirt">
                  <div class="player-info">
                    <span class="player-name">{{ player.surname }}</span>
                    <span class="player-position">{{ getPositionLabel(player.position) }}</span>
                  </div>
                  <span v-if="player.is_captain" class="captain-badge">C</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Запасные -->
          <div class="bench-section">
            <h3>Запасные</h3>
            <div class="bench-row">
              <div v-for="player in [...bench.gkp, ...bench.def, ...bench.mid, ...bench.fwd]" :key="player.id" class="player-slot">
                <div class="player-card clickable" @click="selectPlayer(player)">
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
        <!-- Модальное окно для трансфера -->
        <PopupModal v-if="selectedPlayer && !showTransferFilter" :visible="true" :message="'Совершить трансфер игрока ' + selectedPlayer.surname + '?'" @close="selectedPlayer = null">
          <template #default>
            <div style="margin-bottom: 1rem;">Совершить трансфер игрока <b>{{ selectedPlayer.surname }}</b>?</div>
            <button class="transfer-btn" @click="startTransfer(selectedPlayer)">Совершить трансфер</button>
          </template>
        </PopupModal>
        <!-- Фильтр и список игроков для трансфера -->
        <div v-if="showTransferFilter" class="transfer-filter-block">
          <div class="filter-title">Выберите нового игрока на позицию: <b>{{ getPositionLabel(selectedPlayer.position) }}</b></div>
          <div class="players-filter-block">
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
            <div v-for="player in filteredPlayers" :key="player.id" class="player-item" @click="confirmTransfer(player)">
              <img :src="player.t_shirt" class="player-shirt" :alt="player.surname">
              <div class="player-details">
                <span class="player-name">{{ player.surname }}</span>
                <span class="player-club">{{ player.club }}</span>
                <span class="player-cost">{{ player.cost }}M</span>
              </div>
            </div>
          </div>
          <button class="close-filter-btn" @click="cancelTransfer">Отмена</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import UserInfo from '@/components/UserInfo.vue'
import PopupModal from '@/components/PopupModal.vue'

const router = useRouter()
const userStore = useUserStore()
const activeMenu = ref('transfers')

const squad = ref({ gkp: [], def: [], mid: [], fwd: [] })
const bench = ref({ gkp: [], def: [], mid: [], fwd: [] })
const selectedPlayer = ref(null)
const showTransferFilter = ref(false)
const filterClub = ref('')
const filterMinPrice = ref('')
const filterMaxPrice = ref('')
const clubs = ref([])
const playerList = ref([])

const teamName = computed(() => userStore.teamInfo?.name || 'Моя команда')

const getPositionLabel = (position) => {
  const labels = {
    'gkp': 'Вратарь',
    'def': 'Защитник',
    'mid': 'Полузащитник',
    'fwd': 'Нападающий'
  }
  return labels[position?.toLowerCase()] || position
}

const handleMenuClick = (menu) => {
  activeMenu.value = menu
  if (menu === 'transfers') router.push('/fantasy/transfers')
  if (menu === 'myteam') router.push('/my-team')
}

const fetchTeamInfo = async () => {
  try {
    const accessToken = userStore.accessToken
    if (!accessToken) return
    const response = await fetch('http://127.0.0.1:8000/api/internal/v1/user/team/team-info/', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
    if (!response.ok) return
    const data = await response.json()
    squad.value = { gkp: [], def: [], mid: [], fwd: [] }
    bench.value = { gkp: [], def: [], mid: [], fwd: [] }
    if (data.start_players && data.start_players.length > 0) {
      data.start_players.forEach(player => {
        const position = player.position.toLowerCase()
        if (squad.value[position]) {
          squad.value[position].push({
            id: player.id,
            surname: player.surname,
            position: position,
            t_shirt: player.t_shirt,
            club: player.club,
            cost: player.cost
          })
        }
      })
    }
    if (data.bench_players && data.bench_players.length > 0) {
      data.bench_players.forEach(player => {
        const position = player.position.toLowerCase()
        if (bench.value[position]) {
          bench.value[position].push({
            id: player.id,
            surname: player.surname,
            position: position,
            t_shirt: player.t_shirt,
            club: player.club,
            cost: player.cost
          })
        }
      })
    }
  } catch (e) { /* ignore */ }
}

const squadRows = computed(() => [squad.value.gkp, squad.value.def, squad.value.mid, squad.value.fwd])

function selectPlayer(player) {
  if (selectedPlayer.value && selectedPlayer.value.id === player.id) {
    selectedPlayer.value = null
  } else {
    selectedPlayer.value = player
  }
}

function startTransfer(player) {
  showTransferFilter.value = true
  filterClub.value = ''
  filterMinPrice.value = ''
  filterMaxPrice.value = ''
  fetchPlayers(player.position)
}

function cancelTransfer() {
  showTransferFilter.value = false
  selectedPlayer.value = null
}

async function fetchPlayers(position) {
  let url = `http://127.0.0.1:8000/api/internal/v1/player/?position=${position}`
  if (filterClub.value) url += `&club=${filterClub.value}`
  if (filterMinPrice.value) url += `&cost_min=${filterMinPrice.value}`
  if (filterMaxPrice.value) url += `&cost_max=${filterMaxPrice.value}`
  const res = await fetch(url)
  const data = await res.json()
  playerList.value = data.results
  const clubSet = new Set(data.results.map(p => p.club))
  clubs.value = Array.from(clubSet)
}

const filteredPlayers = computed(() => {
  return playerList.value.filter(player => {
    const clubMatch = filterClub.value === '' || player.club === filterClub.value
    const priceMatch = (filterMinPrice.value === '' || parseFloat(player.cost) >= parseFloat(filterMinPrice.value)) &&
                      (filterMaxPrice.value === '' || parseFloat(player.cost) <= parseFloat(filterMaxPrice.value))
    return clubMatch && priceMatch
  })
})

function confirmTransfer(newPlayer) {
  // Здесь должна быть логика отправки трансфера на сервер
  // Пока просто закрываем фильтр и сбрасываем выбор
  showTransferFilter.value = false
  selectedPlayer.value = null
  // Можно добавить всплывающее сообщение об успешном трансфере
}

onMounted(fetchTeamInfo)
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
}

/* Стили для интерактива трансферов */
.player-card.clickable {
  cursor: pointer;
  border: 2px solid transparent;
  transition: border 0.2s;
}
.player-card.clickable:hover, .player-card.clickable.selected {
  border: 2px solid #00c48c;
}
.transfer-btn {
  margin-top: 0.5rem;
  background: #00c48c;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.3rem 1rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -2.2rem;
  z-index: 10;
}
.transfer-btn:hover {
  background: #009e6d;
}
.transfer-filter-block {
  margin-top: 2rem;
  background: #23244a;
  border-radius: 18px;
  box-shadow: 0 6px 32px rgba(30,60,114,0.13), 0 1.5px 6px rgba(0,0,0,0.08);
  padding: 2rem;
}
.close-filter-btn {
  margin-top: 1.5rem;
  background: #ff2e6e;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.close-filter-btn:hover {
  background: #c70039;
}
</style> 
