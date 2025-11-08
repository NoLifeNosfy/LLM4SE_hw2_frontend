import { readonly, ref } from 'vue';

const _isRecording = ref(false);
export const isRecording = readonly(_isRecording);

let audioContext: AudioContext | null = null;
let stream: MediaStream | null = null;
let processor: ScriptProcessorNode | null = null;
let input: MediaStreamAudioSourceNode | null = null;
let audioData: {
  size: number;
  buffer: Float32Array[];
  inputSampleRate: number;
  outputSampleRate: number;
} = {
  size: 0,
  buffer: [],
  inputSampleRate: 0,
  outputSampleRate: 16000, // Baidu VOP API requires 16kHz
};

export const startRecording = async (): Promise<void> => {
  if (_isRecording.value) {
    console.warn('Recording is already in progress.');
    return;
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    audioData.inputSampleRate = audioContext.sampleRate;
    audioData.buffer = [];
    audioData.size = 0;

    const bufferSize = 4096;
    processor = audioContext.createScriptProcessor(bufferSize, 1, 1);

    processor.onaudioprocess = (e: AudioProcessingEvent) => {
      const data = e.inputBuffer.getChannelData(0);
      audioData.buffer.push(new Float32Array(data));
      audioData.size += data.length;
    };

    input = audioContext.createMediaStreamSource(stream);
    input.connect(processor);
    processor.connect(audioContext.destination);

    _isRecording.value = true;
  } catch (error) {
    console.error('Error accessing microphone:', error);
    throw new Error('Microphone access was denied. Please check your browser permissions.');
  }
};

export const stopRecording = (): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    if (!_isRecording.value || !processor || !input || !audioContext) {
      return reject('Not recording or recording not initialized properly.');
    }

    input.disconnect();
    processor.disconnect();
    stream?.getTracks().forEach(track => track.stop());

    const data = new Float32Array(audioData.size);
    let offset = 0;
    for (let i = 0; i < audioData.buffer.length; i++) {
      data.set(audioData.buffer[i], offset);
      offset += audioData.buffer[i].length;
    }

    const resampledData = downsampleBuffer(data, audioData.inputSampleRate, audioData.outputSampleRate);
    const wavBlob = encodeWAV(resampledData, audioData.outputSampleRate);

    _isRecording.value = false;
    audioContext = null;
    processor = null;
    input = null;
    stream = null;

    resolve(wavBlob);
  });
};

const downsampleBuffer = (buffer: Float32Array, inputSampleRate: number, outputSampleRate: number): Float32Array => {
  if (inputSampleRate === outputSampleRate) {
    return buffer;
  }
  const sampleRateRatio = inputSampleRate / outputSampleRate;
  const newLength = Math.round(buffer.length / sampleRateRatio);
  const result = new Float32Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;
  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
    let accum = 0, count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i];
      count++;
    }
    result[offsetResult] = accum / count;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  return result;
};

const encodeWAV = (samples: Float32Array, sampleRate: number): Blob => {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const floatTo16BitPCM = (output: DataView, offset: number, input: Float32Array) => {
    for (let i = 0; i < input.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
  };

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // Audio format 1 for PCM
  view.setUint16(22, 1, true); // 1 channel (mono)
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // Byte rate
  view.setUint16(32, 2, true); // Block align
  view.setUint16(34, 16, true); // 16 bits per sample
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);
  floatTo16BitPCM(view, 44, samples);

  return new Blob([view], { type: 'audio/wav' });
};