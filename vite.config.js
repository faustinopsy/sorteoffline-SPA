import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'LMania',
        short_name: 'LMania',
        description: 'Ferramenta matemática de loterias — Lotofácil, Lotomania, Mega-Sena e Quina.',
        theme_color: '#080c14',
        background_color: '#080c14',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [48, 72, 96, 128, 192, 256, 512].map((size) => ({
          src: `icons/icon-${size}.webp`,
          sizes: `${size}x${size}`,
          type: 'image/webp',
          purpose: 'any maskable',
        })),
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,webp,json,ico,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/servicebus2\.caixa\.gov\.br\/.*/,
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
})
