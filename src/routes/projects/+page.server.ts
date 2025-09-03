import type { PageServerLoad } from './$types';
import { GITHUB_TOKEN } from '$env/static/private';
import { dev } from '$app/environment';

export const prerender = true;

// 여기에 표시하고 싶은 리포지토리 이름들을 추가하세요
const REPO_NAMES = [
  'ironpark/ivent',
  'ironpark/zapp',
  'ironpark/ironpark.github.io',
  'ironpark/teatime',
  // 'ironpark/your-repo-name',
  // 더 많은 리포지토리 추가...
];

interface GitHubRepo {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string;
  topics: string[];
  homepage?: string;
}

export const load: PageServerLoad = async ({ fetch }) => {
  if (dev) {
    return {"projects":[{"name":"zapp","fullName":"ironpark/zapp","description":"Zapp is a powerful CLI tool designed to simplify and streamline the deployment of macOS applications. With Zapp, you can effortlessly create dmg and pkg files, perform code signing, notarize your apps, and modify plist files.","url":"https://github.com/ironpark/zapp","stars":57,"language":"Go","topics":["dmg","macos","pkg"],"homepage":""},{"name":"ivent","fullName":"ironpark/ivent","description":"Simple input event hook library for golang","url":"https://github.com/ironpark/ivent","stars":5,"language":"Go","topics":[],"homepage":null}]}
  }
  const projects = await Promise.all(
    REPO_NAMES.map(async (repoName) => {
      try {
        const headers: HeadersInit = {
          'Accept': 'application/vnd.github.v3+json',
        };
        
        // GitHub API 토큰이 있다면 추가 (rate limit 증가)
        if (GITHUB_TOKEN) {
          headers['Authorization'] = `token ${GITHUB_TOKEN}`;
        }
        
        const response = await fetch(`https://api.github.com/repos/${repoName}`, {
          headers
        });

        if (!response.ok) {
          console.error(`Failed to fetch ${repoName}: ${response.status}`);
          return null;
        }

        const repo: GitHubRepo = await response.json();
        
        return {
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description || 'No description available',
          url: repo.html_url,
          stars: repo.stargazers_count,
          language: repo.language || 'Unknown',
          topics: repo.topics || [],
          homepage: repo.homepage
        };
      } catch (error) {
        console.error(`Error fetching ${repoName}:`, error);
        return null;
      }
    })
  );
  // null 값 필터링
  const validProjects = projects.filter(project => project !== null);

  // 스타 수로 정렬 (높은 순)
  validProjects.sort((a, b) => (b?.stars || 0) - (a?.stars || 0));
  // console.log(JSON.stringify({
  //   projects: validProjects
  // }));

  return {
    projects: validProjects
  };
};