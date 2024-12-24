import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useDebounce } from "../hooks/use-debounce";
import {
  getBranches,
  getMarkdownFiles,
  getFileContent,
} from "@/lib/github-api";
import { GitHubLogoIcon, FileIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { useValidatorStore } from "@/lib/store";
import { getErrors } from "@/lib/validation";

export function GitHubFileSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [branches, setBranches] = useState<string[]>([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [fileContent, setFileContent] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { setErrors, setCode } = useValidatorStore();

  const debouncedRepoUrl = useDebounce(repoUrl, 500);

  const parseRepoUrl = (url: string) => {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    return match ? { owner: match[1], repo: match[2] } : null;
  };

  useEffect(() => {
    const fetchBranches = async () => {
      const repoInfo = parseRepoUrl(debouncedRepoUrl);
      if (!repoInfo) return;

      try {
        setIsLoading(true);
        const branchList = await getBranches(repoInfo.owner, repoInfo.repo);
        setBranches(branchList);
        setSelectedBranch("");
      } catch (err) {
        setError("Error fetching branches");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, [debouncedRepoUrl]);

  useEffect(() => {
    const fetchFiles = async () => {
      const repoInfo = parseRepoUrl(repoUrl);
      if (!repoInfo || !selectedBranch) return;

      try {
        setIsLoading(true);
        const fileList = await getMarkdownFiles(
          repoInfo.owner,
          repoInfo.repo,
          selectedBranch
        );
        setFiles(fileList);
        setSelectedFile("");
      } catch (err) {
        setError("Error fetching files");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, [repoUrl, selectedBranch]);

  useEffect(() => {
    const fetchFileContent = async () => {
      const repoInfo = parseRepoUrl(repoUrl);
      if (!repoInfo || !selectedBranch || !selectedFile) return;

      try {
        setIsLoading(true);
        const content = await getFileContent(
          repoInfo.owner,
          repoInfo.repo,
          selectedFile,
          selectedBranch
        );
        setFileContent(content);
      } catch (err) {
        console.error(err);
        setError("Error fetching file content");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFileContent();
  }, [repoUrl, selectedBranch, selectedFile]);

  const handleImport = () => {
    const errors = getErrors(fileContent);
    setErrors(errors);
    setCode(fileContent);
    setIsOpen(false);
  };

  const isValidRepo = parseRepoUrl(repoUrl) !== null;
  const canSelectBranch = isValidRepo && branches.length > 0;
  const canSelectFile = canSelectBranch && selectedBranch !== "";
  const canImport = canSelectFile && selectedFile !== "";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-transparent text-gray-400 hover:text-gray-300 border-none hover:bg-transparent hover:border-none"
        >
          <GitHubLogoIcon className="w-5 h-5 mr-2" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] rounded-lg border border-[#30363d] bg-[#0d1117] overflow-hidden backdrop-blur-lg bg-opacity-95">
        <DialogHeader>
          <DialogTitle className="text-[#adbac7]">
            Import Markdown File
          </DialogTitle>
          <DialogDescription className="text-[#768390]">
            Select a Markdown file from a GitHub repository to import as a data
            model.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4 py-4">
          <div className="flex-1 flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="repo-url" className="text-[#adbac7] font-medium">
                Repository URL
              </Label>
              <Input
                id="repo-url"
                placeholder="https://github.com/username/repository"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="bg-[#22272e] border-[#444c56] text-white placeholder:text-[#636e7b] focus-visible:ring-[#539bf5] focus-visible:ring-offset-[#22272e]"
              />
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="branch-select"
                className="text-[#adbac7] font-medium"
              >
                Branch
              </Label>
              <Select
                value={selectedBranch}
                onValueChange={setSelectedBranch}
                disabled={!canSelectBranch}
              >
                <SelectTrigger
                  id="branch-select"
                  className="bg-[#22272e] border-[#444c56] text-white focus:ring-[#539bf5] focus:ring-offset-[#22272e]"
                >
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent className="bg-[#2d333b] border-[#444c56] text-[#adbac7]">
                  {branches.map((branch) => (
                    <SelectItem
                      key={branch}
                      value={branch}
                      className="focus:bg-[#316dca] focus:text-white"
                    >
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="file-select"
                className="text-[#adbac7] font-medium"
              >
                Markdown File
              </Label>
              <Select
                value={selectedFile}
                onValueChange={setSelectedFile}
                disabled={!canSelectFile}
              >
                <SelectTrigger
                  id="file-select"
                  className="bg-[#22272e] border-[#444c56] text-white focus:ring-[#539bf5] focus:ring-offset-[#22272e]"
                >
                  <SelectValue placeholder="Select file" />
                </SelectTrigger>
                <SelectContent className="bg-[#2d333b] border-[#444c56] text-[#adbac7]">
                  {files.map((file) => (
                    <SelectItem
                      key={file}
                      value={file}
                      className="focus:bg-[#316dca] focus:text-white"
                    >
                      <div className="flex items-center">
                        <FileIcon className="w-4 h-4 mr-2" />
                        {file}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isLoading && null}
            {error && <div className="text-center text-[#f47067]">{error}</div>}
          </div>
          <div className="flex-1 flex flex-col">
            {fileContent && (
              <div className="flex-1 grid gap-2">
                <Label className="text-[#adbac7] font-medium">
                  File Preview
                </Label>
                <div className="h-[300px] overflow-y-auto rounded-md border border-[#444c56] bg-[#2d333b] p-4">
                  <pre className="text-sm text-[#adbac7] font-mono">
                    {fileContent}
                  </pre>
                </div>
              </div>
            )}
            <Button
              onClick={handleImport}
              disabled={!canImport}
              className="mt-4 bg-[#347d39] text-white hover:bg-[#46954a] focus-visible:ring-[#539bf5] focus-visible:ring-offset-[#22272e] disabled:bg-[#2d333b] disabled:text-[#636e7b]"
            >
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
