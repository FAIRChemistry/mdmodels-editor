import { useHoveredNode } from "@/lib/stores/graph-store";
import { AttributeEdge as AttributeEdgeType } from "@/types";
import { BaseEdge, getBezierPath, type EdgeProps } from "reactflow";
import React from "react";

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

  // Memoize the path calculation since it's computationally expensive
  const edgePath = React.useMemo(
    () =>
      getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
      })[0],
    [sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition]
  );

  // Memoize the hover state calculation
  const isHovered = React.useMemo(
    () =>
      hoveredNode === data?.sourceObject || hoveredNode === data?.targetObject,
    [hoveredNode, data?.sourceObject, data?.targetObject]
  );

  // Memoize the edge style object to prevent unnecessary recalculations
  const edgeStyle = React.useMemo(
    () => ({
      ...style,
      strokeWidth: isHovered ? 1.5 : 1,
      stroke: isHovered ? "#01C6FF" : style.stroke || "#8B5CF6",
      transition: "all 0.15s ease-out",
      strokeDasharray: isHovered ? "5,5" : "none",
      animation: isHovered ? "dashdraw 0.5s linear infinite" : "none",
      opacity: hoveredNode && !isHovered ? 0.5 : 1,
    }),
    [style, isHovered, hoveredNode]
  );

  // Move keyframe styles outside component to prevent recreation on each render
  return <BaseEdge path={edgePath} markerEnd={markerEnd} style={edgeStyle} />;
}
