<template>
  <div class="register-container">
    <el-card class="register-card">
      <template #header>
        <div class="card-header">
          <span>Register</span>
        </div>
      </template>
      <el-form @submit.prevent="handleRegister">
        <el-form-item label="Email">
          <el-input v-model="email" type="email" placeholder="Enter your email"></el-input>
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="password" type="password" placeholder="Enter your password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRegister">Register</el-button>
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

const handleRegister = async () => {
  try {
    await userStore.register(email.value, password.value);
    ElMessage.success('Register success');
    router.push('/login');
  } catch (error: any) {
    ElMessage.error(error.detail || JSON.stringify(error));
    console.error('Register failed:', error);
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.register-card {
  width: 400px;
}

.card-header {
  text-align: center;
  font-size: 1.5rem;
}
</style>
