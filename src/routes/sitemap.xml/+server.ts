import type { RequestHandler } from './$types';
import { promises as fs } from 'fs';
import path from 'path';
import parseMD from 'parse-md'

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
	published?: string;
}

function generateUrl(path: string, locale: string): string {
	return locale === BASE_LOCALE ? `${BASE_URL}${path}` : `${BASE_URL}/${locale}${path}`;
}

function generateUrlEntry(path: string, locale: string, changefreq: string, priority: number, lastmod?: string): string {
	const url = generateUrl(path, locale);
	let date = lastmod || new Date().toISOString();
	if (date.includes('T')) {
		date = date.split('T')[0];
	}
	
	return `
	<url>
		<loc>${url}</loc>
		<lastmod>${date}</lastmod>
		<changefreq>${changefreq}</changefreq>
		<priority>${priority}</priority>
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
	const blogFiles = import.meta.glob('/src/content/blog/*.{ko,en,ja}.md');
	
	// Extract blog posts with modification dates
	const blogPosts = new Map<string, BlogPost>();
	
	for (const [filePath] of Object.entries(blogFiles)) {
		const filename = filePath.split('/').pop() || '';
		const slug = filename.replace(/\.(ko|en|ja)\.md$/, '');
		
		// Convert the import.meta.glob path to actual file system path
		const actualPath = path.join(process.cwd(), filePath.substring(1)); // Remove leading '/'
		const { metadata } = parseMD(await fs.readFile(actualPath, 'utf8')) as { metadata: {[key:string]:any} };
		try {
			const stats = await fs.stat(actualPath);
			const lastmod = stats.mtime.toISOString().split('T')[0];
			const published = metadata.published;
			console.log(slug,lastmod,published);
			// Update the blog post entry if this file is newer
			const existing = blogPosts.get(slug);
			if (!existing || existing.lastmod < lastmod) {
				blogPosts.set(slug, { slug, lastmod, published });
			}
		} catch (error) {
            console.error(error);
		}
	}
	
	// Generate sitemap XML
	let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;
	
	// Add static pages
	staticPages.forEach(page => {
		LOCALES.forEach(locale => {
			xml += generateUrlEntry(page.path, locale, page.changefreq, page.priority, '2025-07-25');
		});
	});
	
	// Add blog posts
	Array.from(blogPosts.values()).forEach(post => {
		LOCALES.forEach(locale => {
			if (post.published && post.published) {
				xml += generateUrlEntry(`/blog/${post.slug}`, locale, 'monthly', 0.7, post.published || post.lastmod);
			}
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