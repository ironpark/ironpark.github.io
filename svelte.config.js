import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import mdsvexConfig from './mdsvex.config.js';
import * as glob from 'glob';

const prerenderPosts = glob.sync('contents/posts/*.md').map((file) => {
	return '/posts/' + file.split('/')[2].replace(/.md$/, '');
});

const prerenderMemos = glob.sync('contents/memos/*.md').map((file) => {
	return '/memos/' + file.split('/')[2].replace(/.md$/, '');
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	extensions: ['.svelte', '.md'],
	preprocess: [vitePreprocess(), mdsvex(mdsvexConfig)],

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		prerender: {
			entries: ['*', ...prerenderPosts, ...prerenderMemos]
		}
	}
};

export default config;
