import { linter, Diagnostic } from "@codemirror/lint";
import { validateMdModel } from "./mdutils";
import { EditorView } from "@codemirror/view";

let debounceTimer: NodeJS.Timeout;

const mdModelsLinter = linter((view) => {
  return new Promise((resolve) => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      const code = view.state.doc.toString();
      const validation = validateMdModel(code);
      let diagnostics: Diagnostic[] = [];

      for (const error of validation.errors) {
        for (const position of error.positions) {
          let startLine = view.state.doc.line(position.line);
          let columnStart = position.column.start;
          let columnEnd = position.column.end;

          const typeLine = findTypeLine(view, position.line);

          if (typeLine && error.error_type === "TypeError") {
            startLine = view.state.doc.line(typeLine);
            const trailingWhitespace = getWhiteSpaceOffset(startLine.text);
            columnStart = trailingWhitespace;
            columnEnd = trailingWhitespace + startLine.text.length - 1;
          }

          const startOffset = startLine.from + columnStart - 1;
          const endOffset = startLine.from + columnEnd - 1;
          diagnostics.push({
            from: startOffset,
            to: endOffset,
            severity: "error",
            message: error.message,
          });
        }
      }

      resolve(diagnostics);
    }, 100);
  });
});

function findTypeLine(view: EditorView, line: number) {
  for (let i = line; i < line + 10; i++) {
    try {
      const lineText = view.state.doc.line(i).text;
      if (lineText.toLowerCase().trim().startsWith("- type:")) {
        return i;
      }
    } catch (e) {
      // Line number out of bounds
      break;
    }
  }
  return null;
}

export { mdModelsLinter };

function getWhiteSpaceOffset(content: string) {
  const match = content.match(/^(\s*)-/);
  return match ? match[1].length + 1 : 1;
}
