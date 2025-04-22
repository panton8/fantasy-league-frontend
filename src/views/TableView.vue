<template>
  <div class="table-container">
    <div v-if="loading" class="loading">
      <p>Загрузка турнирной таблицы...</p>
    </div>

    <template v-else>
      <table class="standings-table" v-if="tableData.length">
        <thead>
          <tr>
            <th>#</th>
            <th class="team-header">КОМАНДА</th>
            <th>И</th>
            <th>В</th>
            <th>Н</th>
            <th>П</th>
            <th>ЗМ</th>
            <th>ПМ</th>
            <th>РМ</th>
            <th>О</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(team, index) in tableData" :key="team.pk" :class="getPositionClass(index + 1)">
            <td class="position">{{ index + 1 }}</td>
            <td class="team-name">
              <img :src="team.logo_url" :alt="team.name" class="team-logo">
              {{ team.name }}
            </td>
            <td>{{ team.played }}</td>
            <td>{{ team.wins }}</td>
            <td>{{ team.draws }}</td>
            <td>{{ team.losses }}</td>
            <td>{{ team.goals_for }}</td>
            <td>{{ team.goals_against }}</td>
            <td :class="getGoalDiffClass(team.goals_for - team.goals_against)">
              {{ team.goals_for - team.goals_against }}
            </td>
            <td class="points">{{ team.points }}</td>
          </tr>
        </tbody>
      </table>

      <div class="table-legend">
        <div class="legend-item champions">
          <span class="legend-color"></span>
          <span>Квалификация Лиги Чемпионов</span>
        </div>
        <div class="legend-item conference">
          <span class="legend-color"></span>
          <span>Квалификация Лиги Конференций</span>
        </div>
        <div class="legend-item playoff">
          <span class="legend-color"></span>
          <span>Стыковые матчи</span>
        </div>
        <div class="legend-item relegation">
          <span class="legend-color"></span>
          <span>Понижение в классе</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const tableData = ref([])
const loading = ref(true)

const fetchTableData = async () => {
  try {
    loading.value = true
    const response = await fetch('http://127.0.0.1:8000/api/internal/v1/club/table/')
    const data = await response.json()
    tableData.value = data
  } catch (error) {
    console.error('Error fetching table data:', error)
  } finally {
    loading.value = false
  }
}

const getGoalDiffClass = (diff) => {
  if (diff > 0) return 'positive'
  if (diff < 0) return 'negative'
  return ''
}

const getPositionClass = (position) => {
  const totalTeams = tableData.value.length
  if (position === 1) return 'champions'
  if (position <= 3) return 'conference'
  if (position === totalTeams - 2) return 'playoff'
  if (position >= totalTeams - 1) return 'relegation'
  return ''
}

onMounted(() => {
  fetchTableData()
})
</script>

<style scoped lang="scss">
.table-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.standings-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;

  th, td {
    padding: 15px;
    text-align: center;
    border-bottom: 1px solid #eee;
  }

  th {
    background: #1e3c72;
    color: white;
    font-weight: 600;
    font-size: 14px;
  }

  .team-header {
    text-align: left;
  }

  tbody tr {
    &:hover {
      background: #f8f9fa;
    }

    &:last-child td {
      border-bottom: none;
    }
  }

  tr.champions {
    border-left: 4px solid #4B0082;
  }

  tr.conference {
    border-left: 4px solid #00FF00;
  }

  tr.playoff {
    border-left: 4px solid #FFA500;
  }

  tr.relegation {
    border-left: 4px solid #FF0000;
  }
}

.table-legend {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .legend-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;

    .legend-color {
      width: 16px;
      height: 16px;
      border-radius: 3px;
    }
  }

  .champions .legend-color {
    background: #4B0082;
  }

  .conference .legend-color {
    background: #00FF00;
  }

  .playoff .legend-color {
    background: #FFA500;
  }

  .relegation .legend-color {
    background: #FF0000;
  }
}

.position {
  font-weight: 600;
  color: #37003c;
}

.team-name {
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
  font-weight: 500;
}

.team-logo {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.points {
  font-weight: 700;
  color: #37003c;
}

.positive {
  color: #00a650;
}

.negative {
  color: #dc3545;
}

.loading {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  p {
    color: #666;
    font-size: 18px;
  }
}
</style> 
