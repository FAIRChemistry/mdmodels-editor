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
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { useValidatorStore } from "@/lib/stores/validator-store";
import { createHandleId } from "@/lib/graph-utils";
import useLayoutNodes from "@/hooks/use-layouted-nodes";
import { ObjectNode } from "./object-node";
import { useSetGraphEditorOpen } from "@/lib/stores/graph-store";
import { MDModelSchema, SchemaAttribute, SchemaObject } from "@/types";

// Node types
const nodeTypes = {
  objectNode: ObjectNode,
};

// Custom edge style
const edgeOptions: DefaultEdgeOptions = {
  style: {
    stroke: "#8B5CF6",
    strokeWidth: 1,
    color: "#8B5CF6",
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
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
    setNodes(newNodes);
    setEdges(newEdges);
  }, [structure, createNodesAndEdges, setNodes, setEdges]);

  useLayoutNodes();

  const handlePaneClick = () => {
    setGraphEditorOpen(null);
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
        connectionLineType={ConnectionLineType.SmoothStep}
        defaultEdgeOptions={edgeOptions}
        nodesDraggable={true}
        maxZoom={1.0}
      >
        <Background color="#30363D" />
        <Controls className="bg-[#0D1117] border-[#30363D] [&>button]:text-white [&>button]:border-[#30363D]" />
      </ReactFlow>
    </div>
  );
}
