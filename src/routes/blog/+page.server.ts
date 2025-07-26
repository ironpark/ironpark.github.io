import type { PageServerLoad } from './$types';
import { getLocale } from '$lib/paraglide/runtime.js';

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
  thumbnail?: string;
  reading?: {
    text: string;
    time: number;
  };
  [key: string]: any;
}
const getPostsByLocale = (locale: string) => {
  const allPosts = import.meta.glob('/src/content/blog/*.{ko,en,ja}.md');
  const filteredPosts: any = {};
  
  Object.entries(allPosts).forEach(([path, module]) => {
    if (path.includes(`.${locale}.md`)) {
      filteredPosts[path] = module;
    }
  });
  
  return filteredPosts;
}

export const load: PageServerLoad = async () => {
  // Get current locale from request
  const locale = getLocale();
  const files = getPostsByLocale(locale);
  // Import blog posts for the current language only
  const posts = (await Promise.all(
    Object.entries(files)
      .map(async ([path, resolver]) => {
        const { metadata } = await resolver() as { metadata: PostMetadata };
        
        // Extract slug from filename
        const filename = path.split('/').pop() || '';
        // Remove language suffix for all files
        const slug = filename.replace(/\.(ko|en|ja)\.md$/, '');
        
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
    posts
  };
};