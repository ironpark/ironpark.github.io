import { error } from '@sveltejs/kit';
import type { PageLoad, EntryGenerator } from './$types';
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
    return await import(`../../../content/blog/${slug}.md`);
  } else if (locale === 'jp' || locale === 'ja') {
    return await import(`../../../content/blog/translate/${slug}.jp.md`);
  } else {
    return await import(`../../../content/blog/translate/${slug}.en.md`);
  }
}


export const load: PageLoad = async ({ params }) => {
  // Get current locale
  const locale = getLocale();
  console.log(params, locale);
  const post = await getPostByLocale(locale, params.slug);
  console.log(post);
  return {
    slug: params.slug,
    content: post!.default,
    metadata: post!.metadata,
  };
};