export async function fetchGithubRepoData(url: string) {
  try {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) return null;

    const [, owner, repo] = match;
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);

    if (!response.ok) return null;

    const data = await response.json();
    return {
      label: data.name.toUpperCase(),
      value: data.full_name,
      status: 'ACTIVE',
      metadata: {
        stars: data.stargazers_count,
        language: data.language || 'Unknown',
        description: data.description || '',
        license: data.license?.spdx_id || 'None',
        owner: data.owner.login
      }
    };
  } catch (error) {
    console.error('Failed to fetch GitHub repo data', error);
    return null;
  }
}
