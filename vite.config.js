import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import path from 'path';

// Simple middleware to handle Vercel API locally
const vercelApiFallback = () => ({
  name: 'vercel-api-fallback',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url.startsWith('/api/leaderboard')) {
        try {
          // Load env vars so process.env works inside the API handler
          const env = loadEnv(server.config.mode, process.cwd(), '');
          Object.assign(process.env, env);

          const url = new URL(req.url, 'http://localhost');
          req.query = Object.fromEntries(url.searchParams);
          
          // Import the handler using absolute file URL (fixes Vite temp dir issue)
          const modulePath = path.resolve(process.cwd(), 'api/leaderboard.js');
          const fileUrl = 'file:///' + modulePath.replace(/\\/g, '/');
          const module = await import(`${fileUrl}?t=${Date.now()}`);
          const handler = module.default;
          
          // Polyfill simple Express-like response methods used by Vercel
          res.status = (code) => {
            res.statusCode = code;
            return res;
          };
          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          };
          
          await handler(req, res);
        } catch (err) {
          console.error('API Error:', err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        }
      } else {
        next();
      }
    });
  }
});

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    vercelApiFallback(),
  ],
})
