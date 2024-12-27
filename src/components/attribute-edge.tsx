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
    strokeWidth: isHovered ? 1.5 : 1,
    stroke: isHovered ? "#01C6FF" : style.stroke || "#8B5CF6",
    transition: "all 0.15s ease-out",
    strokeDasharray: isHovered ? "5,5" : "none",
    animation: isHovered ? "dashdraw 0.5s linear infinite" : "none",
    opacity: hoveredNode && !isHovered ? 0.5 : 1,
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={edgeStyle} />
      <style>
        {`
          @keyframes dashdraw {
            from {
              stroke-dashoffset: 10;
            }
            to {
              stroke-dashoffset: 0;
            }
          }
        `}
      </style>
    </>
  );
}
