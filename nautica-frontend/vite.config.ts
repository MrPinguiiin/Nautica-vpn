import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/api': {
				target: 'https://nautica.badcode.biz.id', // Ganti dengan domain Cloudflare Workers Anda
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		}
	}
});
