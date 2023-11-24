import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        // VitePWA({
        //     registerType: 'autoUpdate',
        //     workbox: {
        //         globPatterns: ['**/*.{js,css,html,ico,png,svg}'], //缓存相关静态资源
        //         // globPatterns: ['**/**'], //缓存相关静态资源
        //     },
        //     devOptions: {
        //         enabled: true,
        //     },
        // }),
    ],
    server: {
        port: 80,
        host: true,
        open: true,
        proxy: {
            /** 视频代理地址 */
            '/video-src-prox': {
                target: 'http://devimages.apple.com',
                changeOrigin: true,
                rewrite: (p) => p.replace(/^\/video-src-prox/, '')
            },
            '/video-src-prox-2': {
                target: 'https://sample-videos.com',
                changeOrigin: true,
                rewrite: (p) => p.replace(/^\/video-src-prox-2/, '')
            },
            '/video-src-prox-3': {
                target: 'https://sf1-hscdn-tos.pstatp.com',
                changeOrigin: true,
                rewrite: (p) => p.replace(/^\/video-src-prox-3/, '')
            },
        }
    },
});
