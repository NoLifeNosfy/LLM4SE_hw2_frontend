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
    <div v-if="isProcessing || isTranscribing" class="status-folder">
      <div class="spinner"></div>
      <span class="status-message">{{ isTranscribing ? 'Transcribing audio...' : statusMessage }}</span>
    </div>
    <div class="input-area">
      <input v-model="userInput" @keyup.enter="sendMessage" placeholder="Ask me anything about your trip..." :disabled="isProcessing || isTranscribing" />
      <button @click="toggleRecording" :disabled="isProcessing || isTranscribing" class="voice-btn">
        {{ isRecording ? '🛑' : '🎤' }}
      </button>
      <button @click="sendMessage" :disabled="isProcessing || isTranscribing">Send</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue';
import { useAgentStore } from '../../store/agentStore';
import { sendMessage as sendApiMessage, uploadAudio } from '../../api/agent';
import { startRecording, stopRecording as stopRecordingUtil, isRecording } from '../../utils/audio';

const agentStore = useAgentStore();
const userInput = ref('');
const isTranscribing = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);

const isWindowVisible = computed(() => agentStore.isWindowVisible);
const messages = computed(() => agentStore.messages);
const isProcessing = computed(() => agentStore.isProcessing);
const statusMessage = computed(() => agentStore.statusMessage);

const closeChat = () => {
  agentStore.toggleChatWindow();
};

const sendMessage = async () => {
  if (userInput.value.trim() === '' || isProcessing.value) return;

  const message = userInput.value;
  userInput.value = '';
  
  agentStore.addUserMessage(message);

  try {
    await sendApiMessage(message);
  } catch (error) {
    console.error('Failed to send message:', error);
    agentStore.handleStreamEvent({ type: 'error', data: { message: 'Failed to get response from the assistant.' } });
  }
};

const toggleRecording = async () => {
  if (isRecording.value) {
    isTranscribing.value = true;
    try {
      const audioBlob = await stopRecordingUtil();
      const transcribedText = await uploadAudio(audioBlob);
      console.log('Transcribed Text:', transcribedText);
      userInput.value = transcribedText;
    } catch (error) {
      console.error('Error during recording or transcription:', error);
      // Optionally, show an error message to the user
    } finally {
      isTranscribing.value = false;
    }
  } else {
    try {
      await startRecording();
    } catch (error) {
      console.error('Failed to start recording:', error);
      // Optionally, show an error message to the user
    }
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
  width: 700px;
  height: 1000px;
  max-height: 80vh;
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

.status-folder {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.status-message {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #6c757d;
  font-size: 14px;
}

.input-area {
  display: flex;
  align-items: center;
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

.input-area input:disabled {
  background-color: #f9f9f9;
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

.input-area button:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

.input-area button:hover {
  background-color: #0056b3;
}

.voice-btn {
  padding: 8px 12px;
  font-size: 16px;
}
</style>
