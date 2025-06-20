<template>
  <div class="desk">
    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 头部 -->
      <div class="header">
        <h1>MeowTask</h1>
        <div class="fish-bar">
          <img v-for="i in 6" :key="i" src="@/assets/fish.jpg" alt="fish" />
        </div>
        <h3>欢迎回来！请登录</h3>
      </div>

      <!-- 登录表单区域 -->
      <div class="task-container-wrapper">
        <div class="task-container login-form">
          <h2 style="text-align: center; margin-bottom: 1em;">登录</h2>
          <div class="email">
            <label for="email">邮箱</label>
            <div class="sec-2">
              <ion-icon name="mail-outline"></ion-icon>
              <input type="email" v-model="email" name="email" placeholder="输入邮箱" />
            </div>
          </div>

          <div class="password">
            <label for="password">密码</label>
            <div class="sec-2">
              <ion-icon name="lock-closed-outline"></ion-icon>
              <input class="pas" v-model="password" type="password" name="password" placeholder="输入密码" />
              <ion-icon class="show-hide" name="eye-outline"></ion-icon>
            </div>
          </div>

          <button class="login" @click="handleLogin">登录</button>

          <div class="footer">
            <span>注册</span>
            <span>忘记密码?</span>
          </div>
        </div>
      </div>

      <!-- 猫咪图片移到任务容器外部 -->
      <div class="cat-container">
        <img src="@/assets/cat.jpg" alt="cat" class="cat-img" />
        <h3>喵~ 欢迎回来喵！</h3>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const email = ref('')
    const password = ref('')
    const router = useRouter()

    const handleLogin = () => {
      // 不做验证，直接跳转到主页
      router.push('/desk')
    }

    return {
      email,
      password,
      handleLogin
    }
  }
}
</script>

<style scoped>
/* 主内容区 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  position: relative;
}

.header {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
  z-index: 10;
}

.fish-bar {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
  position: relative;
}

.fish-bar img {
  width: 30px;
  height: 30px;
  transition: all 0.3s ease;
}

.task-container-wrapper {
  width: 100%;
  max-width: 1200px;
  margin-top: -20px;
  margin-bottom: 30px;
}

.task-container.login-form {
  padding: 2em;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 0 auto;
}

.email,
.password {
  margin-bottom: 1em;
}

.email label,
.password label {
  font-weight: bold;
  color: #4d4d4d;
}

.sec-2 {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  margin-top: 5px;
}

.sec-2 ion-icon {
  color: #4d4d4d;
  margin-right: 10px;
}

.email input,
.password input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
}

.email input::placeholder,
.password input::placeholder {
  color: black;
  font-size: 0.9em;
}

.login {
  width: 100%;
  padding: 1em;
  background: #3e4684;
  color: white;
  border: none;
  border-radius: 30px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
}

.footer {
  margin-top: 1em;
  display: flex;
  justify-content: space-around;
  font-size: 0.9em;
  color: #5e5e5e;
}

.footer span {
  cursor: pointer;
}

.cat-container {
  width: 100%;
  max-width: 1200px;
  text-align: left;
  padding: 10px;
  margin-top: 20px;
}

.cat-img {
  width: 180px;
  border-radius: 4px;
}
</style>
