"use client";

import { useState, useRef, useEffect } from "react";

interface ProjectActionsProps {
  projectId: string;
  projectTitle: string;
  onRename: (id: string, title: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export default function ProjectActions({
  projectId,
  projectTitle,
  onRename,
  onArchive,
  onDelete,
  onDuplicate,
}: ProjectActionsProps) {
  const [open, setOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(projectTitle);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setRenaming(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleRename = () => {
    if (renaming && newTitle.trim()) {
      onRename(projectId, newTitle.trim());
      setRenaming(false);
      setOpen(false);
    } else {
      setNewTitle(projectTitle);
      setRenaming(true);
    }
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        style={styles.trigger}
        title="More actions"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>

      {open && (
        <div style={styles.menu} onClick={(e) => e.stopPropagation()}>
          {renaming ? (
            <div style={styles.renameBox}>
              <input
                style={styles.renameInput}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename();
                  if (e.key === "Escape") setRenaming(false);
                }}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
              <button style={styles.renameBtn} onClick={handleRename}>
                Save
              </button>
            </div>
          ) : (
            <>
              <button style={styles.item} onClick={handleRename}>
                Rename
              </button>
              <button
                style={styles.item}
                onClick={() => {
                  onDuplicate(projectId);
                  setOpen(false);
                }}
              >
                Duplicate
              </button>
              <button
                style={styles.item}
                onClick={() => {
                  onArchive(projectId);
                  setOpen(false);
                }}
              >
                Archive
              </button>
              <div style={styles.divider} />
              <button
                style={{ ...styles.item, color: "#ef4444" }}
                onClick={() => {
                  onDelete(projectId);
                  setOpen(false);
                }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  trigger: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "4px",
    color: "var(--text-muted)",
    display: "flex",
    alignItems: "center",
  },
  menu: {
    position: "absolute",
    right: 0,
    top: "100%",
    background: "var(--bg-elevated)",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    boxShadow: "var(--shadow-md)",
    minWidth: "160px",
    zIndex: 50,
    padding: "4px",
  },
  item: {
    display: "block",
    width: "100%",
    padding: "8px 12px",
    background: "none",
    border: "none",
    textAlign: "left",
    fontSize: "13px",
    cursor: "pointer",
    borderRadius: "4px",
    color: "var(--text-secondary)",
  },
  divider: {
    height: "1px",
    background: "var(--border-color)",
    margin: "4px 0",
  },
  renameBox: {
    padding: "8px",
    display: "flex",
    gap: "6px",
  },
  renameInput: {
    flex: 1,
    padding: "6px 8px",
    fontSize: "13px",
    border: "1px solid var(--border-color)",
    borderRadius: "4px",
    outline: "none",
    background: "var(--bg-input)",
    color: "var(--text-primary)",
  },
  renameBtn: {
    padding: "6px 12px",
    fontSize: "13px",
    background: "var(--brand)",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
