<template>
  <div class="prizes-container">
    <h1 class="prizes-title">Призы сезона 2024</h1>

    <div class="prizes-section">
      <h2>Главные призы сезона</h2>
      
      <div class="prize-card main">
        <div class="prize-header gold">
          <span class="place">1</span>
          <h3>Чемпион Фэнтези Высшей Лиги 2024</h3>
        </div>
        <ul class="prize-list">
          <li>2 VIP-билета на финал Кубка Беларуси 2025</li>
          <li>Игровая футболка любого клуба Высшей Лиги с автографами команды</li>
          <li>iPhone 15 Pro Max (256GB)</li>
          <li>Эксклюзивный набор атрибутики Высшей Лиги</li>
          <li>Сертификат на покупку спортивной экипировки на 1000 BYN</li>
        </ul>
      </div>

      <div class="prize-card">
        <div class="prize-header silver">
          <span class="place">2</span>
          <h3>Серебряный призёр</h3>
        </div>
        <ul class="prize-list">
          <li>2 VIP-билета на любой матч Высшей Лиги сезона 2025</li>
          <li>Игровая футболка любого клуба Высшей Лиги</li>
          <li>iPad Air (5-го поколения, 256GB, Wi-Fi)</li>
          <li>Набор атрибутики Высшей Лиги</li>
        </ul>
      </div>

      <div class="prize-card">
        <div class="prize-header bronze">
          <span class="place">3</span>
          <h3>Бронзовый призёр</h3>
        </div>
        <ul class="prize-list">
          <li>2 билета на любой матч Высшей Лиги сезона 2025</li>
          <li>Футболка любого клуба Высшей Лиги</li>
          <li>Apple AirPods Pro (2-го поколения) с зарядным кейсом MagSafe</li>
          <li>Набор атрибутики Высшей Лиги</li>
        </ul>
      </div>

      <div class="prize-card">
        <div class="prize-header top">
          <span class="place">4-5</span>
          <h3>Места 4-5</h3>
        </div>
        <ul class="prize-list">
          <li>Футболка любого клуба Высшей Лиги</li>
          <li>Набор атрибутики Высшей Лиги</li>
        </ul>
      </div>
    </div>

    <div class="prizes-section">
      <h2>Ежемесячные награды</h2>
      
      <div class="prize-card monthly">
        <div class="prize-header">
          <h3>Менеджер месяца</h3>
        </div>
        <ul class="prize-list">
          <li>Футболка любого клуба Высшей Лиги</li>
          <li>Спортивная куртка</li>
          <li>Набор атрибутики Высшей Лиги</li>
        </ul>
      </div>

      <div class="prize-card monthly">
        <div class="prize-header">
          <h3>Топ-10 менеджеров месяца</h3>
        </div>
        <ul class="prize-list">
          <li>Набор атрибутики Высшей Лиги</li>
        </ul>
      </div>
    </div>

    <div class="prizes-section">
      <h2>Еженедельные награды</h2>
      
      <div class="prize-card weekly">
        <div class="prize-header">
          <h3>Менеджер недели</h3>
        </div>
        <ul class="prize-list">
          <li>Шарф любого клуба Высшей Лиги</li>
          <li>Сувенирная продукция Высшей Лиги</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.prizes-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem;
  background: linear-gradient(to bottom, #ffffff, #f8f9fa);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  min-height: min-content;
  height: auto;
  position: relative;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 8px;
    background: linear-gradient(90deg, 
      #00ff87 0%, 
      #37003c 50%, 
      #00ff87 100%
    );
    border-radius: 24px 24px 0 0;
    opacity: 0.8;
  }
}

.prizes-title {
  text-align: center;
  background: linear-gradient(135deg, #37003c 0%, #1a0429 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: 3.2rem;
  margin-bottom: 3rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
    height: 6px;
    background: linear-gradient(90deg, #00ff87, #37003c);
    border-radius: 3px;
  }
}

.prizes-section {
  margin-bottom: 4rem;

  h2 {
    color: #37003c;
    font-size: 2.2rem;
    margin-bottom: 2.5rem;
    padding-bottom: 1rem;
    border-bottom: none;
    position: relative;
    font-weight: 800;
    background: linear-gradient(90deg, #37003c, #2d0066);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, 
        #00ff87 0%, 
        rgba(0, 255, 135, 0.5) 50%,
        rgba(0, 255, 135, 0.2) 100%
      );
      border-radius: 2px;
    }
  }
}

.prize-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  margin-bottom: 2.5rem;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);

  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 12px 40px rgba(31, 38, 135, 0.15);
  }

  &.main {
    border: none;
    background: linear-gradient(
      to bottom,
      rgba(255, 215, 0, 0.1),
      rgba(255, 255, 255, 0.95)
    );
    box-shadow: 0 8px 32px rgba(255, 215, 0, 0.2);
  }
}

.prize-header {
  background: linear-gradient(135deg, #37003c, #2d0066);
  color: white;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0) 100%
    );
  }

  &.gold {
    background: linear-gradient(135deg, 
      #ffd700 0%, 
      #ffb347 50%,
      #ffd700 100%
    );
    .place { 
      background: #37003c;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }
    h3 {
      color: #37003c;
      text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.3);
    }
  }

  &.silver {
    background: linear-gradient(135deg, 
      #C0C0C0 0%, 
      #A9A9A9 50%,
      #C0C0C0 100%
    );
    .place { 
      background: #37003c;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }
    h3 {
      color: #37003c;
      text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.3);
    }
  }

  &.bronze {
    background: linear-gradient(135deg, 
      #CD7F32 0%, 
      #B87333 50%,
      #CD7F32 100%
    );
    .place { 
      background: #37003c;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }
    h3 {
      color: #37003c;
      text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.3);
    }
  }

  .place {
    width: 48px;
    height: 48px;
    background: #00ff87;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 1.5rem;
    box-shadow: 0 4px 15px rgba(0, 255, 135, 0.3);
    position: relative;
    z-index: 1;
    
    &::after {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(135deg, #00ff87, #37003c);
      border-radius: 50%;
      z-index: -1;
      opacity: 0.5;
    }
  }

  h3 {
    margin: 0;
    font-size: 1.6rem;
    font-weight: 800;
    letter-spacing: 0.5px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }
}

.prize-list {
  padding: 2.5rem;
  margin: 0;
  list-style: none;

  li {
    position: relative;
    padding-left: 2.5rem;
    margin-bottom: 1.2rem;
    color: #2d2d2d;
    font-size: 1.15rem;
    line-height: 1.6;
    font-weight: 500;
    transition: transform 0.2s ease;

    &:hover {
      transform: translateX(5px);
    }

    &:before {
      content: '🏆';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.2rem;
      opacity: 0.9;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.monthly, .weekly {
  border-left: 4px solid #00ff87;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: -4px;
    width: 4px;
    background: linear-gradient(to bottom, 
      #00ff87,
      rgba(0, 255, 135, 0)
    );
  }

  .prize-header {
    background: linear-gradient(135deg, 
      #37003c 0%,
      #2d0066 100%
    );
  }
}

@keyframes shine {
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.main .prize-header.gold h3 {
  background: linear-gradient(
    90deg,
    #ffd700 0%,
    #fff5a5 25%,
    #ffd700 50%,
    #fff5a5 75%,
    #ffd700 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: shine 3s linear infinite;
}
</style> 