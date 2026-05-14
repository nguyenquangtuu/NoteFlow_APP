
"use client";
import { createContext, useContext } from "react";
import { useNoteFlow, NoteFlowState } from "@/hooks/useNoteFlow";

export const NoteFlowContext = createContext<NoteFlowState | null>(null);

export const useNoteFlowContext = () => {
  const context = useContext(NoteFlowContext);
  if (!context) throw new Error("useNoteFlowContext must be used within NoteFlowProvider");
  return context;
};

export function NoteFlowProvider({ children }: { children: React.ReactNode }) {
  const state = useNoteFlow();
  return <NoteFlowContext.Provider value={state}>{children}</NoteFlowContext.Provider>;
}
