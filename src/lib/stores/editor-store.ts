import { EditorView } from "@codemirror/view";
import { EditorSelection } from "@uiw/react-codemirror";
import { MutableRefObject } from "react";
import { create } from "zustand";

interface EditorStore {
  currentLine: number;
  fontSize: number;
  setCurrentLine: (line: number) => void;
  setFontSize: (size: number) => void;
  editorRef: MutableRefObject<EditorView | null>;
  jumpToLine: (line: number) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  currentLine: 0,
  fontSize: 12,
  setCurrentLine: (line) => set({ currentLine: line }),
  setFontSize: (size) => set({ fontSize: size }),
  editorRef: { current: null },
  jumpToLine: (line) => {
    const editorRef = useEditorStore.getState().editorRef;
    if (editorRef.current) {
      // @ts-ignore
      const view: EditorView = editorRef.current.view;
      const lineObject = view.state.doc.line(line);
      view.dispatch({
        selection: EditorSelection.single(lineObject.from, lineObject.from),
        effects: EditorView.scrollIntoView(lineObject.from, {
          y: "start",
        }),
      });
    }
  },
}));
