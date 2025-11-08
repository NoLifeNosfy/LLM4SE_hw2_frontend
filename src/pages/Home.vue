<template>
  <div class="home-container">
    <header class="hero-section">
      <h1>AI Travel Planner</h1>
      <p>Your intelligent guide to seamless travel planning.</p>
      <el-button size="large" @click="goToLogin">
        Login
      </el-button>
    </header>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goToPlanner = () => {
  router.push('/planner');
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background: linear-gradient(to right, #4facfe, #00f2fe);
}

.hero-section h1 {
  font-size: 3.5rem;
  color: white;
  margin-bottom: 1rem;
}

.hero-section p {
  font-size: 1.25rem;
  color: white;
  margin-bottom: 2rem;
}
</style>
