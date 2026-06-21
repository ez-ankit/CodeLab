"use client";

import { useRouter } from "next/navigation";
import ProjectActions from "./ProjectActions";

interface ProjectCardProps {
  project: {
    _id: string;
    title: string;
    description?: string;
    programmingLanguage: string;
    visibility: "public" | "private";
    updatedAt: string;
    createdAt: string;
    owner: { _id: string; username: string };
    archived: boolean;
  };
  onRename: (id: string, title: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

const languageColors: Record<string, string> = {
  javascript: "#f7df1e",
  typescript: "#3178c6",
  python: "#3572A5",
  html: "#e34c26",
  css: "#563d7c",
  json: "#292929",
  default: "#6b7280",
};

const languageBgColors: Record<string, string> = {
  javascript: "#fef9e5",
  typescript: "#e8f0fe",
  python: "#eaf2e9",
  html: "#fde9e7",
  css: "#ede7f5",
  json: "#e8e8e8",
  default: "#f3f4f6",
};

export default function ProjectCard({
  project,
  onRename,
  onArchive,
  onDelete,
  onDuplicate,
}: ProjectCardProps) {
  const router = useRouter();
  const lang = project.programmingLanguage;
  const dotColor = languageColors[lang] || languageColors.default;
  const badgeBg = languageBgColors[lang] || languageBgColors.default;

  const handleClick = () => {
    router.push(`/editor/${project._id}`);
  };

  const timeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div style={styles.card}>
      <div style={styles.top}>
        <div style={styles.meta}>
          <span style={{ ...styles.dot, backgroundColor: dotColor }} />
          <span style={{ ...styles.langBadge, backgroundColor: badgeBg, color: dotColor }}>
            {lang}
          </span>
          <span style={styles.visibilityBadge}>
            {project.visibility === "public" ? "Public" : "Private"}
          </span>
        </div>
        <ProjectActions
          projectId={project._id}
          projectTitle={project.title}
          onRename={onRename}
          onArchive={onArchive}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        />
      </div>

      <div style={styles.body} onClick={handleClick}>
        <h3 style={styles.title}>{project.title}</h3>
        {project.description && (
          <p style={styles.description}>{project.description}</p>
        )}
      </div>

      <div style={styles.footer}>
        <span style={styles.owner}>{project.owner?.username || "Unknown"}</span>
        <span style={styles.time}>{timeAgo(project.updatedAt)}</span>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "var(--bg-secondary)",
    borderRadius: "12px",
    border: "1px solid var(--border-color)",
    overflow: "hidden",
    cursor: "default",
    transition: "box-shadow 0.15s, transform 0.15s",
    display: "flex",
    flexDirection: "column",
  },
  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    borderBottom: "1px solid var(--border-color)",
    gap: "8px",
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    minWidth: 0,
    flex: 1,
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  langBadge: {
    fontSize: "11px",
    fontWeight: 600,
    padding: "2px 8px",
    borderRadius: "4px",
    textTransform: "capitalize",
    flexShrink: 0,
  },
  visibilityBadge: {
    fontSize: "11px",
    color: "var(--text-muted)",
    background: "var(--bg-tertiary)",
    padding: "2px 8px",
    borderRadius: "4px",
    flexShrink: 0,
  },
  body: {
    padding: "16px",
    flex: 1,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  title: {
    fontSize: "16px",
    fontWeight: 600,
    color: "var(--text-primary)",
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  description: {
    fontSize: "13px",
    color: "var(--text-muted)",
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    lineHeight: "1.4",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 16px",
    borderTop: "1px solid var(--border-color)",
    fontSize: "12px",
    color: "var(--text-muted)",
  },
  owner: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    minWidth: 0,
  },
  time: {
    flexShrink: 0,
  },
};
