import { Background } from "@/components/background";
import { MarkdownEditor } from "@/components/markdown-editor";
import { ValidationPanel } from "@/components/validation-panel";
import { RiStackLine } from "react-icons/ri";
import { useValidatorStore } from "@/lib/stores/validator-store";
import TableOfContents from "@/components/table-of-contents";
import { Tab } from "./types";
import { ReactFlowProvider } from "reactflow";

export default function App() {
  const { selectedTab } = useValidatorStore();

  return (
    <div className="min-h-screen bg-[#0d1117] relative overflow-hidden">
      <Background />

      <main className="relative container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            <RiStackLine className="inline-block mr-2" /> MD-Models Editor
          </h1>
          <p className="text-md text-gray-400">
            Edit, lint and validate your markdown data models
          </p>
        </div>
        <ReactFlowProvider>
          <div
            className={`grid grid-cols-1 h-[calc(100vh-12rem)] min-h-[100vh-12rem] ${
              selectedTab === Tab.Graph
                ? "md:grid-cols-[250px,1fr]"
                : "md:grid-cols-[250px,1fr,400px]"
            } gap-4`}
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
