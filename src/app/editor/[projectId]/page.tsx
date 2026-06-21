"use client";

import dynamic from "next/dynamic";

const EditorLayout = dynamic(
  () => import("@/src/components/Editor/Editor"),
  { ssr: false }
);

export default function EditorPage({ params }: { params: { projectId: string } }) {
  return <EditorLayout projectId={params.projectId} />;
}
