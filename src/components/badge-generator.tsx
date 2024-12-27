"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Loader2 } from "lucide-react";
import { parseRepoUrl, getBranches, getMarkdownFiles } from "@/lib/github-api";

export default function BadgeGenerator() {
  const [repoUrl, setRepoUrl] = useState("");
  const [branch, setBranch] = useState("");
  const [path, setPath] = useState("");
  const [branches, setBranches] = useState<string[]>([]);
  const [mdFiles, setMdFiles] = useState<string[]>([]);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (repoUrl) {
      setIsLoadingBranches(true);
      fetchBranches(repoUrl)
        .then(setBranches)
        .catch(console.error)
        .finally(() => setIsLoadingBranches(false));
    }
  }, [repoUrl]);

  useEffect(() => {
    if (repoUrl && branch) {
      setIsLoadingFiles(true);
      fetchMdFiles(repoUrl, branch)
        .then(setMdFiles)
        .catch(console.error)
        .finally(() => setIsLoadingFiles(false));
    }
  }, [repoUrl, branch]);

  const fetchBranches = async (url: string) => {
    const repoInfo = parseRepoUrl(url);
    if (!repoInfo) return [];

    try {
      return await getBranches(repoInfo.owner, repoInfo.repo);
    } catch (error) {
      console.error("Error fetching branches:", error);
      return [];
    }
  };

  const fetchMdFiles = async (url: string, branch: string) => {
    const repoInfo = parseRepoUrl(url);
    if (!repoInfo) return [];

    try {
      return await getMarkdownFiles(repoInfo.owner, repoInfo.repo, branch);
    } catch (error) {
      console.error("Error fetching markdown files:", error);
      return [];
    }
  };

  const getBadgeUrl = () => {
    return "https://img.shields.io/badge/Open%20in%20MDModels-8A2BE2";
  };

  const getEditorUrl = () => {
    const encodedRepo = encodeURIComponent(repoUrl || "");
    const encodedBranch = encodeURIComponent(branch || "");
    const encodedPath = encodeURIComponent(path || "");
    return `http://mdmodels.vercel.app/?repo=${encodedRepo}&branch=${encodedBranch}&path=${encodedPath}`;
  };

  const getMarkdown = () => {
    return `[![Open in Editor](${getBadgeUrl()})](${getEditorUrl()})`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-10 mt-10">
      <div className="flex flex-col gap-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="repoUrl" className="text-[#adbac7] font-medium">
              Repository URL
            </Label>
            <Input
              id="repoUrl"
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
              className="bg-[#22272e] border-[#444c56] text-white placeholder:text-[#636e7b] focus-visible:ring-[#539bf5] focus-visible:ring-offset-[#22272e]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="branch" className="text-[#adbac7] font-medium">
              Branch
            </Label>
            <Select
              value={branch}
              onValueChange={setBranch}
              disabled={isLoadingBranches || branches.length === 0}
            >
              <SelectTrigger
                id="branch"
                className="bg-[#22272e] border-[#444c56] text-white focus:ring-[#539bf5] focus:ring-offset-[#22272e]"
              >
                <SelectValue placeholder="Select a branch" />
              </SelectTrigger>
              <SelectContent className="bg-[#2d333b] border-[#444c56] text-[#adbac7]">
                {isLoadingBranches ? (
                  <SelectItem value="loading" disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading branches...
                  </SelectItem>
                ) : (
                  branches.map((b) => (
                    <SelectItem
                      key={b}
                      value={b}
                      className="focus:bg-[#316dca] focus:text-white"
                    >
                      {b}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="path" className="text-[#adbac7] font-medium">
              File Path
            </Label>
            <Select
              value={path}
              onValueChange={setPath}
              disabled={isLoadingFiles || mdFiles.length === 0}
            >
              <SelectTrigger
                id="path"
                className="bg-[#22272e] border-[#444c56] text-white focus:ring-[#539bf5] focus:ring-offset-[#22272e]"
              >
                <SelectValue placeholder="Select an .md file" />
              </SelectTrigger>
              <SelectContent className="bg-[#2d333b] border-[#444c56] text-[#adbac7]">
                {isLoadingFiles ? (
                  <SelectItem value="loading" disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading files...
                  </SelectItem>
                ) : (
                  mdFiles.map((file) => (
                    <SelectItem
                      key={file}
                      value={file}
                      className="focus:bg-[#316dca] focus:text-white"
                    >
                      {file}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right column - Preview and Copy */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-sm font-medium">Preview</div>
            <div className="py-2">
              <a
                href={getEditorUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={getBadgeUrl()} alt="Open in Editor" />
              </a>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">Markdown</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="h-8 px-2 hover:bg-accent"
              >
                {copied ? (
                  <span className="text-xs text-green-500">Copied!</span>
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <pre className="font-mono text-sm p-3 rounded-md overflow-x-auto whitespace-pre-wrap break-all bg-[#22272e]">
              {getMarkdown()}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
