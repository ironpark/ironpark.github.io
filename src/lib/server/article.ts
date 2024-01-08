import fss from 'fs';
import fs from 'fs/promises';
import yaml from 'js-yaml';
import { GITHUB_TOKEN } from '$env/static/private';
/** Meatadata of article */
export type ArticleMeta = {
  /** Article ID */
  id: string;
  /** Title */
  title: string;
  /** Published date as YYYY-MM-DD form */
  publishedAt: string;
  /** Modified datetime as ISO format */
  modifiedAt: string;
  /** Short summary in plain text */
  summary: string;
  /** Draft flag */
  draft: boolean;
};

function getFilesizeInBytes(filename: string) {
  let stats = fss.statSync(filename);
  let fileSizeInBytes = stats.size;
  return {
    size: stats.size,
    mtime: stats.mtime,
    ctime: stats.ctime
  };
}

export const fetchMarkdownPosts = async () => {
  const allPostFiles = import.meta.glob('/src/routes/posts/*.md');
  const iterablePostFiles = Object.entries(allPostFiles);
  console.log(iterablePostFiles);
  const allPosts = await Promise.all(
    iterablePostFiles.map(async ([path, resolver]) => {
      // @ts-ignore
      const data = await resolver();
      // console.log(data);
      // @ts-ignore
      const { metadata } = data;
      const postPath = path.slice(11, -3);
      console.log(getFilesizeInBytes('.' + path));
      return {
        info: getFilesizeInBytes('.' + path),
        meta: metadata,
        path: postPath
      };
    })
  );
  return allPosts;
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
