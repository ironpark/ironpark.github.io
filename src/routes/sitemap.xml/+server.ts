import type { RequestHandler } from './$types';
import { promises as fs } from 'fs';
import path from 'path';

export const prerender = true;

const BASE_URL = 'https://ironpark.github.io';
const LOCALES = ['ko', 'en', 'ja'];
const BASE_LOCALE = 'ko';

interface SitemapEntry {
	path: string;
	changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
	priority: number;
}

interface BlogPost {
	slug: string;
	lastmod: string;
}

function generateUrl(path: string, locale: string): string {
	return locale === BASE_LOCALE ? `${BASE_URL}${path}` : `${BASE_URL}/${locale}${path}`;
}

function generateAlternateLinks(path: string): string {
	return LOCALES.map(locale => {
		const url = generateUrl(path, locale);
		return `\n\t\t<xhtml:link rel="alternate" hreflang="${locale}" href="${url}"/>`;
	}).join('');
}

function generateUrlEntry(path: string, locale: string, changefreq: string, priority: number, lastmod?: string): string {
	const url = generateUrl(path, locale);
	const date = lastmod || new Date().toISOString().split('T')[0];
	const alternateLinks = generateAlternateLinks(path);
	
	return `
	<url>
		<loc>${url}</loc>
		<lastmod>${date}</lastmod>
		<changefreq>${changefreq}</changefreq>
		<priority>${priority}</priority>${alternateLinks}
	</url>`;
}

export const GET: RequestHandler = async () => {
	// Static pages
	const staticPages: SitemapEntry[] = [
		{ path: '', changefreq: 'weekly', priority: 1.0 },
		{ path: '/about', changefreq: 'weekly', priority: 0.8 },
		{ path: '/projects', changefreq: 'weekly', priority: 0.8 },
		{ path: '/blog', changefreq: 'weekly', priority: 0.8 }
	];
	
	// Get all blog posts
	const blogFiles = import.meta.glob([
		'/src/content/blog/*.md',
		'/src/content/blog/translate/*.en.md',
		'/src/content/blog/translate/*.ja.md'
	]);
	
	// Extract blog posts with modification dates
	const blogPosts = new Map<string, BlogPost>();
	
	for (const [filePath] of Object.entries(blogFiles)) {
		const filename = filePath.split('/').pop() || '';
		const slug = filename
			.replace(/\.(en|ja)\.md$/, '')
			.replace('.md', '');
		
		// Convert the import.meta.glob path to actual file system path
		const actualPath = path.join(process.cwd(), filePath.substring(1)); // Remove leading '/'
		
		try {
			const stats = await fs.stat(actualPath);
			const lastmod = stats.mtime.toISOString().split('T')[0];
			console.log(slug,lastmod);
			// Update the blog post entry if this file is newer
			const existing = blogPosts.get(slug);
			if (!existing || existing.lastmod < lastmod) {
				blogPosts.set(slug, { slug, lastmod });
			}
		} catch (error) {
            console.error(error);
			// If we can't get the file stats, use current date
			if (!blogPosts.has(slug)) {
				blogPosts.set(slug, { slug, lastmod: new Date().toISOString().split('T')[0] });
			}
		}
	}
	
	// Generate sitemap XML
	let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;
	
	// Add static pages
	staticPages.forEach(page => {
		LOCALES.forEach(locale => {
			xml += generateUrlEntry(page.path, locale, page.changefreq, page.priority);
		});
	});
	
	// Add blog posts
	Array.from(blogPosts.values()).forEach(post => {
		LOCALES.forEach(locale => {
			xml += generateUrlEntry(`/blog/${post.slug}`, locale, 'monthly', 0.7, post.lastmod);
		});
	});
	
	xml += `
</urlset>`;
	
	return new Response(xml.trim(), {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
};