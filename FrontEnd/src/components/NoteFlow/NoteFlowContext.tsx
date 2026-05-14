import { createContext, useContext } from "react";

export const NoteFlowContext = createContext<any>(null);

export function useNoteFlow() {
  const context = useContext(NoteFlowContext);
  if (!context) {
    throw new Error("useNoteFlow must be used within a NoteFlowProvider");
  }
  return context;
}
