<template>
  <div class="points-container">
    <FantasyHeader :active-menu="'points'" />
    <div class="points-content">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Загрузка данных...</p>
      </div>
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
      </div>
      <div v-else class="fantasy-squad-setup">
        <div class="squad-header">
          <div class="header-left">
            <div class="gameweek">Тур {{ currentWeek }}</div>
            <div class="deadline">Дедлайн: {{ deadline }}</div>
          </div>
          <div class="team-name">{{ teamName }}</div>
        </div>

        <div class="squad-container">
          <!-- Основной состав -->
          <div class="squad-section">
            <div class="squad-row">
              <div v-for="player in squad.gkp" :key="player.id" class="player-slot">
                <div class="player-card" @click="showPlayerStats(player)">
                  <img :src="player.t_shirt" :alt="player.surname" class="player-shirt">
                  <div class="player-info">
                    <span class="player-name">{{ player.surname }}</span>
                    <span class="player-points">{{ player.total_points }} очков</span>
                    <span v-if="player.is_captain" class="captain-badge">C</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="squad-row">
              <div v-for="player in squad.def" :key="player.id" class="player-slot">
                <div class="player-card" @click="showPlayerStats(player)">
                  <img :src="player.t_shirt" :alt="player.surname" class="player-shirt">
                  <div class="player-info">
                    <span class="player-name">{{ player.surname }}</span>
                    <span class="player-points">{{ player.total_points }} очков</span>
                    <span v-if="player.is_captain" class="captain-badge">C</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="squad-row">
              <div v-for="player in squad.mid" :key="player.id" class="player-slot">
                <div class="player-card" @click="showPlayerStats(player)">
                  <img :src="player.t_shirt" :alt="player.surname" class="player-shirt">
                  <div class="player-info">
                    <span class="player-name">{{ player.surname }}</span>
                    <span class="player-points">{{ player.total_points }} очков</span>
                    <span v-if="player.is_captain" class="captain-badge">C</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="squad-row">
              <div v-for="player in squad.fwd" :key="player.id" class="player-slot">
                <div class="player-card" @click="showPlayerStats(player)">
                  <img :src="player.t_shirt" :alt="player.surname" class="player-shirt">
                  <div class="player-info">
                    <span class="player-name">{{ player.surname }}</span>
                    <span class="player-points">{{ player.total_points }} очков</span>
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
              <div 
                v-for="player in [...bench.gkp, ...bench.def, ...bench.mid, ...bench.fwd]" 
                :key="player.id" 
                class="player-slot"
              >
                <div class="player-card" @click="showPlayerStats(player)">
                  <div class="bench-position">{{ getPositionLabel(player.position) }}</div>
                  <img :src="player.t_shirt" :alt="player.surname" class="player-shirt">
                  <div class="player-info bench-info">
                    <span class="player-name bench-name">{{ player.surname }}</span>
                    <span class="player-points">{{ player.total_points }} очков</span>
                    <span v-if="player.is_captain" class="captain-badge">C</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно -->
    <PlayerStatsModal
      :visible="!!selectedPlayer"
      :player="selectedPlayer"
      @close="closeStats"
    />
  </div>
</template>

<script>
import FantasyHeader from '@/components/FantasyHeader.vue'
import PlayerStatsModal from '@/components/PlayerStatsModal.vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'

export default {
  name: 'PointsView',
  components: {
    FantasyHeader,
    PlayerStatsModal
  },
  data() {
    return {
      loading: true,
      error: null,
      teamName: '',
      currentWeek: 1,
      deadline: '',
      squad: {
        gkp: [],
        def: [],
        mid: [],
        fwd: []
      },
      bench: {
        gkp: [],
        def: [],
        mid: [],
        fwd: []
      },
      selectedPlayer: null
    }
  },
  methods: {
    async fetchTeamData() {
      try {
        const userStore = useUserStore()
        const response = await axios.get('http://127.0.0.1:8000/api/internal/v1/user/team/team-info-points/', {
          headers: {
            'Authorization': `Bearer ${userStore.accessToken}`
          }
        })
        const data = response.data
        console.log('Полученные данные:', data)
        this.teamName = data.name
        this.squad = {
          gkp: data.start_players.filter(p => p.position === 'gkp'),
          def: data.start_players.filter(p => p.position === 'def'),
          mid: data.start_players.filter(p => p.position === 'mid'),
          fwd: data.start_players.filter(p => p.position === 'fwd')
        }
        this.bench = {
          gkp: data.bench_players.filter(p => p.position === 'gkp'),
          def: data.bench_players.filter(p => p.position === 'def'),
          mid: data.bench_players.filter(p => p.position === 'mid'),
          fwd: data.bench_players.filter(p => p.position === 'fwd')
        }
        console.log('Обработанные данные squad:', this.squad)
        console.log('Обработанные данные bench:', this.bench)
      } catch (error) {
        console.error('Error fetching team data:', error)
        this.error = 'Ошибка при загрузке данных команды'
      } finally {
        this.loading = false
      }
    },
    getPositionLabel(position) {
      const labels = {
        gkp: 'Вратарь',
        def: 'Защитник',
        mid: 'Полузащитник',
        fwd: 'Нападающий'
      }
      return labels[position] || position
    },
    getStatLabel(key) {
      const labels = {
        goal: 'Голы',
        assist: 'Передачи',
        yellow_card: 'Желтые карточки',
        red_card: 'Красные карточки',
        save: 'Сейвы',
        minute: 'Минуты',
        own_goal: 'Автоголы',
        penalty_saved: 'Спасенные пенальти',
        penalty_missed: 'Незабитые пенальти',
        goals_conceded: 'Пропущенные голы'
      }
      return labels[key] || key
    },
    showPlayerStats(player) {
      console.log('Выбранный игрок:', player)
      if (player && player.stats) {
        this.selectedPlayer = { ...player }
      } else {
        console.error('Некорректные данные игрока:', player)
      }
    },
    closeStats() {
      this.selectedPlayer = null
    }
  },
  mounted() {
    this.fetchTeamData()
  }
}
</script>

<style scoped>
.points-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2d0066 100%);
  padding: 20px;
}

.points-content {
  max-width: 950px;
  margin: 0 auto;
  padding: 1rem;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: white;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #1e3c72;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  color: #ff6b6b;
  text-align: center;
  padding: 20px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
}

.fantasy-squad-setup {
  flex: 1;
  background: #23244a;
  border-radius: 18px;
  box-shadow: 0 6px 32px rgba(30,60,114,0.13), 0 1.5px 6px rgba(0,0,0,0.08);
  margin: 0;
  padding: 0 0 2.5rem 0;
  overflow: hidden;
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

.team-name {
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
  height: 145px;
  position: relative;
  transition: transform 0.2s ease;
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
  cursor: pointer;
}

.player-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.player-shirt {
  width: 69px;
  height: 69px;
  object-fit: contain;
  margin-top: 0.8rem;
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

.player-points {
  display: block;
  color: #666;
  font-size: 0.8rem;
  margin-bottom: 0.2rem;
  font-weight: 600;
}

.captain-badge {
  position: absolute;
  top: -5.5rem;
  left: 0.2rem;
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
  height: 145px;
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
  margin-top: 10px;
}

.bench-info .player-points {
  display: block;
  margin-bottom: -20px;
}

@media (max-width: 768px) {
  .squad-row {
    flex-wrap: wrap;
  }
  .player-slot {
    width: 90px;
    height: 135px;
  }
  
  .player-shirt {
    width: 60px;
    height: 60px;
  }
}
</style> 
