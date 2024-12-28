import { linter, Diagnostic } from "@codemirror/lint";
import { validateMdModel } from "./mdutils";
import {
  Decoration,
  DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";

/**
 * Timer used for debouncing linting operations
 */
let debounceTimer: NodeJS.Timeout;

/**
 * CodeMirror linter extension for validating markdown models.
 * Provides error diagnostics with positions and messages.
 */
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

/**
 * Finds the line containing a type definition within 3 lines after the given line number
 * @param view The editor view instance
 * @param line The line number to start searching from
 * @returns The line number of the type definition, or null if not found
 */
function findTypeLine(view: EditorView, line: number) {
  for (let i = line; i < line + 3; i++) {
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

/**
 * Gets the whitespace offset at the start of a line containing a list item
 * @param content The line content to analyze
 * @returns The number of whitespace characters before the list item marker, plus 1
 */
function getWhiteSpaceOffset(content: string) {
  const match = content.match(/^(\s*)-/);
  return match ? match[1].length + 1 : 1;
}

const codePatterns = [
  {
    regex: /^[\s]*- [a-zA-Z]+:/gm,
    class: "cm-option-highlight",
  },
  {
    regex: /^[\s]*- [a-zA-Z]+:(.*)$/gm,
    class: "cm-object-content-highlight",
  },
];

/**
 * Creates a CodeMirror ViewPlugin that highlights type definitions in markdown.
 * Type definitions are lines that start with "- " followed by letters and a colon.
 * For example: "- name:" or "- type:"
 *
 * @returns A ViewPlugin that adds highlighting decorations to type definitions
 */
export function highlight() {
  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;

      /**
       * Creates the initial decorations when the plugin is instantiated
       * @param view The editor view instance
       */
      constructor(view: EditorView) {
        this.decorations = this.buildDecorations(view);
      }

      /**
       * Updates decorations when document changes
       * @param update The view update containing changes
       */
      update(update: ViewUpdate) {
        if (update.docChanged)
          this.decorations = this.buildDecorations(update.view);
      }

      /**
       * Builds decoration set by finding and marking type definitions
       * @param view The editor view instance
       * @returns A DecorationSet containing highlights for type definitions
       */
      buildDecorations(view: EditorView) {
        const builder = new RangeSetBuilder<Decoration>();
        const text = view.state.doc.toString();

        // Collect all matches first
        const allMatches: Array<{
          index: number;
          length: number;
          className: string;
        }> = [];

        for (const { regex, class: className } of codePatterns) {
          const matches = Array.from(text.matchAll(regex));
          for (const match of matches) {
            if (match.index !== undefined) {
              allMatches.push({
                index: match.index,
                length: match[0].length,
                className,
              });
            }
          }
        }

        // Sort matches by their starting position
        allMatches.sort((a, b) => a.index - b.index);

        // Add sorted matches to the builder
        for (const match of allMatches) {
          builder.add(
            match.index,
            match.index + match.length,
            Decoration.mark({ class: match.className })
          );
        }

        return builder.finish();
      }
    },
    {
      decorations: (v) => v.decorations,
    }
  );
}
