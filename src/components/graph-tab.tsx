import { lazy, memo } from "react";

const Graph = lazy(() => import("./model-graph"));
const MemoizedGraph = memo(Graph);

export const GraphTab: React.FC = memo(() => {
  return (
    <div className="overflow-hidden w-full h-full">
      <MemoizedGraph />
      <div id="portal-root" className="relative" />
    </div>
  );
});

GraphTab.displayName = "GraphTab";
