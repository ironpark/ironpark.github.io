import fss from 'fs';
import { basename } from 'path';
import { GITHUB_TOKEN } from '$env/static/private';
const getFileInfo = (filename: string) => {
	let stats = fss.statSync(filename);
	return {
		size: stats.size,
		mtime: stats.mtime,
		ctime: stats.ctime
	};
};

export const fetchMarkdownPosts = async () => {
	const allPostFiles = import.meta.glob('/contents/posts/*.md');
	const iterablePostFiles = Object.entries(allPostFiles);
	return await Promise.all(
		iterablePostFiles.map(async ([path, resolver]) => {
			// @ts-ignore
			const { metadata } = await resolver();
			return {
				info: getFileInfo('.' + path),
				meta: metadata,
				path: '/posts/' + basename(path).split('.')[0]
			};
		})
	);
};

export const fetchMarkdownMemos = async () => {
	const allPostFiles = import.meta.glob('/contents/memos/*.md');
	const iterablePostFiles = Object.entries(allPostFiles);
	return await Promise.all(
		iterablePostFiles.map(async ([path, resolver]) => {
			// @ts-ignore
			const { metadata } = await resolver();
			return {
				info: getFileInfo('.' + path),
				meta: metadata,
				path: '/posts/' + basename(path).split('.')[0]
			};
		})
	);
};

export const githubUserInfo = async (githubUsername: string) => {
	const url = 'https://api.github.com/graphql';
	const queryBody = `query { user(login: "${githubUsername}") { name avatarUrl(size:80) contributionsCollection { contributionCalendar { totalContributions weeks {contributionDays {contributionCount date color}}} } } }`;

	const headers = {
		Authorization: `Bearer ${GITHUB_TOKEN}`,
		'Content-Type': 'application/json'
	};

	const response = await fetch(url, {
		method: 'POST',
		headers: headers,
		body: JSON.stringify({ query: queryBody })
	});

	return (await response.json()).data.user;
};
