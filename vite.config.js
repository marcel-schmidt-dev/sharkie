import { defineConfig } from 'vite';

export default defineConfig({
    base: '/sharkie/',
    server: {
        watch: {
            ignored: ['!**/classes/**'],
        },
    },

    resolve: {
        alias: {
            '@classes': '/classes',
        },
    },
});