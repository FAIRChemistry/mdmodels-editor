"use client";

import { Suspense, lazy, useRef, useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { EditorTabs } from "./editor-tabs";
import { Tab } from "@/types";
import { useValidatorStore } from "@/lib/stores/validator-store";
import NewDocumentButton from "./new-doc-button";
import Loading from "./loading";

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
  import("./tutorial-modal").then((module) => ({
    default: module.DataModelTutorialModal,
  }))
);

export const EMPTY_DOC_ERROR = "This model has no definitions.";
const EDITOR_TABS = [
  { value: Tab.Editor, label: "Editor" },
  { value: Tab.Graph, label: "Graph" },
  { value: Tab.Preview, label: "Preview" },
];

export function MarkdownEditor() {
  const { selectedTab } = useValidatorStore();
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [editorHeight, setEditorHeight] = useState<number>(0);

  useEffect(() => {
    if (!editorContainerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setEditorHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(editorContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      className={`border border-[#30363d] bg-[#0d1117] overflow-hidden backdrop-blur-sm bg-opacity-95 h-full flex flex-col relative ${
        selectedTab === Tab.Graph ? "rounded-r-lg" : ""
      }`}
    >
      <Tabs defaultValue={selectedTab} className="flex-1 flex flex-col h-full">
        <div className="flex items-center justify-between px-4 border-b border-[#30363d] shadow-lg min-h-[3.1rem] sticky top-0 z-10 bg-[#0d1117]">
          <EditorTabs tabs={EDITOR_TABS} />
          <div className="flex flex-row gap-0">
            <Suspense fallback={null}>
              <div id="new-document-button-container">
                <NewDocumentButton />
              </div>
              <div id="github-file-selector-container">
                <GitHubFileSelector />
              </div>
              <div id="schema-exporter-container">
                <SchemaExporter />
              </div>
              <div id="data-model-tutorial-modal-container">
                <DataModelTutorialModal />
              </div>
            </Suspense>
          </div>
        </div>

        <TabsContent
          value={Tab.Editor}
          className="flex-1 mt-0 h-full"
          ref={editorContainerRef}
        >
          <Suspense fallback={<Loading message="Loading editor..." />}>
            <EditorTab height={`${editorHeight}px`} isMain={true} />
          </Suspense>
        </TabsContent>

        <TabsContent value={Tab.Preview} className="flex-1 mt-0 h-full">
          <Suspense fallback={<Loading message="Loading preview..." />}>
            <PreviewTab />
          </Suspense>
        </TabsContent>

        <TabsContent value={Tab.Graph} className="flex-1 mt-0 h-full">
          <Suspense fallback={<Loading message="Loading graph..." />}>
            <GraphTab />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
