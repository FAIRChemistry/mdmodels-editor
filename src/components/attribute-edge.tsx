import { useHoveredNode } from "@/lib/stores/graph-store";
import { AttributeEdge as AttributeEdgeType } from "@/types";
import { BaseEdge, getBezierPath, type EdgeProps } from "reactflow";

export default function AttributeEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps<AttributeEdgeType>) {
  const hoveredNode = useHoveredNode();
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isHovered =
    hoveredNode === data?.sourceObject || hoveredNode === data?.targetObject;
  const edgeStyle = {
    ...style,
    filter: isHovered ? "drop-shadow(0 0 8px #ffffff)" : undefined,
    strokeWidth: isHovered ? 2 : 1,
    stroke: isHovered ? "#4ade80" : style.stroke || "#8B5CF6",
    transition: "all 0.15s ease-out",
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={edgeStyle} />
    </>
  );
}
