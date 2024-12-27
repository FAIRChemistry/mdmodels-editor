import { useCallback, useEffect } from "react";
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
  useIntermediateCode,
  useSetGraphEditorOpen,
  useSetIntermediateCode,
} from "@/lib/stores/graph-store";
import { ObjectNodeType } from "@/types";
import AttributeEdge from "./attribute-edge";
import { Attribute, DataModel, Object as ObjectType } from "mdmodels-core";

// Node types
const nodeTypes = {
  objectNode: ObjectNode,
};

// Edge types
const edgeTypes = {
  attributeEdge: AttributeEdge,
};

// Custom edge style
const edgeOptions: DefaultEdgeOptions = {
  type: "attributeEdge",
  style: {
    stroke: "#8B5CF6",
    strokeWidth: 1,
    color: "#8B5CF6",
  },
};

// Add these new functions outside the component
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

export default function DataStandardGraph() {
  const { structure } = useValidatorStore();
  const intermediateCode = useIntermediateCode();
  const setCode = useSetCode();
  const setIntermediateCode = useSetIntermediateCode();

  // Create nodes and edges from the schema data
  const createNodesAndEdges = useCallback(async () => {
    const nodes: ObjectNodeType[] = [];
    const edges: Edge[] = [];
    let yOffset = 0;

    structure?.objects.forEach((obj, objIndex) => {
      nodes.push(createNode(obj, objIndex, yOffset));
      yOffset += 200;
      edges.push(...createEdgesForObject(obj, structure));
    });

    return { nodes: await getLayoutedNodes(nodes, edges), edges };
  }, [structure]);

  const setGraphEditorOpen = useSetGraphEditorOpen();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const initializeGraph = async () => {
      const { nodes: newNodes, edges: newEdges } = await createNodesAndEdges();

      setNodes((prevNodes) => {
        const existingNodesMap = Object.fromEntries(
          prevNodes.map((node) => [node.id, node])
        );

        return newNodes.map((newNode) => {
          const existingNode = existingNodesMap[newNode.id];
          return existingNode
            ? { ...newNode, position: existingNode.position }
            : newNode;
        });
      });

      setEdges(newEdges);
    };

    initializeGraph();
  }, [structure, createNodesAndEdges, setNodes, setEdges]);

  useLayoutNodes();

  const handlePaneClick = () => {
    setGraphEditorOpen(null);

    if (intermediateCode) {
      setCode(intermediateCode);
      setIntermediateCode(null);
    }
  };

  return (
    <div className="w-full h-full bg-[#0D1117] rounded-md overflow-visible">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        defaultEdgeOptions={edgeOptions}
        nodesDraggable={true}
        maxZoom={1.2}
        minZoom={0.1}
      >
        <Background color="#30363D" />
        <Controls className="bg-[#0D1117] border-[#30363D] [&>button]:text-white [&>button]:border-[#30363D]" />
      </ReactFlow>
    </div>
  );
}
