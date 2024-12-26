import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

/**
 * Store interface for managing validation errors
 */
interface GraphStore {
  graphEditorOpen: string | null;
  setGraphEditorOpen: (open: string | null) => void;
  hoveredNode: string | null;
  setHoveredNode: (node: string | null) => void;
  intermediateCode: string | null;
  setIntermediateCode: (code: string | null) => void;
}

export const useGraphStore = create<GraphStore>()(
  subscribeWithSelector((set) => ({
    graphEditorOpen: null,
    setGraphEditorOpen: (open: string | null) => set({ graphEditorOpen: open }),
    hoveredNode: null,
    setHoveredNode: (node: string | null) => set({ hoveredNode: node }),
    intermediateCode: null,
    setIntermediateCode: (code: string | null) =>
      set({ intermediateCode: code }),
  }))
);

export const useGraphEditorOpen = () =>
  useGraphStore((state) => state.graphEditorOpen);
export const useSetGraphEditorOpen = () =>
  useGraphStore((state) => state.setGraphEditorOpen);
export const useHoveredNode = () => useGraphStore((state) => state.hoveredNode);
export const useSetHoveredNode = () =>
  useGraphStore((state) => state.setHoveredNode);
export const useIntermediateCode = () =>
  useGraphStore((state) => state.intermediateCode);
export const useSetIntermediateCode = () =>
  useGraphStore((state) => state.setIntermediateCode);
