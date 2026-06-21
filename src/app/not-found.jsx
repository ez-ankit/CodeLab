import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "100px 20px", background: "var(--bg-primary)", minHeight: "100vh", color: "var(--text-primary)" }}>
      <h1 style={{ fontSize: "72px", color: "var(--brand)" }}>404</h1>
      <h2 style={{ color: "var(--text-primary)" }}>Page Not Found</h2>
      <p style={{ color: "var(--text-muted)", margin: "20px 0" }}>
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        style={{
          display: "inline-block",
          padding: "12px 24px",
          background: "var(--brand)",
          color: "white",
          borderRadius: "50px",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        Go Home
      </Link>
    </div>
  );
}
