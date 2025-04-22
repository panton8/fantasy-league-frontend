<template>
  <div class="players-view">
    <div class="container">
      <h1>Игроки</h1>
      <div class="players-grid">
        <div class="placeholder-message">
          <i class="pi pi-user" style="font-size: 3rem"></i>
          <p>Здесь скоро появится список игроков</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.players-view {
  height: 100%;
  padding: 2rem;
  
  .container {
    height: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    
    h1 {
      color: #1e3c72;
      margin-bottom: 2rem;
      flex-shrink: 0;
    }
    
    .players-grid {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.9);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
      
      .placeholder-message {
        text-align: center;
        color: #666;
        
        i {
          margin-bottom: 1rem;
          color: #1e3c72;
        }
        
        p {
          font-size: 1.2rem;
        }
      }
    }
  }
}
</style> 