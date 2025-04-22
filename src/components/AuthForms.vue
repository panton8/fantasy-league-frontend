<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-tabs">
        <button 
          :class="['tab-btn', { active: activeTab === 'login' }]" 
          @click="activeTab = 'login'"
        >
          Вход
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === 'register' }]" 
          @click="activeTab = 'register'"
        >
          Регистрация
        </button>
      </div>

      <!-- Форма входа -->
      <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="login-username">Имя пользователя</label>
          <input
            id="login-username"
            v-model="loginForm.username"
            type="text"
            required
            placeholder="Введите имя пользователя"
          >
        </div>
        <div class="form-group">
          <label for="login-password">Пароль</label>
          <div class="password-input">
            <input
              id="login-password"
              v-model="loginForm.password"
              :type="showLoginPassword ? 'text' : 'password'"
              required
              placeholder="Введите пароль"
            >
            <button 
              type="button" 
              class="password-toggle"
              @click="showLoginPassword = !showLoginPassword"
            >
              {{ showLoginPassword ? '🔒' : '👁️' }}
            </button>
          </div>
        </div>
        <button type="submit" class="submit-btn">Войти</button>
      </form>

      <!-- Форма регистрации -->
      <form v-else @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="register-username">Имя пользователя</label>
          <input
            id="register-username"
            v-model="registerForm.username"
            type="text"
            required
            placeholder="Придумайте имя пользователя"
          >
        </div>
        <div class="form-group">
          <label for="register-password">Пароль</label>
          <div class="password-input">
            <input
              id="register-password"
              v-model="registerForm.password"
              :type="showRegisterPassword ? 'text' : 'password'"
              required
              placeholder="Придумайте пароль"
            >
            <button 
              type="button" 
              class="password-toggle"
              @click="showRegisterPassword = !showRegisterPassword"
            >
              {{ showRegisterPassword ? '🔒' : '👁️' }}
            </button>
          </div>
        </div>
        <button type="submit" class="submit-btn">Зарегистрироваться</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('login')
const showLoginPassword = ref(false)
const showRegisterPassword = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const registerForm = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/internal/v1/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginForm)
    })
    
    if (response.ok) {
      const data = await response.json()
      localStorage.setItem('jwt_token', data.token)
      router.push('/fantasy')
    } else {
      // Здесь можно добавить обработку ошибок
      console.error('Ошибка входа')
    }
  } catch (error) {
    console.error('Ошибка:', error)
  }
}

const handleRegister = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/internal/v1/auth/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerForm)
    })
    
    if (response.ok) {
      const data = await response.json()
      localStorage.setItem('jwt_token', data.token)
      router.push('/fantasy')
    } else {
      // Здесь можно добавить обработку ошибок
      console.error('Ошибка регистрации')
    }
  } catch (error) {
    console.error('Ошибка:', error)
  }
}
</script>

<style scoped lang="scss">
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 180px);
  padding: 20px;
  background: linear-gradient(135deg, #37003c 0%, #240129 100%);
}

.auth-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.auth-tabs {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
}

.tab-btn {
  flex: 1;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666;

  &.active {
    color: #37003c;
    background-color: #fff;
    border-bottom: 3px solid #00ff87;
  }

  &:hover:not(.active) {
    background-color: #f5f5f5;
  }
}

.auth-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #333;
  }
}

.password-input {
  position: relative;
  display: flex;
  align-items: center;

  input {
    padding-right: 40px;
  }

  .password-toggle {
    position: absolute;
    right: 10px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-size: 20px;
  }
}

input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00ff87;
  }

  &::placeholder {
    color: #999;
  }
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: #37003c;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #2d0030;
  }

  &:active {
    transform: translateY(1px);
  }
}
</style> 