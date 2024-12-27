import { AttributeEdge } from "@/types";
import { Edge } from "reactflow";

/**
 * Creates a unique handle ID for a node attribute by combining the object name and attribute name
 * @param objName The name of the object/node
 * @param attrName The name of the attribute/handle
 * @returns A string ID in the format "objectName-attributeName"
 */
export function createHandleId(objName: string, attrName?: string | null) {
  if (!attrName) return objName;
  return `${objName}-${attrName}`;
}

/**
 * Checks if a node has any relationships with other nodes via edges
 * @param nodeName1 The name of the first node to check relationships for
 * @param nodeName2 The name of the second node to check relationships for
 * @param edges Array of attribute edges in the graph
 * @returns True if the node has any incoming or outgoing edges, false otherwise
 */
export function isRelatedTo(
  nodeName1: string,
  nodeName2: string,
  edges: Edge<AttributeEdge>[]
) {
  const relatedNodes = edges.filter(
    (edge) =>
      (edge.data?.sourceObject === nodeName1 &&
        edge.data?.targetObject === nodeName2) ||
      (edge.data?.sourceObject === nodeName2 &&
        edge.data?.targetObject === nodeName1)
  );
  return relatedNodes.length > 0;
}
