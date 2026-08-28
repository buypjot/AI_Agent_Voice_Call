import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();
const port = Number(process.env.PORT || 4000);

app.disable('x-powered-by');
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('combined'));

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'ai-agent-voice-call-backend',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/voice/config-status', (_req, res) => {
  res.json({
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
    twilioConfigured: Boolean(
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE_NUMBER
    )
  });
});

// Twilio webhook used when an outbound/inbound call connects.
// The response tells Twilio to open a bidirectional Media Stream.
app.post('/api/voice/twiml', (_req, res) => {
  const publicBaseUrl = process.env.PUBLIC_BASE_URL;
  if (!publicBaseUrl) {
    return res.status(503).type('text/plain').send('PUBLIC_BASE_URL is not configured');
  }

  const streamUrl = `${publicBaseUrl.replace(/^http/i, 'ws')}/ws/voice`;
  const twiml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<Response>',
    '  <Connect>',
    `    <Stream url="${streamUrl}" />`,
    '  </Connect>',
    '</Response>'
  ].join('\\n');

  return res.type('text/xml').send(twiml);
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`AI voice backend listening on port ${port}`);
});
