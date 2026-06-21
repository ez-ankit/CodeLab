"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import { NavBar } from "@/src/components";
import SearchBar from "@/src/components/dashboard/SearchBar";
import ProjectGrid from "@/src/components/dashboard/ProjectGrid";
import CreateProjectDialog from "@/src/components/dashboard/CreateProjectDialog";

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

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filtered, setFiltered] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");

  const fetchProjects = useCallback(async () => {
    try {
      const res = await axios.get("/api/projects");
      if (res.data.success) {
        setProjects(res.data.data);
        setFiltered(res.data.data);
      }
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (!search) {
      setFiltered(projects);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        projects.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            p.programmingLanguage.toLowerCase().includes(q)
        )
      );
    }
  }, [search, projects]);

  const handleCreate = async (data: {
    title: string;
    description: string;
    programmingLanguage: string;
    visibility: "public" | "private";
  }) => {
    try {
      const res = await axios.post("/api/projects", data);
      if (res.data.success) {
        router.push(`/editor/${res.data.data._id}`);
      }
    } catch {
      toast.error("Failed to create project");
    }
  };

  const handleRename = async (id: string, title: string) => {
    try {
      await axios.put(`/api/projects/${id}`, { title });
      toast.success("Project renamed");
      fetchProjects();
    } catch {
      toast.error("Failed to rename project");
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await axios.put(`/api/projects/${id}`, { archived: true });
      toast.success("Project archived");
      fetchProjects();
    } catch {
      toast.error("Failed to archive project");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this project permanently? This cannot be undone.")) return;
    try {
      await axios.delete(`/api/projects/${id}`);
      toast.success("Project deleted");
      fetchProjects();
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await axios.post(`/api/projects/${id}/duplicate`);
      toast.success("Project duplicated");
      fetchProjects();
    } catch {
      toast.error("Failed to duplicate project");
    }
  };

  return (
    <>
      <NavBar />
      <div style={styles.page}>
        <div style={styles.top}>
          <div style={styles.topLeft}>
            <h1 style={styles.heading}>Dashboard</h1>
            <p style={styles.subtitle}>Manage your projects</p>
          </div>
          <div style={styles.topRight}>
            <SearchBar onSearch={setSearch} />
            <button style={styles.createBtn} onClick={() => setShowCreate(true)}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Project
            </button>
          </div>
        </div>

        {loading ? (
          <div style={styles.loading}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={styles.skeleton}>
                <div style={styles.skelHeader} />
                <div style={styles.skelBody} />
                <div style={styles.skelFooter} />
              </div>
            ))}
          </div>
        ) : (
          <ProjectGrid
            projects={filtered}
            onRename={handleRename}
            onArchive={handleArchive}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
          />
        )}
      </div>

      <CreateProjectDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreate}
      />
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: "80px 32px 32px",
    maxWidth: "1200px",
    margin: "0 auto",
    minHeight: "100vh",
    background: "var(--bg-primary)",
  },
  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    flexWrap: "wrap",
    gap: "16px",
  },
  topLeft: {},
  topRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  heading: {
    fontSize: "28px",
    fontWeight: 700,
    color: "var(--text-primary)",
    margin: 0,
  },
  subtitle: {
    fontSize: "14px",
    color: "var(--text-muted)",
    margin: "4px 0 0",
  },
  createBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "10px 20px",
    background: "var(--brand)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  loading: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "16px",
  },
  skeleton: {
    background: "var(--bg-secondary)",
    borderRadius: "12px",
    border: "1px solid var(--border-color)",
    overflow: "hidden",
  },
  skelHeader: {
    height: "44px",
    background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  },
  skelBody: {
    height: "80px",
    background: "linear-gradient(90deg, #f5f5f5 25%, #e8e8e8 50%, #f5f5f5 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  },
  skelFooter: {
    height: "36px",
    background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  },
};
