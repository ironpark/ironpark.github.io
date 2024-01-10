import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, searchForWorkspaceRoot } from 'vite';

export default defineConfig({
	server: {
		fs: {
			allow: ['./src', './contents']
		}
	},
	plugins: [sveltekit()]
});
