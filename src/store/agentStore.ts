import { defineStore } from 'pinia';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

interface AgentState {
  isWindowVisible: boolean;
  messages: Message[];
  isProcessing: boolean;
  statusMessage: string | null;
}

export const useAgentStore = defineStore('agent', {
  state: (): AgentState => ({
    isWindowVisible: false,
    messages: [],
    isProcessing: false,
    statusMessage: null,
  }),
  actions: {
    toggleChatWindow() {
      this.isWindowVisible = !this.isWindowVisible;
    },
    startProcessing() {
      this.isProcessing = true;
    },
    stopProcessing() {
      this.isProcessing = false;
      this.statusMessage = null;
    },
    addMessage(role: 'user' | 'assistant', content: string) {
      this.messages.push({ id: Date.now(), role, content });
    },
    addUserMessage(content: string) {
      this.addMessage('user', content);
    },
    handleStreamEvent(event: any) {
      let status = null;
      let isFinal = false;

      switch (event.type) {
        case 'intent':
          status = `Understood intent: ${event.data.category}`;
          break;
        case 'status':
        case 'progress':
          status = event.data.message;
          break;
        case 'function_call':
          status = `Thinking: using tool ${event.data.name}...`;
          break;
        case 'function_result':
          status = `Received result from ${event.data.name}`;
          break;
        case 'result':
          this.addMessage('assistant', event.data.message);
          isFinal = true;
          break;
        case 'error':
          this.addMessage('assistant', `Error: ${event.data.message}`);
          isFinal = true;
          break;
        default:
          this.addMessage('assistant', 'Received an unknown message type.');
          isFinal = true;
      }

      if (status) {
        this.statusMessage = status;
      }

      if (isFinal) {
        this.stopProcessing();
      }
    },
  },
});
