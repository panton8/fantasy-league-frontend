<template>
  <div class="match-details">
    <div v-if="matchSummary" class="timeline">
      <template v-for="(action, index) in withExtraLines">
        <div v-if="action.type === 'halftime'" class="timeline-divider">
          <span>ПЕРЕРЫВ</span>
        </div>
        <div v-else-if="action.type === 'fulltime'" class="timeline-divider">
          <span>КОНЕЦ МАТЧА</span>
        </div>
        <div v-else class="action-item">
          <div class="time">
            <template v-if="action.additional_minute">
              {{ action.minute }}+{{ action.additional_minute }}'
            </template>
            <template v-else>
              {{ action.minute }}'
            </template>
          </div>
          <div class="score-row-3col">
            <div class="side-col left-col">
              <template v-if="!action.isAwayTeam">
                <div class="action-icon">
                  <img :src="getActionIcon(action.action)" :alt="action.action" />
                </div>
                <div class="action-info">
                  <strong>{{ action.major_player }}</strong>
                  <template v-if="action.minor_player">
                    <span v-if="action.action === 'goal'" class="assist">
                      {{ action.minor_player }}
                    </span>
                    <span v-if="action.action === 'sub_on'" class="substitution">
                      {{ action.minor_player }}
                    </span>
                  </template>
                </div>
              </template>
            </div>
            <div class="score-center-col">
              <span v-if="action.scoreAfter" class="score-inline">{{ action.scoreAfter }}</span>
            </div>
            <div class="side-col right-col">
              <template v-if="action.isAwayTeam">
                <div class="action-icon">
                  <img :src="getActionIcon(action.action)" :alt="action.action" />
                </div>
                <div class="action-info">
                  <strong>{{ action.major_player }}</strong>
                  <template v-if="action.minor_player">
                    <span v-if="action.action === 'goal'" class="assist">
                      {{ action.minor_player }}
                    </span>
                    <span v-if="action.action === 'sub_on'" class="substitution">
                      {{ action.minor_player }}
                    </span>
                  </template>
                </div>
              </template>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div v-else-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <span>Загрузка деталей матча...</span>
    </div>
    <div v-else class="no-details">
      <span>Нет доступных деталей для этого матча</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import goalIcon from '@/assets/icons/goal.png'
import ownGoalIcon from '@/assets/icons/own-goal.png'
import missedPenaltyIcon from '@/assets/icons/missed-penalty.png'
import yellowCardIcon from '@/assets/icons/yellow-card.svg'
import redCardIcon from '@/assets/icons/red-card.svg'
import substitutionIcon from '@/assets/icons/substitution.svg'

const props = defineProps({
  matchId: {
    type: String,
    required: true
  }
})

const matchSummary = ref(null)
const loading = ref(true)

const sortedActions = computed(() => {
  if (!matchSummary.value) return []
  
  const allActions = []
  const teams = Object.keys(matchSummary.value)
  
  teams.forEach((team, teamIndex) => {
    matchSummary.value[team].forEach(action => {
      allActions.push({
        ...action,
        team,
        isAwayTeam: teamIndex === 1
      })
    })
  })
  
  return allActions.sort((a, b) => {
    if (a.minute === b.minute) {
      return (a.additional_minute || 0) - (b.additional_minute || 0)
    }
    return a.minute - b.minute
  })
})

const withExtraLines = computed(() => {
  if (!sortedActions.value.length) return [];
  let home = 0, away = 0;
  const result = [];
  let halftimeInserted = false;
  const homeTeam = Object.keys(matchSummary.value)[0];
  const awayTeam = Object.keys(matchSummary.value)[1];
  sortedActions.value.forEach((action, idx, arr) => {
    let scoreAfter = null;
    if (["goal", "own_goal", "missed_penalty"].includes(action.action)) {
      if (action.action === "goal") {
        if (action.team === homeTeam) home++;
        else away++;
      } else if (action.action === "own_goal") {
        if (action.team === homeTeam) away++;
        else home++;
      }
      scoreAfter = `${home} - ${away}`;
    }
    result.push({ ...action, scoreAfter });
    if (!halftimeInserted && action.minute >= 45 && (idx === arr.length - 1 || arr[idx + 1].minute > 45)) {
      result.push({ type: "halftime" });
      halftimeInserted = true;
    }
  });
  result.push({ type: "fulltime" });
  return result;
})

const getActionIcon = (action) => {
  const icons = {
    goal: goalIcon,
    own_goal: ownGoalIcon,
    missed_penalty: missedPenaltyIcon,
    yellow_card: yellowCardIcon,
    red_card: redCardIcon,
    sub_on: substitutionIcon
  }
  return icons[action]
}

const fetchMatchSummary = async () => {
  loading.value = true
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/internal/v1/match/${props.matchId}/summary/`)
    matchSummary.value = await response.json()
  } catch (error) {
    console.error('Error fetching match summary:', error)
  } finally {
    loading.value = false
  }
}

watch(() => props.matchId, () => {
  fetchMatchSummary()
})

onMounted(() => {
  fetchMatchSummary()
})
</script>

<style scoped lang="scss">
.match-details {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  color: #2c3e50;
  max-width: 800px;
  margin: 0 auto;
  min-height: 200px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 12px 20px;
  background: linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
}

.time {
  min-width: 50px;
  font-weight: 700;
  font-size: 20px;
  color: #1e3c72;
  
  .additional-time {
    font-size: 14px;
    color: #6c757d;
    margin-left: 2px;
  }
}

.action-content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.action-content.away-team {
  flex-direction: row-reverse;
  text-align: right;
}

.action-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 6px;
  margin-left: 5px;
  margin-right: 5px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.action-info {
  strong {
    display: block;
    font-size: 18px;
    color: #2c3e50;
    margin-bottom: 2px;
  }
  
  .assist, .substitution {
    display: block;
    font-size: 14px;
    color: #6c757d;
    font-weight: 500;
  }
}

.loading, .no-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  gap: 16px;
  
  span {
    font-size: 16px;
    color: #6c757d;
    font-weight: 500;
  }
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1e3c72;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .match-details {
    padding: 16px;
  }
  
  .action-item {
    padding: 10px 16px;
  }
  
  .time {
    font-size: 16px;
    min-width: 40px;
  }
  
  .action-info {
    strong {
      font-size: 16px;
    }
  }
  
  .action-icon {
    width: 28px;
    height: 28px;
  }
}

.timeline-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 20px;
  color: #fff;
  background: #222;
  border-radius: 12px;
  margin: 18px auto;
  height: 48px;
  letter-spacing: 2px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  max-width: 340px;
  width: 100%;
  padding: 0 48px;
}
.timeline-divider span {
  padding: 0 32px;
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 2px;
}
.score-row-3col {
  display: grid;
  grid-template-columns: 1fr min-content 1fr;
  align-items: center;
  width: 100%;
  gap: 0;
  position: relative;
}
.side-col {
  display: flex;
  align-items: center;
  min-width: 0;
  height: 100%;
  width: 100%;
}
.left-col {
  justify-content: flex-start;
}
.right-col {
  justify-content: flex-end;
  flex-direction: row-reverse;
  width: 100%;
}
.right-col .action-info {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-left: 8px;
}
.score-center-col {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.score-inline {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 900;
  color: #1e3c72;
  background: #f3f3f3;
  border-radius: 14px;
  padding: 10px 0;
  box-shadow: 0 2px 8px rgba(30,60,114,0.07);
  letter-spacing: 2px;
  min-width: 120px;
  max-width: 220px;
  width: 100%;
  margin: 0 auto;
}
</style> 
 