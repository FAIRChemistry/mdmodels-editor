import React from "react";
import { Edge, Handle, NodeProps, Position } from "reactflow";
import { Pencil } from "lucide-react";
import { CroppedText } from "./cropped-text";
import { createHandleId, isRelatedTo } from "@/lib/graph-utils";
import { createPortal } from "react-dom";
import { Object as ObjectType } from "mdmodels-core";
// @ts-ignore
import { debounce } from "lodash";
import {
  useGraphEditorOpen,
  useHoveredNode,
  useIntermediateCode,
  useSetGraphEditorOpen,
  useSetHoveredNode,
  useSetIntermediateCode,
} from "@/lib/stores/graph-store";
import { useModelObject, useSetCode } from "@/lib/stores/validator-store";
import { useReactFlow } from "reactflow";
import { AttributeEdge } from "@/types";

const EditorTab = React.lazy(() =>
  import("./editor-tab").then((mod) => ({
    default: mod.EditorTab,
  }))
);

export const ObjectNode = React.memo(function ObjectNode({
  data,
  xPos,
  yPos,
}: NodeProps<ObjectType>) {
  const nodeRef = React.useRef<HTMLDivElement>(null);
  const portalRoot = React.useMemo(
    () => document.getElementById("portal-root"),
    []
  );

  const { getNodes, getEdges, setCenter, getViewport } = useReactFlow();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showEditor, setShowEditor] = React.useState(false);
  const [isRelated, setIsRelated] = React.useState(false);
  const setHoveredNode = useSetHoveredNode();
  const hoveredNode = useHoveredNode();
  const setIntermediateCode = useSetIntermediateCode();
  const intermediateCode = useIntermediateCode();
  const setCode = useSetCode();
  const modelObject = useModelObject(data.name);
  const setGraphEditorOpen = useSetGraphEditorOpen();
  const graphEditorOpen = useGraphEditorOpen();
  const nodes = getNodes();
  const [editorPosition, setEditorPosition] = React.useState({
    top: 0,
    left: 0,
  });

  React.useEffect(() => {
    if (!hoveredNode) {
      setIsRelated(true);
      return;
    }
    if (hoveredNode == data.name) {
      setIsRelated(true);
      return;
    }
    if (
      hoveredNode &&
      isRelatedTo(hoveredNode, data.name, getEdges() as Edge<AttributeEdge>[])
    ) {
      setIsRelated(true);
    } else {
      setIsRelated(false);
    }
  }, [hoveredNode, data.name]);

  const updatePosition = React.useMemo(
    () =>
      debounce(() => {
        if (nodeRef.current && showEditor) {
          const viewport = getViewport();
          const rect = nodeRef.current.getBoundingClientRect();
          const portalRect = portalRoot?.getBoundingClientRect();

          if (portalRect) {
            setEditorPosition({
              top: rect.top - portalRect.top,
              left: rect.right - portalRect.left + 20 * viewport.zoom,
            });
          }
        }
      }, 0),
    [showEditor, getViewport, portalRoot]
  );

  React.useEffect(() => {
    const instance = document.getElementsByClassName("react-flow__viewport")[0];
    if (instance) {
      const observer = new MutationObserver(updatePosition);
      observer.observe(instance, {
        attributes: true,
        attributeFilter: ["style"],
      });
      return () => observer.disconnect();
    }
  }, [updatePosition]);

  React.useEffect(() => {
    if (showEditor) {
      updatePosition();
    }
  }, [xPos, yPos, showEditor, updatePosition]);

  const handleOpenEditor = () => {
    if (showEditor) {
      setGraphEditorOpen(null);
      if (intermediateCode) {
        setCode(intermediateCode);
        setIntermediateCode(null);
      }
    } else {
      setGraphEditorOpen(data.name);
    }
    setShowEditor(!showEditor);
  };

  const handleNodeFocus = (nodeName: string) => {
    const node = nodes.find((n: any) => n.data.name === nodeName);
    if (node) {
      setCenter(
        node.position.x + (node.width || 0) / 2,
        node.position.y + (node.height || 0) / 2,
        {
          zoom: 1.5,
          duration: 800,
        }
      );
    }
  };

  React.useEffect(() => {
    if (graphEditorOpen !== data.name) {
      setShowEditor(false);
    }
  }, [graphEditorOpen, data.name]);

  return (
    <div
      ref={nodeRef}
      className={`relative group overflow-visible transition-opacity duration-200 ${
        !isRelated ? "opacity-50" : ""
      }`}
      onMouseEnter={(e) => {
        e.stopPropagation();
        setHoveredNode(data.name);
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        setHoveredNode(null);
      }}
    >
      <Handle
        type="target"
        id={createHandleId(data.name)}
        position={Position.Left}
        isConnectable={false}
        className="!bg-transparent !border-0"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-xl blur-xl transition-all group-hover:blur-2xl" />
      <div className="relative bg-[#0D1117] text-white rounded-xl border border-[#30363D] pt-4 w-72 backdrop-blur-sm">
        <div
          className="absolute -right-2 -top-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full p-0.5 cursor-pointer"
          onClick={handleOpenEditor}
        >
          <div className="bg-[#0D1117] rounded-full p-1">
            <Pencil className="w-4 h-4 text-white scale-90" />
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <h3 className="text-lg z-50 font-bold mx-4 text-white">
              {modelObject?.name}
            </h3>
            <CroppedText
              className="text-gray-400 mx-4 text-xs font-light max-w-lg text-justify hyphens-auto leading-relaxed hover:text-gray-300 transition-colors duration-200"
              text={modelObject?.docstring || ""}
              maxWords={15}
            />
          </div>

          {!isExpanded && (
            <div className="transition-all duration-100">
              {modelObject?.attributes.map((attr: any, index: number) => (
                <Handle
                  key={index}
                  type="source"
                  position={Position.Right}
                  id={createHandleId(data.name, attr.name)}
                  isConnectable={false}
                  className="!bg-transparent !border-0"
                />
              ))}
            </div>
          )}

          {!isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full px-4 py-2 text-xs text-gray-400 hover:text-gray-300 border-t border-gray-800 transition-all duration-100"
            >
              Show {modelObject?.attributes.length} attributes
            </button>
          )}

          {isExpanded && (
            <div className="transition-all duration-200">
              <table className="w-full text-sm">
                <tbody>
                  {modelObject?.attributes.map((attr: any, index: number) => (
                    <tr
                      key={index}
                      className={`text-gray-300 relative border-t border-gray-800`}
                    >
                      <td className="py-[8px] relative mx-4 hover:bg-gray-900">
                        <Handle
                          type="source"
                          position={Position.Right}
                          id={createHandleId(data.name, attr.name)}
                          isConnectable={false}
                          className="!bg-transparent !border-0"
                        />
                        <span className="text-white mx-4">
                          {attr.name}:{" "}
                          <span
                            className={`text-gray-400 ${
                              nodes.some(
                                (n: any) => n.data.name === attr.dtypes[0]
                              )
                                ? "cursor-pointer hover:text-gray-200"
                                : ""
                            }`}
                            onClick={() => handleNodeFocus(attr.dtypes[0])}
                          >
                            {attr.dtypes[0]}
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={() => setIsExpanded(false)}
                className="w-full px-4 py-2 text-xs text-gray-400 hover:text-gray-300 border-t border-gray-800 transition-all duration-100"
              >
                Show less
              </button>
            </div>
          )}
        </div>
      </div>

      {showEditor &&
        portalRoot &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: `${editorPosition.top}px`,
              left: `${editorPosition.left}px`,
              transform: `scale(${Math.sqrt(getViewport().zoom)})`,
              transformOrigin: "top left",
            }}
            className="nodrag nowheel shadow-xl w-[500px] h-[300px] bg-[#0D1117] 
                     border border-[#30363D] rounded-xl overflow-hidden
                     [&_*]:!cursor-text [&_.cm-editor]:rounded-xl [&_.cm-scroller]:!overflow-auto"
          >
            <React.Suspense fallback={<div>Loading...</div>}>
              <EditorTab
                className="text-xs"
                height="300px"
                jumpToLine={data.position?.line || 1}
                setCodeAlt={setIntermediateCode}
              />
            </React.Suspense>
          </div>,
          portalRoot
        )}
    </div>
  );
});
