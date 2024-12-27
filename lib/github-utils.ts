export const parseRepoUrl = (url: string) => {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  return match ? { owner: match[1], repo: match[2] } : null;
};

export const fetchBranches = async (repoUrl: string): Promise<string[]> => {
  const repoInfo = parseRepoUrl(repoUrl);
  if (!repoInfo) return [];

  try {
    return await getBranches(repoInfo.owner, repoInfo.repo);
  } catch (err) {
    console.error("Error fetching branches:", err);
    throw new Error("Error fetching branches");
  }
};

export const fetchMarkdownFiles = async (
  repoUrl: string,
  branch: string
): Promise<string[]> => {
  const repoInfo = parseRepoUrl(repoUrl);
  if (!repoInfo) return [];

  try {
    return await getMarkdownFiles(repoInfo.owner, repoInfo.repo, branch);
  } catch (err) {
    console.error("Error fetching files:", err);
    throw new Error("Error fetching files");
  }
};

export const fetchFileContent = async (
  repoUrl: string,
  filePath: string,
  branch: string
): Promise<string> => {
  const repoInfo = parseRepoUrl(repoUrl);
  if (!repoInfo) throw new Error("Invalid repository URL");

  try {
    return await getFileContent(
      repoInfo.owner,
      repoInfo.repo,
      filePath,
      branch
    );
  } catch (err) {
    console.error("Error fetching file content:", err);
    throw new Error("Error fetching file content");
  }
};

const GITHUB_API_BASE = "https://api.github.com";

export const getBranches = async (
  owner: string,
  repo: string
): Promise<string[]> => {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/branches`
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const branches = await response.json();
  return branches.map((branch: { name: string }) => branch.name);
};

export const getMarkdownFiles = async (
  owner: string,
  repo: string,
  branch: string
): Promise<string[]> => {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.tree
    .filter((item: { path: string }) => item.path.endsWith(".md"))
    .map((item: { path: string }) => item.path);
};

export const getFileContent = async (
  owner: string,
  repo: string,
  filePath: string,
  branch: string
): Promise<string> => {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const data = await response.json();
  // GitHub API returns content as base64 encoded string
  return Buffer.from(data.content, "base64").toString("utf-8");
};
