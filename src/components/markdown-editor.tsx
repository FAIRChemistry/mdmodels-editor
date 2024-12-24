"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { EditorTabs } from "./editor-tabs";
import { EditorTab } from "./editor-tab";
import { PreviewTab } from "./preview-tab";
import { GraphTab } from "./graph-tab";
import SchemaExporter from "./schema-exporter";
import { GitHubFileSelector } from "./github-file-selector";
import { getErrors } from "@/lib/validation";
import { ValidationError } from "./validation-panel";
import { useValidatorStore } from "@/lib/store";

export const EMPTY_DOC_ERROR = "This model has no definitions.";

const EDITOR_TABS = [
  { value: "editor", label: "Editor" },
  { value: "preview", label: "Preview" },
  { value: "graph", label: "Graph" },
];

export function MarkdownEditor() {
  const { setErrors, code, setCode } = useValidatorStore();

  let debounceTimer: NodeJS.Timeout;

  const handleCodeChange = (code: string) => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      const convertedErrors: ValidationError[] = getErrors(code);
      setErrors(convertedErrors);
      setCode(code);
    }, 500);
  };

  return (
    <div className="rounded-lg border border-[#30363d] bg-[#0d1117] overflow-hidden backdrop-blur-sm bg-opacity-95">
      <div className="flex flex-row justify-between">
        <Tabs defaultValue="editor" className="w-full">
          <div className="flex items-center justify-between px-4">
            <EditorTabs tabs={EDITOR_TABS} />
            <div className="flex flex-row gap-1">
              <GitHubFileSelector />
              <SchemaExporter />
            </div>
          </div>

          <TabsContent value="editor" className="mt-0">
            <EditorTab code={code} onChange={handleCodeChange} />
          </TabsContent>

          <TabsContent value="preview" className="mt-0">
            <PreviewTab />
          </TabsContent>

          <TabsContent value="graph" className="mt-0">
            <GraphTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
