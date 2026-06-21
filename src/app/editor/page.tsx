"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ADJECTIVES = [
  "cool", "fast", "bright", "quiet", "swift", "bold", "calm",
  "eager", "fierce", "gentle", "happy", "keen", "lively", "mighty",
  "neat", "proud", "quick", "rare", "sharp", "tough", "vivid",
  "warm", "zesty", "agile", "brave", "crisp",
];
const NOUNS = [
  "alpha", "beta", "delta", "echo", "falcon", "gamma", "hawk",
  "jade", "kappa", "lion", "nova", "omega", "pixel", "quantum",
  "raven", "sigma", "tiger", "ultra", "vertex", "wave", "zeta",
  "blitz", "cipher", "drift", "ember", "frost",
];

function randomName(): string {
  const a = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const n = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${a}-${n}`;
}

export default function EditorNew() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: randomName() }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          router.replace(`/editor/${data.data._id}`);
        }
      })
      .catch(() => {
        router.replace("/dashboard");
      });
  }, [router]);

  return null;
}
