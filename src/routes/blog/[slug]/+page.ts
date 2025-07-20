import { error } from '@sveltejs/kit';
import type { PageLoad, EntryGenerator } from './$types';
import { getLocale } from '$lib/paraglide/runtime.js';

export const prerender = true;

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

interface PostData {
  content: any;
  metadata: any;
}

interface AllPostVersions {
  ko?: PostData;
  en?: PostData;
  jp?: PostData;
}

export const load: PageLoad = async ({ params }) => {
  // Get current locale
  const locale = getLocale();
  
  // Load all available versions of this post
  const allVersions: AllPostVersions = {};
  
  // Try to load Korean version
  try {
    const koPost = await import(`../../../content/blog/${params.slug}.md`);
    allVersions.ko = {
      content: koPost.default,
      metadata: koPost.metadata
    };
  } catch (e) {
    // Korean version not found
  }
  
  // Try to load English version
  try {
    const enPost = await import(`../../../content/blog/translate/${params.slug}.en.md`);
    allVersions.en = {
      content: enPost.default,
      metadata: enPost.metadata
    };
  } catch (e) {
    // English version not found
  }
  
  // Try to load Japanese version
  try {
    const jpPost = await import(`../../../content/blog/translate/${params.slug}.jp.md`);
    allVersions.jp = {
      content: jpPost.default,
      metadata: jpPost.metadata
    };
  } catch (e) {
    // Japanese version not found
  }
  
  // Check if we have any version
  if (!allVersions.ko && !allVersions.en && !allVersions.jp) {
    error(404, `Could not find ${params.slug}`);
  }
  
  // Get the appropriate version for current locale
  const currentLocaleKey = locale === 'ko' ? 'ko' : locale === 'jp' ? 'jp' : 'en';
  let selectedPost = allVersions[currentLocaleKey];
  
  // Fallback to English, then Korean, then Japanese if current locale not available
  if (!selectedPost) {
    selectedPost = allVersions.en || allVersions.ko || allVersions.jp;
  }
  
  return {
    content: selectedPost!.content,
    metadata: selectedPost!.metadata,
    // Include information about available translations
    availableTranslations: {
      ko: !!allVersions.ko,
      en: !!allVersions.en,
      jp: !!allVersions.jp
    },
    allVersions // Include all versions for potential use
  };
};