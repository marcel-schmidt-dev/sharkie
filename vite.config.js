import { defineConfig } from 'vite';

export default defineConfig({
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