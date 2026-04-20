import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
export default defineConfig({
    base: '/clockify-to-schema/',
    server: {
        host: '0.0.0.0',
        port: 5175,
    },
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['icons/*.png', 'icons/*.svg'],
            manifest: {
                name: 'Ore Export',
                short_name: 'Ore',
                description: 'Importa CSV Clockify ed esporta in Excel',
                theme_color: '#1e40af',
                background_color: '#ffffff',
                display: 'standalone',
                orientation: 'portrait',
                start_url: '/clockify-to-schema/',
                scope: '/clockify-to-schema/',
                icons: [
                    {
                        src: '/icons/icon-192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/icons/icon-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: '/icons/icon-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable',
                    },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                navigateFallback: '/clockify-to-schema/index.html',
                navigateFallbackAllowlist: [/^\/clockify-to-schema\//],
                runtimeCaching: [],
            },
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
