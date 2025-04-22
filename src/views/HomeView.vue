<template>
  <main class="home">
    <div class="container">
      <h1>Fantasy League</h1>
      <div class="card">
        <p>Добро пожаловать в Fantasy League - вашу ultimate платформу для фэнтези спорта!</p>
      </div>
      <div class="actions">
        <Button label="Команды" icon="pi pi-users" @click="$router.push('/teams')" class="mr-2" />
        <Button label="Игроки" icon="pi pi-user" @click="$router.push('/players')" severity="secondary" />
      </div>
    </div>
  </main>
</template>

<script setup>
import Button from 'primevue/button'
</script>

<style scoped lang="scss">
.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  
  .container {
    text-align: center;
    color: white;
    padding: 2rem;
    
    h1 {
      font-size: 3rem;
      margin-bottom: 2rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    
    .card {
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      border-radius: 1rem;
      padding: 2rem;
      margin-bottom: 2rem;
      
      p {
        font-size: 1.2rem;
        line-height: 1.6;
      }
    }
    
    .actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
  }
}
</style> 