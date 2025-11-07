<template>
  <div class="chat-button" @click="toggleChat">
    <span class="icon">🤖</span>
  </div>
</template>

<script setup lang="ts">
import { useAgentStore } from '../../store/agentStore';

const agentStore = useAgentStore();

const toggleChat = () => {
  agentStore.toggleChatWindow();
};
</script>

<style scoped>
.chat-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background-color: #007bff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s;
}

.chat-button:hover {
  background-color: #0056b3;
}

.icon {
  font-size: 30px;
  color: white;
}
</style>
