import { useEffect } from "react";
import ELK from "elkjs/lib/elk.bundled.js";
import {
  type Edge,
  NodeProps,
  useNodesInitialized,
  useReactFlow,
} from "reactflow";
import { ObjectNodeType } from "@/types";
import { Object as ObjectType } from "mdmodels-core";
import { createHandleId } from "@/lib/graph-utils";

const layoutOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "RIGHT",
  "elk.layered.spacing.edgeNodeBetweenLayers": 80,
  "elk.spacing.nodeNode": 80,
  "elk.layered.spacing.baseValue": 80,
  "elk.spacing.componentComponent": 80,
  "elk.layered.spacing.nodeNodeBetweenLayers": 80,
  "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",
};

const elk = new ELK();

// uses elkjs to give each node a layouted position
export const getLayoutedNodes = async (
  nodes: ObjectNodeType[],
  edges: Edge[]
): Promise<ObjectNodeType[]> => {
  const graph = {
    id: "root",
    layoutOptions,
    children: nodes.map((objNode) => {
      const targetPorts = [
        {
          id: createHandleId(objNode.data.name),
          properties: {
            side: "WEST",
          },
        },
      ];

      const sourcePorts = objNode.data.attributes.map((attr) => ({
        id: createHandleId(objNode.data.name, attr.name),
        properties: {
          side: "EAST",
        },
      }));

      return {
        id: objNode.id,
        width: objNode.width ?? 150,
        height: objNode.height ?? 50,
        properties: {
          "org.eclipse.elk.portConstraints": "FIXED_ORDER",
        },

        ports: [{ id: objNode.id }, ...targetPorts, ...sourcePorts],
      };
    }),
    edges: edges.map((e) => ({
      id: e.id,
      sources: [e.sourceHandle || e.source],
      targets: [e.targetHandle || e.target],
    })),
  };

  // @ts-ignore
  const layoutedGraph = await elk.layout(graph);

  const layoutedNodes = nodes.map((node) => {
    const layoutedNode = layoutedGraph.children?.find(
      (lgNode) => lgNode.id === node.id
    );

    return {
      ...node,
      position: {
        x: layoutedNode?.x ?? 0,
        y: layoutedNode?.y ?? 0,
      },
    };
  });

  return layoutedNodes;
};

export default function useLayoutNodes() {
  const nodesInitialized = useNodesInitialized();
  const { getNodes, getEdges, setNodes, fitView } =
    useReactFlow<NodeProps<ObjectType>>();

  useEffect(() => {
    if (nodesInitialized) {
      const layoutNodes = async () => {
        const layoutedNodes = await getLayoutedNodes(
          getNodes() as unknown as ObjectNodeType[],
          getEdges()
        );
        // @ts-ignore
        setNodes(layoutedNodes);
        setTimeout(() => fitView(), 0);
      };

      layoutNodes();
    }
  }, [nodesInitialized, getNodes, getEdges, setNodes, fitView]);

  return null;
}
