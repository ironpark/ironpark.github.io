import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import readingTime from "mdsvex-reading-time";
import rehypeSlug from 'rehype-slug';
import path from 'path';
import { fileURLToPath } from 'url';
import { createHighlighter } from 'shiki';
import { mdsvex, escapeSvelte } from 'mdsvex';
import { remarkAutoImportCodeBlock } from './src/lib/remark-auto-import-codeblock.js';

const highlighter = await createHighlighter({
	themes: ['github-dark'],
	langs: ['javascript', 'typescript', 'yaml', 'go']
});
// get dirname
const dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md', '.svx'],
	highlight: false,
	remarkPlugins: [
		[readingTime, { attribute: "reading"}],
		remarkAutoImportCodeBlock
	],
	rehypePlugins: [rehypeSlug],
	layout: `${dirname}/src/lib/layouts/blog-post.svelte`,
	highlight:{
		highlighter: async (code, lang = 'text') => {
			const html = escapeSvelte(highlighter.codeToHtml(code, { lang, theme: 'github-dark' }));
			return `<CodeBlock lang="${lang}">{@html \`${html}\` }</CodeBlock>`;
		}
	}
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
	kit: { 
		adapter: adapter({
			fallback: '404.html'
		}),
		prerender: {
			handleHttpError: 'warn',
			entries: ['*', '/sitemap.xml', '/rss.xml']
		}
	},
	extensions: ['.svelte', '.md', '.svx']
};

export default config;
