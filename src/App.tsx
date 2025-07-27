import { Background } from "@/components/background";
import { MarkdownEditor } from "@/components/markdown-editor";
import { ValidationPanel } from "@/components/validation-panel";
import { RiStackLine } from "react-icons/ri";
import {
  useValidatorStore,
  useCode,
  useStructure,
  useSetCode,
} from "@/lib/stores/validator-store";
import TableOfContents from "@/components/table-of-contents";
import { Tab } from "./types";
import { ReactFlowProvider } from "reactflow";
import { useEffect } from "react";
import { getFileContent, parseRepoUrl } from "./lib/github-api";

export default function App() {
  const { selectedTab } = useValidatorStore();
  const code = useCode();
  const setCode = useSetCode();
  const { setTutorialOpen } = useValidatorStore();
  const structure = useStructure();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const repo = params.get("repo");

    if (params.has("about")) {
      setTutorialOpen(true);
      return;
    }

    if (!repo) return;
    const repoInfo = parseRepoUrl(repo);

    if (!repoInfo) return;

    const branch = params.get("branch");
    const path = params.get("path");

    if (repo && branch && path) {
      getFileContent(repoInfo.owner, repoInfo.repo, path, branch)
        .then((content) => {
          setCode(content);
          window.history.replaceState({}, "", window.location.pathname);
        })
        .catch((error) => {
          console.error("Failed to load file content:", error);
        });
    }
  }, []);

  useEffect(() => {
    const handleSave = async (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        const blob = new Blob([code], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${structure?.name || "schema"}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    };

    window.addEventListener("keydown", handleSave);
    return () => window.removeEventListener("keydown", handleSave);
  }, [code]);

  return (
    <div className="min-h-screen bg-[#0d1117] relative overflow-hidden">
      <Background />

      <main className="relative px-8 py-8 w-full">
        <div className="flex flex-row justify-between mb-6 text-start">
          <h1 className="flex items-baseline mb-4 ml-4 text-2xl font-semibold text-white">
            <RiStackLine className="mr-1 translate-y-[0.2rem]" />
            <span className="ml-1 text-2xl text-white">MD-Models</span>
            <span className="ml-2 text-xl font-thin text-gray-400">Editor</span>
          </h1>
        </div>
        <div
          className={`grid grid-cols-1 h-[calc(100vh-10rem)] min-h-[calc(100vh-10rem)] ${selectedTab !== Tab.Editor
              ? "md:grid-cols-[1fr,5.5fr]"
              : "md:grid-cols-[1fr,4fr,1.5fr]"
            } gap-0 shadow-lg`}
        >
          <ReactFlowProvider>
            <TableOfContents />
            <MarkdownEditor />
            {selectedTab === Tab.Editor && <ValidationPanel />}
          </ReactFlowProvider>
        </div>
      </main>
    </div>
  );
}
