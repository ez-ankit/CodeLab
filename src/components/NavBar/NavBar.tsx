"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Toaster } from "react-hot-toast";
import axios from "axios";

import notify from "../../services/toast";
import { images } from "../../constant";
import { useTheme } from "../../context/ThemeContext";
import style from "./NavBar.module.scss";

const NavBar = () => {
  const params = useParams() as { projectId?: string; roomId?: string };
  const boxRef = useRef<HTMLDivElement>(null);
  const [username, setUsername] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isBoxVisible, setIsBoxVisible] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const projectId = params?.projectId || params?.roomId;
  const shareableLink =
    typeof window !== "undefined" && projectId
      ? `${window.location.origin}/editor/${projectId}`
      : "";

  const initial = username ? username.charAt(0).toUpperCase() : "?";

  const toggleBoxVisibility = () => {
    setIsBoxVisible(!isBoxVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setIsBoxVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [boxRef]);

  const copyLinkHandler = () => {
    navigator.clipboard.writeText(shareableLink);
    setIsBoxVisible(false);
    notify("Link Copied Successfully.");
  };

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((c) => c.startsWith("AuthToken="));
    const userCookie = cookies.find((c) => c.startsWith("username="));

    if (userCookie) {
      setUsername(decodeURIComponent(userCookie.split("=")[1]));
    }

    if (tokenCookie) {
      const token = tokenCookie.split("=")[1];
      axios
        .get("/api/protected/isLoggedIn", {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            setLoggedIn(true);
          }
        })
        .catch(() => {
          setLoggedIn(false);
        });
    }
  }, []);

  return (
    <>
      <div className={style.nav}>
        <div className={style.nav__menu}>
          <Link href="/">
            <img src={images.logo_dark.src} alt="CodeLab" />
          </Link>
          <div className={style.nav__list}>
            {projectId ? (
              <div className={style.share} onClick={toggleBoxVisibility}>
                <div className={`${style.img}`}>
                  <svg
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line x1="7" x2="17" y1="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                  <span>Share</span>
                </div>

                {isBoxVisible && (
                  <div
                    className={style.shareNav}
                    ref={boxRef}
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    <p>Share this link with other people:</p>
                    <div>
                      <input type="text" value={shareableLink} readOnly />
                      <span onClick={copyLinkHandler}>
                        <svg
                          viewBox="0 0 256 256"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect fill="none" height="256" width="256" />
                          <path
                            fill="currentcolor"
                            d="M210,46a51.8,51.8,0,0,0-73.5,0L116.7,65.8A8,8,0,0,0,128,77.1l19.8-19.8a36.1,36.1,0,0,1,50.9,0,35.9,35.9,0,0,1,0,50.9l-28.3,28.3a36.1,36.1,0,0,1-50.9,0,8,8,0,1,0-11.3,11.3,52,52,0,0,0,73.5,0L210,119.5A51.8,51.8,0,0,0,210,46Z"
                          />
                          <path
                            fill="currentcolor"
                            d="M128,178.9l-19.8,19.8a36,36,0,0,1-50.9-50.9l28.3-28.3a36.1,36.1,0,0,1,50.9,0,8,8,0,0,0,11.3-11.3,52,52,0,0,0-73.5,0L46,136.5A52,52,0,1,0,119.5,210l19.8-19.8A8,8,0,0,0,128,178.9Z"
                          />
                        </svg>
                        Copy link
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            <button
              className={style.themeToggle}
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </button>

            {isLoggedIn ? (
              <div className={style.profile}>
                <Link href="/profile">
                  <div className={style.avatar}>
                    {initial}
                  </div>
                </Link>
              </div>
            ) : (
              <div className={style.signin}>
                <Link href="/login">
                  <span>
                    Sign in <img src={images.rightArrow} alt="" />
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
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

export default NavBar;
