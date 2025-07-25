import type { PageServerLoad } from './$types';
import { extractLocaleFromRequest,extractLocaleFromUrl,getLocale } from '$lib/paraglide/runtime.js';
import { glob } from 'node:fs';

export const prerender = true;

// created: 2025-07-20T00:00
// updated: 2025-07-25T08:12
// published: true

// title: 나만의 블로그를 만들다
// sub-title: 이상적인 블로그의 조건은 무엇인가
// description: '여러 번의 시행착오 끝에 찾은 나만의 이상적인 블로그 만들기. GitHub Pages와 SvelteKit 조합으로 비용 최소화, 데이터 소유권 확보, 자유로운 커스터마이징, 그리고 Obsidian과 마크다운을 활용한 편리한 글쓰기 환경까지. 플랫폼에 의존하지 않고 진정한 내 공간을 만드는 과정과 그 과정에서 깨달은 이상적인 도구와 이상적인 블로그의 차이에 대한 성찰.'

// series: 똑똑한 블로그 만들기
// categories: [Thoughts]
// tags: [github-pages,markdown,svelte-kit]
// lang: ko
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
    posts
  };
};