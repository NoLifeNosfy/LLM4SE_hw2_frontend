<template>
  <div v-if="isWindowVisible" class="chat-window">
    <div class="header">
      <h3>AI Travel Assistant</h3>
      <button @click="closeChat">×</button>
    </div>
    <div class="messages" ref="messagesContainer">
      <div v-for="msg in messages" :key="msg.id" class="message" :class="msg.role">
        <p>{{ msg.content }}</p>
      </div>
    </div>
    <div class="input-area">
      <input v-model="userInput" @keyup.enter="sendMessage" placeholder="Ask me anything about your trip..." />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue';
import { useAgentStore } from '../../store/agentStore';
import { sendMessage as sendApiMessage } from '../../api/agent';

const agentStore = useAgentStore();
const userInput = ref('');
const messagesContainer = ref<HTMLElement | null>(null);

const isWindowVisible = computed(() => agentStore.isWindowVisible);
const messages = computed(() => agentStore.messages);

const closeChat = () => {
  agentStore.toggleChatWindow();
};

const sendMessage = async () => {
  if (userInput.value.trim() === '') return;

  const message = userInput.value;
  userInput.value = '';
  
  agentStore.addUserMessage(message);

  try {
    await sendApiMessage(message, (event) => {
      agentStore.addAssistantMessage(event);
    });
  } catch (error) {
    console.error('Failed to send message:', error);
    agentStore.addAssistantMessage({ type: 'error', data: { message: 'Failed to get response from the assistant.' } });
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

watch(messages, scrollToBottom, { deep: true });
</script>

<style scoped>
.chat-window {
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 350px;
  height: 500px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1000;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
}

.header h3 {
  margin: 0;
  font-size: 16px;
}

.header button {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.messages {
  flex-grow: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  padding: 8px 12px;
  border-radius: 10px;
  max-width: 80%;
  word-wrap: break-word;
}

.message.user {
  background-color: #dcf8c6;
  align-self: flex-end;
}

.message.assistant {
  background-color: #f1f0f0;
  align-self: flex-start;
}

.input-area {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ccc;
}

.input-area input {
  flex-grow: 1;
  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 8px 12px;
  outline: none;
}

.input-area button {
  margin-left: 10px;
  padding: 8px 15px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 20px;
  cursor: pointer;
}

.input-area button:hover {
  background-color: #0056b3;
}
</style>
