
"use client";
import { NoteFlowProvider } from "./NoteFlow/NoteFlowProvider";
import { NoteFlowLayout } from "./NoteFlow/NoteFlowLayout";

export function NoteFlowApp() {
  return (
    <NoteFlowProvider>
      <NoteFlowLayout />
    </NoteFlowProvider>
  );
}
