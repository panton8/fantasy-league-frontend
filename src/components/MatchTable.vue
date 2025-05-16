<template>
  <div class="table-section">
    <div v-if="tableLoading" class="loading">
      <p>Загрузка таблицы...</p>
    </div>
    <table v-else class="standings-table">
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
        <tr v-for="(team, index) in tableData" :key="team.pk"
            :class="getHighlightClass(team.name)">
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
          <td>{{ team.goals_for - team.goals_against }}</td>
          <td class="points">{{ team.points }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  tableData: Array,
  tableLoading: Boolean,
  homeClubName: String,
  awayClubName: String
})

const getHighlightClass = (name) => {
  if (!name) return ''
  if (
    (props.homeClubName && name.trim().toLowerCase() === props.homeClubName.trim().toLowerCase()) ||
    (props.awayClubName && name.trim().toLowerCase() === props.awayClubName.trim().toLowerCase())
  ) {
    return 'highlighted-team'
  }
  return ''
}
</script>

<style scoped>
.table-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
.standings-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}
.standings-table th,
.standings-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #eee;
}
.standings-table th {
  background: #1e3c72;
  color: white;
  font-weight: 600;
}
.team-header {
  text-align: left;
}
.team-name {
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
}
.team-logo {
  width: 24px;
  height: 24px;
  object-fit: contain;
}
.highlighted-team {
  background: linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%) !important;
  font-weight: 900;
  color: #1e3c72;
  border-left: 6px solid #3498db;
  border-right: 6px solid #3498db;
  box-shadow: 0 2px 16px rgba(44,62,80,0.13);
  transition: background 0.2s, color 0.2s, border 0.2s;
}
</style> 
