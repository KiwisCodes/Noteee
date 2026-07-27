import { Hono } from 'hono';
import { serve } from '@hono/node-server';

const app = new Hono();

app.get('/health', (c) => {
  return c.json({ status: 'ok', service: 'Noteee Backend API Gateway v4', timestamp: new Date().toISOString() });
});

app.get('/api/v1/status', (c) => {
  return c.json({
    status: 'online',
    version: '1.0.0',
    layers: ['Foundation', 'Capture', 'Editor', 'AI Flashcards', 'Skia Canvas', 'PowerSync Relay']
  });
});

const port = Number(process.env.PORT) || 3000;
console.log(`🚀 Noteee Backend Hono server running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});
