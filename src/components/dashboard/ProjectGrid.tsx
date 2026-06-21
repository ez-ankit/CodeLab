"use client";

import ProjectCard from "./ProjectCard";

interface Project {
  _id: string;
  title: string;
  description?: string;
  programmingLanguage: string;
  visibility: "public" | "private";
  updatedAt: string;
  createdAt: string;
  owner: { _id: string; username: string };
  archived: boolean;
}

interface ProjectGridProps {
  projects: Project[];
  onRename: (id: string, title: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export default function ProjectGrid({
  projects,
  onRename,
  onArchive,
  onDelete,
  onDuplicate,
}: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div style={styles.empty}>
        <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="#d1d5db" strokeWidth="1">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
        <h3 style={styles.emptyTitle}>No projects yet</h3>
        <p style={styles.emptyText}>Create your first project to get started.</p>
      </div>
    );
  }

  return (
    <div style={styles.grid}>
      {projects.map((project) => (
        <ProjectCard
          key={project._id}
          project={project}
          onRename={onRename}
          onArchive={onArchive}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        />
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "16px",
    alignItems: "stretch",
  },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 20px",
    color: "var(--text-muted)",
    textAlign: "center",
  },
  emptyTitle: {
    fontSize: "18px",
    fontWeight: 600,
    margin: "16px 0 4px",
    color: "var(--text-muted)",
  },
  emptyText: {
    fontSize: "14px",
    margin: 0,
    color: "var(--text-faint)",
  },
};
