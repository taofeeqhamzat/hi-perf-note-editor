"use client";

import { useEffect, useRef } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { usePersistentDraft } from "@/hooks/usePersistentDraft";
import { Cloud, Check } from "lucide-react";

export const Editor = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const setNoteContent = useEditorStore((state) => state.setNoteContent);
  const content = useEditorStore((state) => state.content);
  const isSaving = useEditorStore((state) => state.isSaving);
  const setIsSaving = useEditorStore((state) => state.setIsSaving);

  const { isRestoring } = usePersistentDraft();
  const lastSaved = useEditorStore((state) => state.lastSaved);

  // Initial sync from store to ref (only on mount or external updates)
  useEffect(() => {
    if (textareaRef.current && textareaRef.current.value !== content) {
      textareaRef.current.value = content;
    }
  }, [content]);

  const handleBlur = () => {
    if (textareaRef.current) {
      setNoteContent(textareaRef.current.value);
    }
  };

  const handleManualSave = async () => {
    if (isSaving) return;
    setIsSaving(true);

    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsSaving(false);
    // In a real app, we'd sync to server here.
    // IDB sync happens automatically via the hook.
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs text-gray-400 font-mono">
          {isRestoring
            ? "RESTORING..."
            : lastSaved
              ? `SAVED LOCALLY ${lastSaved.toLocaleTimeString()}`
              : "READY"}
        </span>
        <button
          onClick={handleManualSave}
          disabled={isSaving}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
            ${
              isSaving
                ? "bg-green-100 text-green-700 cursor-default"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm active:transform active:scale-95"
            }`}
        >
          {isSaving ? (
            <>
              <Check size={16} />
              Saved
            </>
          ) : (
            <>
              <Cloud size={16} />
              Save to Cloud
            </>
          )}
        </button>
      </div>
      <textarea
        ref={textareaRef}
        className="w-full h-[calc(100vh-200px)] p-6 text-lg text-gray-800 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none font-sans leading-relaxed transition-shadow"
        placeholder="Start typing your treatment note..."
        defaultValue={content}
        onBlur={handleBlur}
        aria-label="Treatment Note Editor"
      />
    </div>
  );
};
