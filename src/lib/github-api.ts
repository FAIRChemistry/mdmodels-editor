import { Octokit } from "@octokit/rest";

const octokit = new Octokit();

/**
 * Parses a GitHub repository URL to extract owner and repository name
 * @param url - The GitHub repository URL to parse
 * @returns An object containing owner and repo names, or null if URL is invalid
 */
export function parseRepoUrl(
  url: string
): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  return match ? { owner: match[1], repo: match[2] } : null;
}

/**
 * Fetches all branches for a GitHub repository
 * @param owner - The repository owner's username
 * @param repo - The repository name
 * @returns Promise resolving to an array of branch names
 */
export async function getBranches(owner: string, repo: string) {
  const response = await octokit.repos.listBranches({ owner, repo });
  return response.data.map((branch) => branch.name);
}

/**
 * Retrieves all markdown files in a GitHub repository branch
 * @param owner - The repository owner's username
 * @param repo - The repository name
 * @param branch - The branch name to search in
 * @returns Promise resolving to an array of markdown file paths
 */
export async function getMarkdownFiles(
  owner: string,
  repo: string,
  branch: string
) {
  const response = await octokit.git.getTree({
    owner,
    repo,
    tree_sha: branch,
    recursive: "true",
  });
  return response.data.tree
    .filter(
      (item): item is { path: string } =>
        typeof item.path === "string" && item.path.endsWith(".md")
    )
    .map((item) => item.path);
}

/**
 * Fetches the content of a specific file from a GitHub repository
 * @param owner - The repository owner's username
 * @param repo - The repository name
 * @param path - The file path within the repository
 * @param branch - The branch name containing the file
 * @returns Promise resolving to the decoded file content as a string
 * @throws Error if file content is not found
 */
export async function getFileContent(
  owner: string,
  repo: string,
  path: string,
  branch: string
) {
  const response = await octokit.repos.getContent({
    owner,
    repo,
    path,
    ref: branch,
  });
  if ("content" in response.data) {
    return atob(response.data.content);
  }
  throw new Error("File content not found");
}
