"use client";

import { useState } from "react";

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: {
    title: string;
    description: string;
    programmingLanguage: string;
    visibility: "public" | "private";
  }) => void;
}

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "html",
  "css",
  "json",
];

export default function CreateProjectDialog({
  open,
  onClose,
  onCreate,
}: CreateProjectDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [visibility, setVisibility] = useState<"public" | "private">("private");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title: title.trim(), description: description.trim(), programmingLanguage: language, visibility });
    setTitle("");
    setDescription("");
    setLanguage("javascript");
    setVisibility("private");
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.heading}>Create New Project</h2>
          <button style={styles.closeBtn} onClick={onClose}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Project Title *</label>
            <input
              style={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Awesome Project"
              required
              autoFocus
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea
              style={{ ...styles.input, minHeight: "60px", resize: "vertical" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description..."
            />
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Language</label>
              <select
                style={styles.input}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l.charAt(0).toUpperCase() + l.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Visibility</label>
              <select
                style={styles.input}
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as "public" | "private")}
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </div>
          </div>

          <div style={styles.footer}>
            <button type="button" style={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn}>
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  dialog: {
    background: "var(--bg-secondary)",
    borderRadius: "12px",
    width: "480px",
    maxWidth: "90vw",
    padding: "24px",
    boxShadow: "var(--shadow-md)",
    border: "1px solid var(--border-color)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  heading: {
    fontSize: "18px",
    fontWeight: 600,
    color: "var(--text-primary)",
    margin: 0,
  },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "var(--text-muted)",
    padding: "4px",
    borderRadius: "4px",
  },
  field: {
    marginBottom: "16px",
    flex: 1,
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 500,
    color: "var(--text-secondary)",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "8px 12px",
    fontSize: "14px",
    border: "1px solid var(--border-color)",
    borderRadius: "6px",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    background: "var(--bg-input)",
    color: "var(--text-primary)",
  },
  row: {
    display: "flex",
    gap: "12px",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    marginTop: "8px",
  },
  cancelBtn: {
    padding: "8px 16px",
    fontSize: "14px",
    background: "var(--bg-tertiary)",
    border: "1px solid var(--border-color)",
    borderRadius: "6px",
    cursor: "pointer",
    color: "var(--text-secondary)",
  },
  submitBtn: {
    padding: "8px 20px",
    fontSize: "14px",
    background: "var(--brand)",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 500,
  },
};
