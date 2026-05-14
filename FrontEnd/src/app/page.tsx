import { Suspense } from "react";
import { NoteFlowApp } from "@/components/note-flow-app";

export default function Home() {
  return (
    <Suspense fallback={<main style={{ padding: "2rem" }}>Dang tai...</main>}>
      <NoteFlowApp />
    </Suspense>
  );
}
