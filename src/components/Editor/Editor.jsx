"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";

import notify from "../../services/toast";
import { useTheme } from "../../context/ThemeContext";
import style from "./Editor.module.scss";
import NavBar from "../NavBar/NavBar";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const LANGUAGES = [
  "javascript", "typescript", "python", "html", "css",
  "rust", "go", "java", "cpp", "ruby", "php",
];

const EditorLayout = ({ projectId }) => {
  const { theme } = useTheme();
  const socketRef = useMemo(() => io({ reconnectionAttempts: 2 }), []);
  const [code, setCode] = useState("// your code...");
  const [project, setProject] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [clients, setClients] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatDraft, setChatDraft] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const chatEndRef = useRef(null);
  const titleRef = useRef(null);

  const monacoTheme = theme === "dark" ? "vs-dark" : "light";

  const cookies = document.cookie;
  const username = useMemo(() => {
    const match = cookies?.split("; ").find((c) => c.startsWith("username="));
    return match ? match.split("=")[1] : "Unknown User";
  }, []);

  const editorDidMount = useCallback((editor) => {
    editor.focus();
  }, []);

  useEffect(() => {
    document.title = "Editor";
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetch(`/api/projects/${projectId}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setProject(res.data);
          setCode(res.data.code || "// your code...");
          setLanguage(res.data.programmingLanguage || "javascript");
        }
      })
      .catch(() => {});
  }, [projectId]);

  const handleErrors = () => {
    notify("Socket connection failed, try again later.");
  };

  const leave = () => {
    if (socketRef) {
      socketRef.emit("leave", projectId);
    }
  };

  useEffect(() => {
    socketRef.on("connect_error", () => handleErrors());
    socketRef.on("connect_failed", () => handleErrors());
    socketRef.emit("JOIN", { roomId: projectId, username });

    socketRef.on("JOINED", ({ code: incomingCode, clients: connected }) => {
      if (incomingCode) setCode(incomingCode);
      if (connected) setClients(connected);
    });

    socketRef.on("code change", ({ newCode }) => {
      setCode(newCode);
    });

    socketRef.on("user joined", ({ username: u, clients: connected }) => {
      if (connected) setClients(connected);
    });

    socketRef.on("disconnected", ({ username: u, clients: connected }) => {
      if (connected) setClients(connected);
    });

    socketRef.on("chat", ({ username: u, message }) => {
      setMessages((prev) => [...prev, { username: u, message }]);
    });

    window.addEventListener("beforeunload", leave);
    return () => {
      window.removeEventListener("beforeunload", leave);
    };
  }, [projectId]);

  const options = {
    selectOnLineNumbers: true,
    minimap: { enabled: false },
    fontSize: 14,
    fontFamily: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', Consolas, monospace",
    lineNumbers: "on",
    renderWhitespace: "selection",
    bracketPairColorization: { enabled: true },
    autoClosingBrackets: "always",
    scrollBeyondLastLine: false,
    padding: { top: 16, bottom: 16 },
    smoothScrolling: true,
    cursorBlinking: "smooth",
    cursorSmoothCaretAnimation: "on",
    accessibilitySupport: "on",
    ariaLabel: "Code editor",
  };

  const onCodeChange = (newValue) => {
    setCode(newValue);
    if (socketRef) {
      socketRef.emit("code change", { roomId: projectId, newCode: newValue });
    }
  };

  const handleLangChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    fetch(`/api/projects/${projectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ programmingLanguage: newLang }),
    }).catch(() => notify("Failed to update language"));
  };

  const startEditingTitle = () => {
    setTitleDraft(project?.title || "");
    setEditingTitle(true);
  };

  const saveTitle = () => {
    const trimmed = titleDraft.trim();
    if (!trimmed) {
      setEditingTitle(false);
      return;
    }
    setProject((prev) => ({ ...prev, title: trimmed }));
    setEditingTitle(false);
    fetch(`/api/projects/${projectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: trimmed }),
    }).catch(() => notify("Failed to update title"));
  };

  const handleTitleKey = (e) => {
    if (e.key === "Enter") saveTitle();
    if (e.key === "Escape") setEditingTitle(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      notify("Saved");
    } catch {
      notify("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleChatSend = (e) => {
    e.preventDefault();
    if (!chatDraft.trim()) return;
    socketRef.emit("chat", { roomId: projectId, username, message: chatDraft.trim() });
    setChatDraft("");
  };

  const initial = username ? username.charAt(0).toUpperCase() : "?";

  return (
    <>
      <NavBar />

      <div className={style.editorWrap}>
        <div className={style.editor}>
          <MonacoEditor
            width="100%"
            height="100%"
            language={language}
            theme={monacoTheme}
            value={code}
            options={options}
            onChange={onCodeChange}
            onMount={editorDidMount}
          />
        </div>

        {/* ── Right panel ── */}
        <aside className={style.panel}>
          {/* Project info */}
          <div className={style.panelSection}>
            <div className={style.panelLabelRow}>
              <div className={style.panelLabel} style={{ marginBottom: 0 }}>Project</div>
              <button
                className={`${style.saveBtnSmall} ${saving ? style.saveBtnSmallSaving : ""}`}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
            {editingTitle ? (
              <input
                ref={titleRef}
                className={style.projectNameEdit}
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onBlur={saveTitle}
                onKeyDown={handleTitleKey}
                autoFocus
              />
            ) : (
              <div className={style.projectNameDisplay} onClick={startEditingTitle} title="Click to rename">
                {project?.title || "Untitled"}
              </div>
            )}
          </div>

          {/* Language */}
          <div className={style.panelSection}>
            <div className={style.panelLabel}>Language</div>
            <select className={style.langSelect} value={language} onChange={handleLangChange}>
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Collaborators */}
          <div className={style.panelSection}>
            <div className={style.panelLabelRow}>
              <div className={style.panelLabel} style={{ marginBottom: 0 }}>Collaborators</div>
              <span className={style.collabCount}>{clients.length} connected</span>
            </div>
            <div className={style.collabStack}>
              {clients.map((c, i) => {
                const isYou = c.username === username || c.socketId === socketRef?.id;
                const color = isYou ? "var(--brand)" : "#ffbd2e";
                const init = c.username ? c.username.charAt(0).toUpperCase() : "?";
                return (
                  <div
                    key={c.socketId || i}
                    className={style.collabCircle}
                    style={{
                      background: `${color}1a`,
                      borderColor: color,
                      color,
                      marginLeft: i === 0 ? 0 : -8,
                      zIndex: clients.length - i,
                    }}
                    title={c.username}
                  >
                    {init}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chat */}
          <div className={style.panelSection}>
            <div className={style.panelLabel}>Chat</div>
            <div className={style.chatMessages}>
              {messages.length === 0 && (
                <div className={style.chatEmpty}>No messages yet</div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={style.chatMsg}>
                  <span
                    className={style.chatName}
                    style={{
                      color: m.username === username ? "var(--brand)" : "#ffbd2e",
                    }}
                  >
                    {m.username}:
                  </span>{" "}
                  <span className={style.chatText}>{m.message}</span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form className={style.chatInputWrap} onSubmit={handleChatSend}>
              <input
                className={style.chatInput}
                value={chatDraft}
                onChange={(e) => setChatDraft(e.target.value)}
                placeholder="Type a message..."
              />
              <button type="submit" className={style.chatSend}>Send</button>
            </form>
          </div>
        </aside>
      </div>

      <Toaster
        toastOptions={{
          style: {
            backgroundColor: "var(--brand)",
            color: "white",
            width: "250px",
          },
        }}
      />
    </>
  );
};

export default EditorLayout;
