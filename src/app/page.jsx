"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NavBar } from "@/src/components";

const BRAND = "#5f5fff";
const BRAND_GLOW = "rgba(95, 95, 255, 0.08)";
const BORDER = "var(--border-subtle)";
const TEXT_MUTED = "var(--text-muted)";

export default function Landing() {
  const router = useRouter();

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    if (cookies.find((c) => c.startsWith("AuthToken="))) {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <NavBar />

      {/* ── Hero ── */}
      <header
        style={{
          padding: "80px 32px 100px",
          maxWidth: "1100px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <span
          style={{
            display: "inline-block",
            marginBottom: "24px",
            padding: "6px 16px",
            border: `1px solid ${BRAND}66`,
            color: BRAND,
            fontSize: "11px",
            fontFamily: "monospace",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            borderRadius: "4px",
          }}
        >
          v2.0 — Now in public beta
        </span>

        <h1
          style={{
            fontSize: "clamp(48px, 10vw, 96px)",
            fontWeight: 900,
            marginBottom: "24px",
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
          }}
        >
          CODE IN{" "}
          <span style={{ color: BRAND }}>UNISON</span>
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: TEXT_MUTED,
            maxWidth: "600px",
            margin: "0 auto 40px",
            lineHeight: 1.6,
          }}
        >
          The collaborative engine for technical interviews, pair programming,
          and engineering education. Real-time, zero latency.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            marginBottom: "64px",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/editor"
            style={{
              padding: "14px 32px",
              background: BRAND,
              color: "#fff",
              fontWeight: 700,
              fontSize: "14px",
              borderRadius: "6px",
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              transition: "box-shadow 0.2s",
            }}
          >
            Launch Editor
          </Link>
          <Link
            href="/dashboard"
            style={{
              padding: "14px 32px",
              border: `1px solid ${BORDER}`,
              color: "var(--text-primary)",
              fontWeight: 700,
              fontSize: "14px",
              borderRadius: "6px",
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              transition: "background 0.2s",
            }}
          >
            Open Dashboard
          </Link>
        </div>

        {/* ── Editor mock ── */}
        <div
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            border: `1px solid ${BORDER}`,
            boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
            background: "var(--bg-secondary)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 16px",
              borderBottom: `1px solid ${BORDER}`,
              background: "var(--bg-tertiary)",
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
            <span style={{ marginLeft: "16px", fontSize: "12px", color: TEXT_MUTED, fontFamily: "monospace" }}>
              project_delta.py
            </span>
          </div>
          <div
            style={{
              padding: "24px",
              fontFamily: "monospace",
              fontSize: "13px",
              lineHeight: 1.8,
              color: "var(--text-primary)",
              textAlign: "left",
              minHeight: "260px",
            }}
          >
            <span style={{ color: "#a626a4" }}>import</span>{" "}
            <span style={{ color: "#c18401" }}>asyncio</span>
            <br />
            <span style={{ color: "#a626a4" }}>from</span>{" "}
            <span style={{ color: "#c18401" }}>collab</span>{" "}
            <span style={{ color: "#a626a4" }}>import</span>{" "}
            <span style={{ color: "#4078f2" }}>Session</span>
            <br />
            <br />
            <span style={{ color: "#4078f2" }}>session</span>{" "}
            <span style={{ color: "#383a42" }}>=</span>{" "}
            <span style={{ color: "#4078f2" }}>await</span>{" "}
            <span style={{ color: "#0184bc" }}>Session</span>(
            <span style={{ color: "#50a14f" }}>&quot;delta&quot;</span>)
            <br />
            <span style={{ color: "#4078f2" }}>await</span>{" "}
            <span style={{ color: "#0184bc" }}>session</span>.
            <span style={{ color: "#4078f2" }}>sync</span>()
            <br />
            <br />
            <span style={{ color: "#a0a1a7" }}># 3 collaborators connected</span>
          </div>
          <div
            style={{
              padding: "12px 16px",
              borderTop: `1px solid ${BORDER}`,
              background: "var(--bg-tertiary)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex" }}>
              {["#5f5fff", "#ffbd2e", "#28c840"].map((c, i) => (
                <div
                  key={i}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: `${c}1a`,
                    border: `2px solid ${c}`,
                    marginLeft: i === 0 ? 0 : -8,
                  }}
                />
              ))}
            </div>
            <span
              style={{
                fontSize: "11px",
                color: TEXT_MUTED,
                fontFamily: "monospace",
              }}
            >
              3 users editing project_delta.py
            </span>
          </div>
        </div>
      </header>

      {/* ── Features ── */}
      <section
        style={{
          padding: "80px 32px",
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "11px",
              fontFamily: "monospace",
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              color: TEXT_MUTED,
              marginBottom: "48px",
            }}
          >
            {'// Built for engineering teams'}
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              border: `1px solid ${BORDER}`,
              gap: 0,
            }}
          >
            {[
              {
                title: "Zero-latency sync",
                desc: "CRDT-backed editing keeps every keystroke in lockstep across continents.",
                num: "01",
              },
              {
                title: "Live execution",
                desc: "Run 40+ languages in isolated containers — no setup, no sandbox surprises.",
                num: "02",
              },
              {
                title: "Interview-grade",
                desc: "Persistent projects with real-time sync for seamless team collaboration.",
                num: "03",
              },
            ].map((f) => (
              <div
                key={f.num}
                style={{
                  padding: "40px",
                  borderRight: `1px solid ${BORDER}`,
                  borderBottom: `1px solid ${BORDER}`,
                  background: "var(--bg-secondary)",
                  transition: "background 0.2s",
                }}
              >
                <div
                  style={{
                    color: BRAND,
                    fontFamily: "monospace",
                    fontSize: "12px",
                    marginBottom: "24px",
                  }}
                >
                  {f.num}
                </div>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "-0.02em",
                    marginBottom: "12px",
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ fontSize: "14px", color: TEXT_MUTED, lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          padding: "100px 32px",
          textAlign: "center",
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(32px, 6vw, 48px)",
            fontWeight: 900,
            marginBottom: "24px",
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
          }}
        >
          Start coding together{" "}
          <span style={{ color: "#e3a008" }}>in seconds.</span>
        </h2>
        <p
          style={{
            color: TEXT_MUTED,
            marginBottom: "40px",
            fontSize: "16px",
          }}
        >
          No installs. No accounts for guests. Just share a link.
        </p>
        <Link
          href="/editor"
          style={{
            display: "inline-block",
            padding: "16px 40px",
            background: BRAND,
            color: "#fff",
            fontWeight: 700,
            fontSize: "14px",
            borderRadius: "6px",
            textDecoration: "none",
            textTransform: "uppercase",
            transition: "box-shadow 0.2s",
          }}
        >
          Create a Room
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          padding: "24px 32px",
          borderTop: `1px solid ${BORDER}`,
          textAlign: "center",
          fontSize: "12px",
          color: TEXT_MUTED,
          fontFamily: "monospace",
        }}
      >
        &copy; {new Date().getFullYear()} CodeLab — Collaborative real-time code editor
      </footer>
    </div>
  );
}
