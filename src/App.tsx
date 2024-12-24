import { Background } from "@/components/background";
import { MarkdownEditor } from "@/components/markdown-editor";
import { ValidationPanel } from "@/components/validation-panel";
import { RiStackLine } from "react-icons/ri";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0d1117] relative overflow-hidden">
      <Background />

      <main className="relative container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            <RiStackLine className="inline-block mr-2" /> MD-Models Editor
          </h1>
          <p className="text-xl text-gray-400">
            Edit, lint and validate your markdown data models
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr,400px] gap-4">
          <MarkdownEditor />
          <ValidationPanel />
        </div>
      </main>
    </div>
  );
}
