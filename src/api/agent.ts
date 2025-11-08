import { useUserStore } from '../store/userStore';
import { useTripStore } from '../store/tripStore';
import { useAgentStore } from '../store/agentStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const API_URL = API_BASE_URL + '/api/agent/stream';
const VOP_URL = API_BASE_URL + '/api/vop';

export const uploadAudio = async (audioBlob: Blob): Promise<string> => {
  const userStore = useUserStore();
  const token = userStore.token;
  if (!token) {
    throw new Error('Authentication token not found.');
  }

  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.wav');

  const response = await fetch(VOP_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Audio upload failed with status: ${response.status}`);
  }

  const data = await response.json();

  // WORKAROUND: If backend sends a plain string instead of a JSON object, treat it as a success.
  if (typeof data === 'string') {
    return data;
  }

  if (data.err_no === 0 && data.result.length > 0) {
    return data.result[0];
  } else {
    console.error('Backend transcription failed. Response data:', data);
    throw new Error(data.err_msg || 'Failed to transcribe audio.');
  }
};

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
