import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // NEXT_PUBLIC_ keeps the Web3Forms key working if it was set for the previous Next.js site.
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
});
