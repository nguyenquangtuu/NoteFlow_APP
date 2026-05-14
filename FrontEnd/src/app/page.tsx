<<<<<<< HEAD
import { Suspense } from "react";
import { NoteFlowApp } from "@/components/note-flow-app";

export default function Home() {
  return (
    <Suspense fallback={<main style={{ padding: "2rem" }}>Dang tai...</main>}>
      <NoteFlowApp />
    </Suspense>
  );
=======
import { NoteFlowApp } from "@/components/note-flow-app";

export default function Home() {
  return <NoteFlowApp />;
>>>>>>> 1160cfc5b3b8e7daa8e94f09efa120a52df02739
}
