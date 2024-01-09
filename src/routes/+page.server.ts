import { fetchMarkdownPosts, githubUserInfo } from '$lib/server/utils';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const posts = (await fetchMarkdownPosts()).filter((post) => post.meta.published);
  const userInfo = await githubUserInfo('ironpark');
  return { posts, userInfo };
};
