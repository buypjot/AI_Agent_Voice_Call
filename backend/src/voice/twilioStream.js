import { appendInputAudio, createRealtimeSession } from '../ai/realtimeClient.js';

const sessions = new Map();

export function handleTwilioStream(ws) {
  let streamSid;
  let realtime;

  ws.on('message', (raw) => {
    let message;
    try {
      message = JSON.parse(raw.toString());
    } catch {
      return;
    }

    if (message.event === 'start') {
      streamSid = message.start.streamSid;
      realtime = createRealtimeSession({
        onEvent: (event) => {
          if (event.type === 'response.audio.delta' && event.delta && streamSid) {
            ws.send(JSON.stringify({
              event: 'media',
              streamSid,
              media: { payload: event.delta },
            }));
          }
        },
      });
      sessions.set(streamSid, realtime);
      return;
    }

    if (message.event === 'media' && realtime) {
      appendInputAudio(realtime, message.media.payload);
      return;
    }

    if (message.event === 'stop') {
      realtime?.close();
      if (streamSid) sessions.delete(streamSid);
      ws.close();
    }
  });

  ws.on('close', () => {
    realtime?.close();
    if (streamSid) sessions.delete(streamSid);
  });
}
