"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";
import { io } from "socket.io-client"

import notify from "../../services/toast";
import style from "./Editor.module.scss";
import NavBar from "../NavBar/NavBar";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const EditorLayout = ({ roomId }) => {
  const socketRef = useMemo(
    () =>
        io({ reconnectionAttempts: 2 }),
    [],
  )
  const [code, setCode] = useState("// here is your code...");
  const editorDidMount = useCallback((editor, monaco) => {
    editor.focus();
  }, []);

  useEffect(() => {
    document.title = "Editor";
  }, []);

  const cookies = document.cookie;
  let username = cookies ? cookies.split("; ").filter(cookie => cookie.includes("username"))[0]?.split("=")[1] : "Unkown User";

  const handleErrors = (e) => {
    console.log("socket error", e);
    notify("Socket connection failed, try again later.");
  };

  useEffect(() => {
    socketRef.on("connect_error", (err) => handleErrors(err));
    socketRef.on("connect_failed", (err) => handleErrors(err));
    socketRef.emit("JOIN", { roomId, username });

    socketRef.on("JOINED", ({ code }) => {
      setCode(code);
    });

    socketRef.on("code change", ({ newCode }) => {
      setCode(newCode);
    });

    socketRef.on("disconnected", ({ username }) => {
      console.log(username);
    });

    window.addEventListener("beforeunload", leave);
    return () => {
      window.removeEventListener("beforeunload", leave);
    };
  }, []);

  const leave = () => {
    if (socketRef) {
      socketRef.emit("leave", roomId);
    }
  };

  const options = {
    selectOnLineNumbers: true,
  };

  const onCodeChange = (newValue) => {
    setCode(newValue);
    if (socketRef) {
      socketRef.emit("code change", { roomId, newCode: newValue });
    }
  };

  return (
    <>
      <NavBar />

      <div className={style.editor}>
        <MonacoEditor
          width="100%"
          height="calc(100vh - 70px)"
          language="javascript"
          theme="vs-light"
          value={code}
          options={options}
          onChange={onCodeChange}
          editorDidMount={editorDidMount}
        />
      </div>

      <Toaster />
    </>
  );
};

export default EditorLayout;
