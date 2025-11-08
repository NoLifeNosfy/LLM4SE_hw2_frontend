<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <span>Login</span>
        </div>
      </template>
      <el-form @submit.prevent="handleLogin">
        <el-form-item label="Email">
          <el-input v-model="email" type="email" placeholder="Enter your email"></el-input>
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="password" type="password" placeholder="Enter your password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">Login</el-button>
          <el-button @click="goToRegister">Register</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '../store/userStore';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const email = ref('');
const password = ref('');
const userStore = useUserStore();
const router = useRouter();

const goToRegister = () => {
  router.push('/register');
};

const handleLogin = async () => {
  try {
    await userStore.login(email.value, password.value);
    ElMessage.success('Login success');
    router.push('/planner');
  } catch (error: any) {
    ElMessage.error(error.detail || JSON.stringify(error));
    console.error('Login failed');
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
  width: 400px;
}

.card-header {
  text-align: center;
  font-size: 1.5rem;
}
</style>
