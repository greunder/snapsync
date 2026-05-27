import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    host: '0.0.0.0', // Allow connections from local network (like smartphones)
    port: 8443,
    https: true, // Enable HTTPS for secure context (required for camera access)
    proxy: {
      '/api': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'ws://localhost:8082',
        ws: true,
        secure: false, // Bypass self-signed SSL certificate check for sockets
      }
    }
  }
})
