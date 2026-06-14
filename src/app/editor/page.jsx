"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidV4 } from "uuid";

export default function EditorRedirect() {
  const router = useRouter();
  const roomId = uuidV4();

  useEffect(() => {
    router.replace(`/editor/${roomId}`);
  }, []);

  return null;
}
