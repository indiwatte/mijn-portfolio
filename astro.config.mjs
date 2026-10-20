// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
    // The live address: share previews (og:image, og:url) are built from it
    site: 'https://indiwatte.netlify.app',
    vite: {
        plugins: [tailwindcss()],
    },
});
