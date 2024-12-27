import { Background } from "@/components/background";
import { MarkdownEditor } from "@/components/markdown-editor";
import { ValidationPanel } from "@/components/validation-panel";
import { RiStackLine } from "react-icons/ri";
import {
  useValidatorStore,
  useCode,
  useStructure,
} from "@/lib/stores/validator-store";
import TableOfContents from "@/components/table-of-contents";
import { Tab } from "./types";
import { ReactFlowProvider } from "reactflow";
import { useEffect } from "react";

export default function App() {
  const { selectedTab } = useValidatorStore();
  const code = useCode();
  const structure = useStructure();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const repo = params.get("repo");
    const branch = params.get("branch");
    const path = params.get("path");

    console.log({ repo, branch, path });
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

      <main className="relative w-full px-8 py-8">
        <div className="text-start mb-6">
          <h1 className="text-2xl font-semibold text-white mb-4 ml-4 flex items-baseline">
            <RiStackLine className="mr-1 translate-y-[0.2rem]" />
            <span className="text-2xl ml-1 text-white">MD-Models</span>
            <span className="text-xl ml-2 text-gray-400 font-thin">Editor</span>
          </h1>
        </div>
        <ReactFlowProvider>
          <div
            className={`grid grid-cols-1 h-[calc(100vh-10rem)] min-h-[calc(100vh-10rem)] ${
              selectedTab === Tab.Graph
                ? "md:grid-cols-[250px,1fr]"
                : "md:grid-cols-[250px,1fr,330px]"
            } gap-0 shadow-lg`}
          >
            <TableOfContents />
            <MarkdownEditor />
            {selectedTab !== Tab.Graph && <ValidationPanel />}
          </div>
        </ReactFlowProvider>
      </main>
    </div>
  );
}
