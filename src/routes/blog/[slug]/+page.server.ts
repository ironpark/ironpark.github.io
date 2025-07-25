import { error } from '@sveltejs/kit';
import type { PageServerLoad, EntryGenerator } from './$types';
import { getLocale } from '$lib/paraglide/runtime.js';
import { extractFirstImageFromRaw } from '$lib/utils/extractFirstImage.js';

export const prerender = true;
interface PostMetadata {
  created: string;
  updated: string;
  published: boolean;
  title?: string;
  subTitle?: string;
  description?: string;
  series?: string;
  categories?: string[];
  tags?: string[];
  lang?: string;
  reading?: {
    text: string;
    time: number;
  };
  [key: string]: any;
}
const getPostByLocale = async (locale: string, slug: string) => {
  if (locale === 'ko') {
    const url = `/src/content/blog/${slug}.md`;
    return await import(url);
  } else if (locale === 'jp') {
    const url = `/src/content/blog/translate/${slug}.jp.md`;
    return await import(url);
  } else {
    const url = `/src/content/blog/translate/${slug}.en.md`;
    return await import(url);
  }
}

export const entries: EntryGenerator = () => {
  const posts = Object.keys(import.meta.glob(['/src/content/blog/*.md', '/src/content/blog/translate/*.en.md', '/src/content/blog/translate/*.jp.md']))
    .map(path => {
      const filename = path.split('/').pop() || '';
      // Extract base slug without language suffix
      const slug = filename
        .replace('.en.md', '')
        .replace('.jp.md', '')
        .replace('.md', '');
      return { slug };
    });
  
  // Remove duplicates
  const uniquePosts = Array.from(new Set(posts.map(p => p.slug)))
    .map(slug => ({ slug }));
  
  return uniquePosts;
};


export const load: PageServerLoad = async ({ params }) => {
  
  // Get current locale
  const locale = getLocale();
  const post = await getPostByLocale(locale, params.slug);
  
  return {
    slug: params.slug,
    content: post!.default,
    metadata: post!.metadata,
  };
};