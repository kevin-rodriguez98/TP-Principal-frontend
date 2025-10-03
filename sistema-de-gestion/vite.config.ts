import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    host: true,   // 👈 esto habilita el acceso desde tu red
    port: 5173    // opcional, podés cambiar el puerto
  }
})
