import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'telemetry-logger',
      configureServer(server) {
        server.middlewares.use('/api/log', (req, res, next) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            req.on('end', () => {
              const logFile = path.resolve(__dirname, 'public/flight_log.csv');
              if (!fs.existsSync(logFile)) {
                fs.writeFileSync(logFile, 'Timestamp,RawSerialString\n');
              }
              fs.appendFileSync(logFile, body);
              res.statusCode = 200;
              res.end('ok');
            });
          } else {
            next();
          }
        });
      }
    }
  ]
});
