import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { Editor } from "./Editor";
import { useEditorStore } from "@/store/useEditorStore";
import * as idb from "idb-keyval";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock idb-keyval
vi.mock("idb-keyval", () => ({
  get: vi.fn(),
  set: vi.fn(),
}));

// Mock Lucide icons to avoid render issues (optional but good for unrelated focusing)
vi.mock("lucide-react", () => ({
  Cloud: () => <span data-testid="cloud-icon" />,
  Check: () => <span data-testid="check-icon" />,
}));

describe("Cliniko Editor Performance & Resilience", () => {
  beforeEach(() => {
    // Reset store
    act(() => {
      useEditorStore.setState({
        content: "",
        isSaving: false,
        lastSaved: null,
      });
    });
    vi.clearAllMocks();
  });

  it("Restores draft from IndexedDB on mount", async () => {
    (idb.get as any).mockResolvedValueOnce("Recovered Note Content");

    render(<Editor />);

    // Verify loading state
    expect(screen.getByText(/restoring/i)).toBeInTheDocument();

    // Wait for content to appear in textarea
    await waitFor(() => {
      expect(
        screen.getByRole("textbox", { name: /treatment note editor/i }),
      ).toHaveValue("Recovered Note Content");
    });

    // Verify sync to store
    expect(useEditorStore.getState().content).toBe("Recovered Note Content");
  });

  it("Does NOT update global store (re-render expensive tree) while typing", async () => {
    render(<Editor />);

    // Wait for initial restore to finish to avoid act warning
    await waitFor(() =>
      expect(screen.queryByText(/restoring/i)).not.toBeInTheDocument(),
    );

    const textarea = screen.getByRole("textbox", {
      name: /treatment note editor/i,
    });

    // Type "Hello"
    fireEvent.change(textarea, { target: { value: "Hello" } });

    // Store should STILL be empty string (uncontrolled buffer)
    expect(useEditorStore.getState().content).toBe("");
  });

  it("Syncs to store only on blur", async () => {
    render(<Editor />);
    const textarea = screen.getByRole("textbox", {
      name: /treatment note editor/i,
    });

    fireEvent.change(textarea, { target: { value: "Final Content" } });
    fireEvent.blur(textarea);

    expect(useEditorStore.getState().content).toBe("Final Content");

    // Wait for side effect (save to IDB) to complete to avoid act warning
    await waitFor(() => {
      expect(idb.set).toHaveBeenCalled();
    });
  });

  it("Persists to IndexedDB when content updates (after blur)", async () => {
    render(<Editor />);
    const textarea = screen.getByRole("textbox", {
      name: /treatment note editor/i,
    });

    fireEvent.change(textarea, { target: { value: "Important Data" } });
    fireEvent.blur(textarea);

    // Wait for the effect in hook to run
    await waitFor(() => {
      expect(idb.set).toHaveBeenCalledWith(
        "cliniko-draft-v1",
        "Important Data",
      );
    });
  });

  it("Handles manual save with optimistic UI", async () => {
    render(<Editor />);

    // Set some content
    act(() => {
      useEditorStore.setState({ content: "Test Save" });
    });

    const saveButton = screen.getByText(/save to cloud/i);

    // Click save
    fireEvent.click(saveButton);

    // Should show "Saved" and disable button
    await waitFor(() => {
      expect(screen.getByText(/saved/i)).toBeInTheDocument();
    });
    expect(screen.getByRole("button")).toBeDisabled();

    // Store should indicate saving
    expect(useEditorStore.getState().isSaving).toBe(true);

    // After delay, should revert (simulated in test by waiting or advancing timers)
    // Here we'll just check the immediate optimistic update
  });
});
