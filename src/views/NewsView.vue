<template>
  <div class="news-container">
    <h1>Новости</h1>
    <div class="news-content">
      <div class="news-card">
        <h2>Новости лиги</h2>
        <p>Новости будут доступны в ближайшее время</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.news-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  h1 {
    color: #37003c;
    font-size: 32px;
    margin-bottom: 30px;
    font-weight: 700;
  }
}

.news-content {
  display: grid;
  gap: 20px;
}

.news-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h2 {
    color: #37003c;
    font-size: 24px;
    margin-bottom: 15px;
  }

  p {
    color: #666;
    font-size: 16px;
    line-height: 1.5;
  }
}
</style> 