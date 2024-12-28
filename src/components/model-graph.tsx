import { useCallback, useEffect, Suspense } from "react";
import ReactFlow, {
  Edge,
  ConnectionLineType,
  Background,
  useNodesState,
  useEdgesState,
  Controls,
  DefaultEdgeOptions,
} from "reactflow";
import "reactflow/dist/style.css";
import { useSetCode, useValidatorStore } from "@/lib/stores/validator-store";
import { createHandleId } from "@/lib/graph-utils";
import useLayoutNodes, { getLayoutedNodes } from "@/hooks/use-layouted-nodes";
import { ObjectNode } from "./object-node";
import {
  useGraphEditorOpen,
  useIntermediateCode,
  useSetGraphEditorOpen,
  useSetIntermediateCode,
} from "@/lib/stores/graph-store";
import { ObjectNodeType } from "@/types";
import AttributeEdge from "./attribute-edge";
import { Attribute, DataModel, Object as ObjectType } from "mdmodels-core";

const nodeTypes = {
  objectNode: ObjectNode,
} as const;

const edgeTypes = {
  attributeEdge: AttributeEdge,
} as const;

const edgeOptions: DefaultEdgeOptions = {
  type: "attributeEdge",
  style: {
    stroke: "#8B5CF6",
    strokeWidth: 1,
    color: "#8B5CF6",
  },
} as const;

const createNode = (
  obj: ObjectType,
  objIndex: number,
  yOffset: number
): ObjectNodeType => ({
  id: obj.name,
  type: "objectNode",
  position: { x: objIndex * 400, y: yOffset },
  data: obj,
});

const createEdgesForObject = (
  obj: ObjectType,
  structure: DataModel
): Edge[] => {
  const edges: Edge[] = [];

  obj.attributes.forEach((attr: Attribute) => {
    if (
      attr.dtypes.some((dtype: string) =>
        structure?.objects.some((o: ObjectType) => o.name === dtype)
      )
    ) {
      attr.dtypes.forEach((dtype: string) => {
        if (structure?.objects.some((o: ObjectType) => o.name === dtype)) {
          edges.push({
            id: `${obj.name}-${attr.name}-${dtype}`,
            source: obj.name,
            sourceHandle: createHandleId(obj.name, attr.name),
            targetHandle: createHandleId(dtype),
            target: dtype,
            animated: false,
            data: {
              sourceObject: obj.name,
              targetObject: dtype,
              ...attr,
            },
            ...edgeOptions,
          });
        }
      });
    }
  });

  return edges;
};

const flowProps = {
  nodeTypes,
  edgeTypes,
  connectionLineType: ConnectionLineType.SmoothStep,
  defaultEdgeOptions: edgeOptions,
  nodesDraggable: false,
  maxZoom: 1.2,
  minZoom: 0.1,
} as const;

export default function DataStandardGraph() {
  const { structure } = useValidatorStore();
  const intermediateCode = useIntermediateCode();
  const setCode = useSetCode();
  const setIntermediateCode = useSetIntermediateCode();
  const graphEditorOpen = useGraphEditorOpen();
  const setGraphEditorOpen = useSetGraphEditorOpen();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const createNodesAndEdges = useCallback(async () => {
    if (!structure?.objects) return { nodes: [], edges: [] };

    const nodes: ObjectNodeType[] = [];
    const edges: Edge[] = [];
    let yOffset = 0;

    structure.objects.forEach((obj, objIndex) => {
      nodes.push(createNode(obj, objIndex, yOffset));
      yOffset += 200;
      edges.push(...createEdgesForObject(obj, structure));
    });

    const layoutedNodes = await getLayoutedNodes(nodes, edges);
    return { nodes: layoutedNodes, edges };
  }, [structure]);

  const handlePaneClick = useCallback(() => {
    if (graphEditorOpen) {
      setGraphEditorOpen(null);
    }

    if (intermediateCode) {
      setCode(intermediateCode);
      setIntermediateCode(null);
    }
  }, [intermediateCode, setCode, setIntermediateCode, setGraphEditorOpen]);

  useEffect(() => {
    let mounted = true;

    const initializeGraph = async () => {
      const { nodes: newNodes, edges: newEdges } = await createNodesAndEdges();

      if (!mounted) return;

      setNodes((prevNodes) => {
        const existingNodesMap = new Map(
          prevNodes.map((node) => [node.id, node])
        );

        return newNodes.map((newNode) => {
          const existingNode = existingNodesMap.get(newNode.id);
          return existingNode
            ? { ...newNode, position: existingNode.position }
            : newNode;
        });
      });

      setEdges(newEdges);
    };

    initializeGraph();

    return () => {
      mounted = false;
    };
  }, [structure, createNodesAndEdges, setNodes, setEdges]);

  useLayoutNodes();

  return (
    <div className="w-full h-full bg-[#0D1117] rounded-md overflow-visible">
      <Suspense fallback={<div>Loading...</div>}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onPaneClick={handlePaneClick}
          {...flowProps}
        >
          <Background color="#30363D" />
          <Controls className="bg-[#0D1117] border-[#30363D] [&>button]:text-white [&>button]:border-[#30363D]" />
        </ReactFlow>
      </Suspense>
    </div>
  );
}
