import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [react(), cloudflare()],
  server: {
    port: 4173,
    host: '0.0.0.0',
  },
  preview: {
    port: 4174,
    host: '0.0.0.0',
  },
});