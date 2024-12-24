import { Octokit } from "@octokit/rest";

const octokit = new Octokit();

export async function getBranches(owner: string, repo: string) {
  const response = await octokit.repos.listBranches({ owner, repo });
  return response.data.map((branch) => branch.name);
}

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
