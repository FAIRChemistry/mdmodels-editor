import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { githubDark } from "@uiw/codemirror-theme-github";
import { lintGutter } from "@codemirror/lint";
import { mdModelsLinter } from "@/lib/lint";

interface EditorTabProps {
  code: string;
  onChange: (value: string) => void;
}

export function EditorTab({ code, onChange }: EditorTabProps) {
  return (
    <CodeMirror
      value={code}
      height="600px"
      theme={githubDark}
      extensions={[
        markdown(),
        lintGutter(),
        mdModelsLinter,
        EditorView.lineWrapping,
      ]}
      onChange={onChange}
      className="text-md"
    />
  );
}
