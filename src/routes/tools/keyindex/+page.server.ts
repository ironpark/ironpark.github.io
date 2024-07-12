import { fetchMarkdownPosts, getFootprints, githubUserInfo } from '$lib/server/utils';
export const ssr = false;
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async () => {
	const footprints = await getFootprints();
	console.log(footprints);
	return { footprints };
};
