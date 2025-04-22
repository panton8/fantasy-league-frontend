<template>
  <div class="results-container">
    <h1>Результаты</h1>
    <div class="results-content">
      <div class="results-card">
        <h2>Результаты матчей</h2>
        <p>Результаты прошедших матчей будут доступны в ближайшее время</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.results-container {
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

.results-content {
  display: grid;
  gap: 20px;
}

.results-card {
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