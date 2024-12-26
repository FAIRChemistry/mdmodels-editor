"use client";

import { Suspense, lazy } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { EditorTabs } from "./editor-tabs";
import { Tab } from "@/types";
import { useValidatorStore } from "@/lib/stores/validator-store";

// Lazy load components
const EditorTab = lazy(() =>
  import("./editor-tab").then((module) => ({ default: module.EditorTab }))
);
const PreviewTab = lazy(() =>
  import("./preview-tab").then((module) => ({ default: module.PreviewTab }))
);
const GraphTab = lazy(() =>
  import("./graph-tab").then((module) => ({ default: module.GraphTab }))
);
const SchemaExporter = lazy(() => import("./schema-exporter"));
const GitHubFileSelector = lazy(() =>
  import("./github-file-selector").then((module) => ({
    default: module.GitHubFileSelector,
  }))
);
const DataModelTutorialModal = lazy(() =>
  import("./data-model-tutorial-modal").then((module) => ({
    default: module.DataModelTutorialModal,
  }))
);

export const EMPTY_DOC_ERROR = "This model has no definitions.";
const EDITOR_TABS = [
  { value: Tab.Editor, label: "Editor" },
  { value: Tab.Preview, label: "Preview" },
  { value: Tab.Graph, label: "Graph" },
];

export function MarkdownEditor() {
  const { selectedTab } = useValidatorStore();

  return (
    <div className="rounded-lg border border-[#30363d] bg-[#0d1117] overflow-hidden backdrop-blur-sm bg-opacity-95 h-full flex flex-col">
      <Tabs defaultValue={selectedTab} className="flex-1 flex flex-col h-full">
        <div className="flex items-center justify-between px-4 border-b border-[#30363d] shadow-lg">
          <EditorTabs tabs={EDITOR_TABS} />
          <div className="flex flex-row gap-0">
            <Suspense fallback={null}>
              <GitHubFileSelector />
              <SchemaExporter />
              <DataModelTutorialModal />
            </Suspense>
          </div>
        </div>

        <TabsContent value="editor" className="flex-1 mt-0 h-full">
          <Suspense fallback={<div>Loading editor...</div>}>
            <EditorTab height={"690px"} />
          </Suspense>
        </TabsContent>

        <TabsContent value="preview" className="flex-1 mt-0 h-full">
          <Suspense fallback={<div>Loading preview...</div>}>
            <PreviewTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="graph" className="flex-1 mt-0 h-full">
          <Suspense fallback={<div>Loading graph...</div>}>
            <GraphTab />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}