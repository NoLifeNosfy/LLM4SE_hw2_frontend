import { defineStore } from 'pinia';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

interface AgentState {
  isWindowVisible: boolean;
  messages: Message[];
}

export const useAgentStore = defineStore('agent', {
  state: (): AgentState => ({
    isWindowVisible: false,
    messages: [],
  }),
  actions: {
    toggleChatWindow() {
      this.isWindowVisible = !this.isWindowVisible;
    },
    addMessage(role: 'user' | 'assistant', content: string) {
      this.messages.push({ id: Date.now(), role, content });
    },
    addUserMessage(content: string) {
      this.addMessage('user', content);
    },
    addAssistantMessage(event: any) {
      let content = '';
      switch (event.type) {
        case 'intent':
          content = `Intent: ${event.data.category} (${event.data.function_count} functions)`;
          break;
        case 'status':
          content = `Status: ${event.data.message}`;
          break;
        case 'progress':
          content = `Progress: ${event.data.message}`;
          break;
        case 'function_call':
          content = `Calling: ${event.data.name}(${JSON.stringify(event.data.args)})`;
          break;
        case 'function_result':
          content = `Result from ${event.data.name}: ${JSON.stringify(event.data.result)}`;
          break;
        case 'result':
          content = event.data.message;
          break;
        case 'error':
          content = `Error: ${event.data.message}`;
          break;
        default:
          content = 'Received an unknown message type.';
      }
      this.addMessage('assistant', content);
    },
  },
});
