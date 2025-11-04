import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Replace 'soccer-team-hub' with your actual GitHub repository name.
  // For example, if your repo is 'my-awesome-app', set base: '/my-awesome-app/'.
  base: '/soccer-team-hub/', 
  build: {
    outDir: 'dist',
  },
});
