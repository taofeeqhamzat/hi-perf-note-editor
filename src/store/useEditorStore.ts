import { create } from "zustand";

interface EditorState {
  content: string;
  isSaving: boolean;
  lastSaved: Date | null;
  setNoteContent: (content: string) => void;
  setIsSaving: (isSaving: boolean) => void;
  setLastSaved: (date: Date) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  content: "",
  isSaving: false,
  lastSaved: null,
  setNoteContent: (content) => set({ content }),
  setIsSaving: (isSaving) => set({ isSaving }),
  setLastSaved: (date) => set({ lastSaved: date }),
}));
