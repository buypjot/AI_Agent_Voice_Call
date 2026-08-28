import { Router } from 'express';

const router = Router();

router.post('/stream-twiml', (_req, res) => {
  const baseUrl = process.env.PUBLIC_BASE_URL;
  if (!baseUrl) {
    return res.status(500).type('text/plain').send('PUBLIC_BASE_URL is not configured');
  }

  const wsUrl = baseUrl.replace(/^http/i, 'ws') + '/ws/voice';
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Connect>\n    <Stream url="${wsUrl}" />\n  </Connect>\n</Response>`;

  return res.type('text/xml').send(twiml);
});

export default router;
