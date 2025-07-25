import type { PageServerLoad } from './$types';
import { extractLocaleFromRequest,extractLocaleFromUrl,getLocale } from '$lib/paraglide/runtime.js';
import { glob } from 'node:fs';

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
const getPostsByLocale = async (locale: string) => {
  if (locale === 'ko') {
    return await import.meta.glob('/src/content/blog/*.md');
  } else if (locale === 'jp') {
    return await import.meta.glob('/src/content/blog/translate/*.jp.md');
  } else {
    return await import.meta.glob('/src/content/blog/translate/*.en.md');
  }
}

export const load: PageServerLoad = async ({ request }) => {
  // Get current locale from request
  const locale = getLocale();
  const files = await getPostsByLocale(locale);
  // Import blog posts for the current language only
  const posts = (await Promise.all(
    Object.entries(files)
      .map(async ([path, resolver]) => {
        const { metadata } = await resolver() as { metadata: PostMetadata };
        
        // Extract slug from filename
        const filename = path.split('/').pop() || '';
        let slug: string;
        
        if (path.includes('/translate/')) {
          // Remove language suffix for translated files
          slug = filename.replace(/\.(en|jp)\.md$/, '');
        } else {
          // Korean file
          slug = filename.replace('.md', '');
        }
        
        return {
          ...metadata,
          slug
        };
      })
  )).filter((post) => post.published);
  // console.log(posts);
  // Sort by date (newest first)
  posts.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
  
  return {
    recentPosts: posts.slice(0, 3)
  };
};
