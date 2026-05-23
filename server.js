import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Proxy /api/* → Todoist REST v2, forwarding the Bearer token
app.use('/api', async (req, res) => {
  const upstream = `https://api.todoist.com/rest/v2${req.url}`;
  try {
    const r = await fetch(upstream, {
      method: req.method,
      headers: { Authorization: req.headers.authorization ?? '' },
    });
    const body = await r.text();
    res.status(r.status).type('json').send(body);
  } catch {
    res.status(502).send('Proxy error');
  }
});

app.use(express.static(join(__dirname, 'dist')));
app.get('*', (_req, res) => res.sendFile(join(__dirname, 'dist/index.html')));

app.listen(process.env.PORT ?? 3000);
