import type { PageServerLoad } from './$types';
import { getLocale } from '$lib/paraglide/runtime.js';

export const prerender = true;

interface PostMetadata {
  title: string;
  date: string;
  tags?: string[];
  description?: string;
  [key: string]: any;
}
const getKoreanPosts = async () => {
  const files = await import.meta.glob('/src/content/blog/*.md');
  return files;
}
const getJapanesePosts = async () => {
  const files = await import.meta.glob('/src/content/blog/translate/*.jp.md');
  return files;
}
const getEnglishPosts = async () => {
  const files = await import.meta.glob('/src/content/blog/translate/*.en.md');
  return files;
}
export const load: PageServerLoad = async ({ request }) => {
  // Get current locale from request
  const locale = getLocale();
  let files: { [key: string]: () => Promise<unknown> } = {};
  if (locale === 'ko') {
    files = await getKoreanPosts();
  } else if (locale === 'jp') {
    files = await getJapanesePosts();
  } else {
    files = await getEnglishPosts();
  }
  // Import blog posts for the current language only
  const posts = await Promise.all(
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
  );
  // console.log(posts);
  // Sort by date (newest first)
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return {
    recentPosts: posts.slice(0, 3)
  };
};