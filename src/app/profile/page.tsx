"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

import { NavBar } from "@/src/components";

interface ProfileData {
  username: string;
  email: string;
  userId: string;
  joinedAt?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const username = cookies.find((c) => c.startsWith("username="))?.split("=")[1];
    const email = cookies.find((c) => c.startsWith("email="))?.split("=")[1];
    const userId = cookies.find((c) => c.startsWith("userId="))?.split("=")[1];

    if (!username) {
      router.push("/login");
      return;
    }

    setProfile({
      username: decodeURIComponent(username),
      email: decodeURIComponent(email || ""),
      userId: userId || "",
    });

    axios.get("/api/projects").then((res) => {
      if (res.data.success) {
        setProjectCount(res.data.data.length);
      }
    }).finally(() => setLoading(false));
  }, [router]);

  if (loading || !profile) {
    return (
      <>
        <NavBar />
        <div style={styles.loader}>
          <div style={styles.spinner} />
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.avatarLarge}>
            {profile.username.charAt(0).toUpperCase()}
          </div>
          <h1 style={styles.name}>{profile.username}</h1>
          <p style={styles.email}>{profile.email}</p>

          <div style={styles.stats}>
            <div style={styles.stat}>
              <span style={styles.statValue}>{projectCount}</span>
              <span style={styles.statLabel}>Projects</span>
            </div>
          </div>

          <div style={styles.actions}>
            <Link href="/dashboard" style={styles.actionBtn}>
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: "100px 24px 32px",
    maxWidth: "600px",
    margin: "0 auto",
    minHeight: "100vh",
    background: "var(--bg-primary)",
    display: "flex",
    justifyContent: "center",
  },
  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  spinner: {
    width: "32px",
    height: "32px",
    border: "3px solid #e5e7eb",
    borderTopColor: "var(--brand)",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  card: {
    background: "var(--bg-secondary)",
    borderRadius: "16px",
    border: "1px solid var(--border-color)",
    padding: "40px 32px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  avatarLarge: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "var(--brand)",
    color: "#fff",
    fontSize: "32px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
  },
  name: {
    fontSize: "24px",
    fontWeight: 700,
    color: "var(--text-primary)",
    margin: 0,
  },
  email: {
    fontSize: "14px",
    color: "var(--text-muted)",
    margin: "4px 0 24px",
  },
  stats: {
    display: "flex",
    gap: "32px",
    marginBottom: "28px",
  },
  stat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  statLabel: {
    fontSize: "13px",
    color: "var(--text-muted)",
  },
  actions: {
    display: "flex",
    gap: "12px",
  },
  actionBtn: {
    display: "inline-flex",
    padding: "10px 24px",
    background: "var(--brand)",
    color: "#fff",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    textDecoration: "none",
  },
};
