import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "100px 20px" }}>
      <h1 style={{ fontSize: "72px", color: "#7367f0" }}>404</h1>
      <h2>Page Not Found</h2>
      <p style={{ color: "gray", margin: "20px 0" }}>
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        style={{
          display: "inline-block",
          padding: "12px 24px",
          background: "#7367f0",
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
