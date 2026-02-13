import { useEffect, useState } from "react";
import { get, set } from "idb-keyval";
import { useEditorStore } from "@/store/useEditorStore";

const DB_KEY = "cliniko-draft-v1";

export const usePersistentDraft = () => {
  const content = useEditorStore((state) => state.content);
  const setNoteContent = useEditorStore((state) => state.setNoteContent);
  const setLastSaved = useEditorStore((state) => state.setLastSaved);
  const [isRestoring, setIsRestoring] = useState(true);

  // Load from IDB on mount
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const savedContent = await get<string>(DB_KEY);
        if (savedContent) {
          setNoteContent(savedContent);
        }
      } catch (error) {
        console.error("Failed to load draft:", error);
      } finally {
        setIsRestoring(false);
      }
    };
    loadDraft();
  }, [setNoteContent]);

  // Save to IDB whenever content changes
  useEffect(() => {
    if (isRestoring) return; // Don't save if initial load or just restored

    const saveDraft = async () => {
      try {
        await set(DB_KEY, content);
        setLastSaved(new Date());
      } catch (error) {
        console.error("Failed to save draft:", error);
      }
    };

    // Debounce could be added here if updates were frequent,
    // but since we update on Blur/Idle, immediate save is fine.
    saveDraft();
  }, [content, isRestoring, setLastSaved]);

  return { isRestoring };
};
