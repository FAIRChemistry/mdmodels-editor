import { create } from "zustand";

interface EditorStore {
  currentLine: number;
  setCurrentLine: (line: number) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  currentLine: 0,
  setCurrentLine: (line) => set({ currentLine: line }),
}));
