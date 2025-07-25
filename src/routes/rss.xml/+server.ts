import { getLocale } from '$lib/paraglide/runtime';
import type { RequestHandler } from './$types';
import * as m from '$lib/paraglide/messages';
export const prerender = true;

const getPosts = async (locale:string) => {
  if (locale === 'ko') {
    return await import.meta.glob('/src/content/blog/*.md')
  } else if (locale === 'en') {
    return await import.meta.glob('/src/content/blog/translate/*.en.md')
  } else if (locale === 'jp') {
    return await import.meta.glob('/src/content/blog/translate/*.jp.md')
  }
  return {}
}
export const GET: RequestHandler = async () => {
  const locale = getLocale();
  const language = (locale:string) => {
    if (locale === 'ko') {
      return 'ko-kr'
    } else if (locale === 'en') {
      return 'en-us'
    } else if (locale === 'jp') {
      return 'ja-jp'
    }
  }
  let baseUrl = 'https://ironpark.github.io'
  if (locale === 'en') {
    baseUrl = 'https://ironpark.github.io/en'
  } else if (locale === 'jp') {
    baseUrl = 'https://ironpark.github.io/jp'
  }
  const files = await getPosts(locale)
  const posts = await Promise.all(
    Object.entries(files).map(async ([path, resolver]) => {
      const { metadata } = await resolver() as { metadata: any };
      let slug = path.split('/').pop()?.replace('.md', '');
      if (locale != 'ko'){
        slug = slug?.replace('.en','').replace('.jp','')
      }
      return {
        ...metadata,
        slug
      };
    })
  );  
  // Sort posts by date (newest first)
  posts.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
  
  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${m.site_title()}</title>
    <link>${baseUrl}</link>
    <description>${m.blog_description()}</description>
    <atom:link href="${baseUrl}/rss" rel="self" type="application/rss+xml" />
    <language>${language(locale)}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${posts.map(post => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <description>${escapeXml(post.description || '')}</description>
      <pubDate>${new Date(post.created).toUTCString()}</pubDate>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
    </item>`).join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml',
      'Cache-Control': 'max-age=0, s-maxage=3600'
    }
  });
};

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}