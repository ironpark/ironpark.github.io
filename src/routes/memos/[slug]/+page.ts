// src/routes/blog/[slug]/+page.js
export async function load({ params }) {
	const post = await import(`../../../../contents/posts/${params.slug}.md`);
	const { title, date } = post.metadata;
	const content = post.default;

	return {
		content,
		title,
		date
	};
}
