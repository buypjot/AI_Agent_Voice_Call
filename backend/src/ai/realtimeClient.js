import WebSocket from 'ws';
import { DEFAULT_AGENT_INSTRUCTIONS } from './systemPrompt.js';

const REALTIME_URL = 'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview';

export function createRealtimeSession({ apiKey = process.env.OPENAI_API_KEY, instructions = DEFAULT_AGENT_INSTRUCTIONS, onEvent } = {}) {
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');

  const socket = new WebSocket(REALTIME_URL, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'OpenAI-Beta': 'realtime=v1',
    },
  });

  socket.on('message', (raw) => {
    let event;
    try {
      event = JSON.parse(raw.toString());
    } catch {
      return;
    }
    onEvent?.(event);
  });

  socket.on('open', () => {
    socket.send(JSON.stringify({
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        instructions,
        input_audio_format: 'g711_ulaw',
        output_audio_format: 'g711_ulaw',
        turn_detection: { type: 'server_vad' },
      },
    }));
  });

  return socket;
}

export function appendInputAudio(socket, base64Audio) {
  socket.send(JSON.stringify({
    type: 'input_audio_buffer.append',
    audio: base64Audio,
  }));
}

export function requestResponse(socket) {
  socket.send(JSON.stringify({
    type: 'response.create',
    response: { modalities: ['audio', 'text'] },
  }));
}
