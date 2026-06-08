import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'
import viteReact from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
    },
  },
  plugins: [
    tanstackStart(),
    nitro({ preset: 'vercel' }),
    viteReact(),
  ],
})
