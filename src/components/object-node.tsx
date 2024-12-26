import { SchemaObject } from "@/types";

import { Handle, NodeProps, Position } from "reactflow";
import { Pencil } from "lucide-react";
import { CroppedText } from "./cropped-text";
import { createHandleId } from "@/lib/graph-utils";
import React from "react";
import {
  useGraphEditorOpen,
  useSetGraphEditorOpen,
  useSetHoveredNode,
} from "@/lib/stores/graph-store";
import { useModelObject } from "@/lib/stores/validator-store";

const EditorTab = React.lazy(() =>
  import("./editor-tab").then((mod) => ({
    default: mod.EditorTab,
  }))
);

export function ObjectNode({ data }: NodeProps<SchemaObject>) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showEditor, setShowEditor] = React.useState(false);

  const setHoveredNode = useSetHoveredNode();

  // Fetch the model object from the store to catch changes
  const modelObject = useModelObject(data.name);

  const setGraphEditorOpen = useSetGraphEditorOpen();
  const graphEditorOpen = useGraphEditorOpen();

  const editorContainerRef = React.useRef<HTMLDivElement>(null);

  const handleMouseDown = React.useCallback((e: MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleOpenEditor = () => {
    if (showEditor) {
      setGraphEditorOpen(null);
    } else {
      setGraphEditorOpen(data.name);
    }
    setShowEditor(!showEditor);
  };

  React.useEffect(() => {
    if (graphEditorOpen !== data.name) {
      setShowEditor(false);
    }
  }, [graphEditorOpen, handleMouseDown]);

  return (
    <div
      className="relative group overflow-visible"
      onMouseEnter={() => setHoveredNode(data.name)}
      onMouseLeave={() => setHoveredNode(null)}
    >
      <Handle
        type="target"
        id={createHandleId(data.name)}
        position={Position.Left}
        isConnectable={false}
        className="!bg-transparent !border-0"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-xl blur-xl transition-all group-hover:blur-2xl" />
      <div className="relative bg-[#0D1117] text-white rounded-xl border border-[#30363D] pt-4 w-64 backdrop-blur-sm">
        <div
          className="absolute -right-2 -top-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full p-0.5 cursor-pointer"
          onClick={handleOpenEditor}
        >
          <div className="bg-[#0D1117] rounded-full p-1">
            <Pencil className="w-4 h-4 text-white scale-90" />
          </div>
        </div>

        {showEditor && (
          <div
            ref={editorContainerRef}
            className="nodrag nowheel absolute -right-[520px] top-0 shadow-xl
             w-[500px] h-[300px] bg-[#0D1117] 
             border border-[#30363D] rounded-xl overflow-hidden
             [&_*]:!cursor-text [&_.cm-editor]:rounded-xl [&_.cm-scroller]:!overflow-auto"
          >
            <React.Suspense fallback={<div>Loading...</div>}>
              <EditorTab
                className="text-xs"
                height="300px"
                jumpToLine={data.position?.line || 1}
              />
            </React.Suspense>
          </div>
        )}

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
            <div>
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
              className="w-full px-4 py-2 text-xs text-gray-400 hover:text-gray-300 border-t border-gray-800"
            >
              Show {modelObject?.attributes.length} attributes
            </button>
          )}

          {isExpanded && (
            <>
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
                          <span className="text-gray-400">
                            {attr.dtypes.join(", ")}
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={() => setIsExpanded(false)}
                className="w-full px-4 py-2 text-xs text-gray-400 hover:text-gray-300 border-t border-gray-800"
              >
                Show less
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
