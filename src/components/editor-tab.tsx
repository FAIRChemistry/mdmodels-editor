import CodeMirror, { EditorSelection, EditorView } from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { githubDark } from "@uiw/codemirror-theme-github";
import { lintGutter } from "@codemirror/lint";
import { mdModelsLinter } from "@/lib/lint";
import { memo, useRef, useCallback } from "react";
import { useCode, useValidatorStore } from "@/lib/stores/validator-store";

export const editorExtensions = [
  markdown(),
  mdModelsLinter,
  EditorView.lineWrapping,
  EditorView.theme({
    ".cm-gutters": {
      backgroundColor: "#0D1117",
    },
    ".cm-lineNumbers": {
      color: "#484F58",
    },
  }),
  lintGutter(),
];

const editorExtensionsWithoutGutter = editorExtensions.slice(0, 4);

interface EditorTabProps {
  height?: string;
  width?: string;
  className?: string;
  jumpToLine?: number;
  useLineGutter?: boolean;
}

export const EditorTab = memo(function EditorTab({
  height = "100%",
  width = "100%",
  className,
  jumpToLine,
  useLineGutter = true,
}: EditorTabProps) {
  const code = useCode();
  const setCode = useValidatorStore((state) => state.setCode);
  const editorRef = useRef<EditorView | null>(null);

  const handleChange = useCallback(
    (value: string) => {
      setCode(value);
    },
    [setCode]
  );

  const handleEditorCreate = useCallback(
    (view: EditorView) => {
      if (jumpToLine !== undefined) {
        const line = view.state.doc.line(jumpToLine);
        view.dispatch({
          selection: EditorSelection.single(line.from, line.from),
          effects: EditorView.scrollIntoView(line.from, { y: "start" }),
        });
      }
    },
    [jumpToLine]
  );

  return (
    <CodeMirror
      ref={editorRef}
      value={code}
      height={height}
      width={width}
      theme={githubDark}
      extensions={
        useLineGutter ? editorExtensions : editorExtensionsWithoutGutter
      }
      onChange={handleChange}
      className={className}
      onCreateEditor={handleEditorCreate}
      basicSetup={{
        lineNumbers: useLineGutter,
        foldGutter: false,
        dropCursor: false,
        allowMultipleSelections: false,
        indentOnInput: false,
      }}
    />
  );
});
