<template>
  <div class="match-actions">
    <div class="actions-placeholder">
      <p>Действия матча будут отображаться здесь</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  matchData: Object
})
</script>

<style scoped>
.match-actions {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
.actions-placeholder {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  color: #666;
}
</style> 
