import Graph from "./model-graph";

export function GraphTab() {
  return (
    <div className="h-full w-full overflow-hidden">
      <Graph />
      <div id="portal-root" className="relative" />
    </div>
  );
}
