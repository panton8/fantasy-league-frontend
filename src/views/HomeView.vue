<template>
  <FantasyHeader :activeMenu="'home'" />
  <div class="fantasy-content fantasy-content--with-header fantasy-content--centered">
    <div class="fantasy-under-construction">
      Страница в разработке
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import UserInfo from '@/components/UserInfo.vue'
import FantasyHeader from '@/components/FantasyHeader.vue'

const router = useRouter()
const userStore = useUserStore()

const activeMenu = ref('points')
const squad = ref({ gkp: [], def: [], mid: [], fwd: [] })
const bench = ref({ gkp: [], def: [], mid: [], fwd: [] })

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
  if (menu === 'points') router.push('/points')
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
            points: player.points ?? 0 // если нет points, ставим 0
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
            points: player.points ?? 0
          })
        }
      })
    }
  } catch (e) { /* ignore */ }
}

onMounted(fetchTeamInfo)

const squadRows = computed(() => [squad.value.gkp, squad.value.def, squad.value.mid, squad.value.fwd])
const benchRows = computed(() => [bench.value.gkp, bench.value.def, bench.value.mid, bench.value.fwd])

const totalPoints = computed(() => {
  return [
    ...squad.value.gkp,
    ...squad.value.def,
    ...squad.value.mid,
    ...squad.value.fwd
  ].reduce((sum, p) => sum + (p.points ?? 0), 0)
})
</script>

<style scoped lang="scss">
.fantasy-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2d0066 100%);
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
.squad-header .total-points {
  color: #00ff87;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.squad-header .gameweek {
  color: #fff;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
}
.squad-header .team-name {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 1.1rem;
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
.player-points {
  display: block;
  color: #00c48c;
  font-size: 0.9rem;
  font-weight: 700;
  margin-top: 9px;
  margin-bottom: -15px;
}
.bench-section {
  margin-top: 2rem;
  padding: 1rem;
  background: #23244a;
  border-radius: 18px;
  box-shadow: 0 6px 32px rgba(30,60,114,0.13), 0 1.5px 6px rgba(0,0,0,0.08);
}
.bench-row {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 1rem;
  padding: 0.3rem 1.5rem;
  background: #2d2e5a;
  border-bottom: 1px solid #2d2e5a;
  font-size: 1.05rem;
  font-weight: 500;
  color: #fff;
  position: relative;
  margin-bottom: 0.3rem;
  flex-wrap: wrap;
  min-height: 135px;
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
.bench-name {
  display: block;
  font-weight: bold;
  color: #1a237e;
  font-size: 0.85rem;
  margin-bottom:-1.0rem;
  margin-top: 10px;
}
.bench-points {
  display: block;
  color: #00c48c;
  font-size: 0.9rem;
  font-weight: 700;
  margin-top: 9px;
  margin-bottom: -15px;
}
</style> 
