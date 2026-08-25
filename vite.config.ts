import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'
import viteReact from '@vitejs/plugin-react'
import stylexUnplugin from '@stylexjs/unplugin/vite'
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
    stylexUnplugin({
      useCSSLayers: true,
      aliases: {
        '@/*': [resolve(__dirname, '*')],
      },
      unstable_moduleResolution: {
        type: 'commonJS',
        rootDir: __dirname,
      },
    }),
    tanstackStart(),
    nitro({ preset: 'vercel' }),
    viteReact(),
  ],
})
