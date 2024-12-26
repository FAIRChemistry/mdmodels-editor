import { useCallback, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  ConnectionLineType,
  Background,
  useNodesState,
  useEdgesState,
  Controls,
  DefaultEdgeOptions,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { useSetCode, useValidatorStore } from "@/lib/stores/validator-store";
import { createHandleId } from "@/lib/graph-utils";
import useLayoutNodes from "@/hooks/use-layouted-nodes";
import { ObjectNode } from "./object-node";
import {
  useIntermediateCode,
  useSetGraphEditorOpen,
  useSetIntermediateCode,
} from "@/lib/stores/graph-store";
import { MDModelSchema, SchemaAttribute, SchemaObject } from "@/types";
import AttributeEdge from "./attribute-edge";

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
const createNode = (obj: any, objIndex: number, yOffset: number): Node => ({
  id: obj.name,
  type: "objectNode",
  position: { x: objIndex * 400, y: yOffset },
  data: obj,
});

const createEdgesForObject = (
  obj: SchemaObject,
  structure: MDModelSchema
): Edge[] => {
  const edges: Edge[] = [];

  obj.attributes.forEach((attr: SchemaAttribute) => {
    if (
      attr.dtypes.some((dtype: string) =>
        structure?.objects.some((o: SchemaObject) => o.name === dtype)
      )
    ) {
      attr.dtypes.forEach((dtype: string) => {
        if (structure?.objects.some((o: SchemaObject) => o.name === dtype)) {
          edges.push({
            id: `${obj.name}-${attr.name}-${dtype}`,
            source: obj.name,
            sourceHandle: createHandleId(obj.name, attr.name),
            targetHandle: createHandleId(dtype),
            target: dtype,
            animated: true,
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
  const { setCenter } = useReactFlow();

  // Create nodes and edges from the schema data
  const createNodesAndEdges = useCallback(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let yOffset = 0;

    structure?.objects.forEach((obj, objIndex) => {
      nodes.push(createNode(obj, objIndex, yOffset));
      yOffset += 200;
      edges.push(...createEdgesForObject(obj, structure));
    });

    return { nodes, edges };
  }, [structure]);

  const setGraphEditorOpen = useSetGraphEditorOpen();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = createNodesAndEdges();

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

    // Center on first node if nodes exist
    if (newNodes.length > 0) {
      const firstNode = newNodes[0];
      setCenter(firstNode.position.x, firstNode.position.y, {
        zoom: 1,
        duration: 800,
      });
    }
  }, [structure, createNodesAndEdges, setNodes, setEdges, setCenter]);

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
        fitView
      >
        <Background color="#30363D" />
        <Controls className="bg-[#0D1117] border-[#30363D] [&>button]:text-white [&>button]:border-[#30363D]" />
      </ReactFlow>
    </div>
  );
}
