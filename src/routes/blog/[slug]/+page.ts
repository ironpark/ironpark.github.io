import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
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

const getPostByLocale = async (locale: string, slug: string) => {
  if (locale === 'ko') {
    return await import(`../../../content/blog/${slug}.md`);
  } else if (locale === 'ja') {
    return await import(`../../../content/blog/translate/${slug}.ja.md`);
  } else {
    return await import(`../../../content/blog/translate/${slug}.en.md`);
  }
}


export const load: PageLoad = async ({ params }) => {
  // Get current locale
  const locale = getLocale();
  const post = await getPostByLocale(locale, params.slug);
  
  return {
    slug: params.slug,
    content: post!.default,
    metadata: post!.metadata,
    ogImage: post!.metadata.thumbnail,
  };
}