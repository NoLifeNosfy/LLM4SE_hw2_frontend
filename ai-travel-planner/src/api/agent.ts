import { useUserStore } from '../store/userStore';
import { useTripStore } from '../store/tripStore';
import { useAgentStore } from '../store/agentStore';

const API_URL = 'http://localhost:8000/api/agent/stream';

export const sendMessage = async (message: string) => {
  const userStore = useUserStore();
  const tripStore = useTripStore();
  const agentStore = useAgentStore();

  const token = userStore.token;
  if (!token) {
    throw new Error('Authentication token not found.');
  }

  agentStore.startProcessing();

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      user_input: message,
      trip_id: tripStore.currentTrip?.id,
    }),
  });

  if (!response.body) {
    throw new Error('Response body is null');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        agentStore.stopProcessing();
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data:')) {
          const jsonStr = line.substring(5);
          try {
            const data = JSON.parse(jsonStr);
            agentStore.handleStreamEvent(data);
          } catch (e) {
            console.error('Failed to parse SSE data:', jsonStr);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
};
