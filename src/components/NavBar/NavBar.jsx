"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { v4 as uuidV4 } from "uuid";
import { Toaster } from "react-hot-toast";
import axios from "axios";

import notify from "../../services/toast";
import { images } from "../../constant";
import "../../style/btn1.scss";
import "../../style/btn2.scss";
import style from "./NavBar.module.scss";

const NavBar = () => {
  const param = useParams();
  const boxRef = useRef(null);
  const router = useRouter();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isBoxVisible, setIsBoxVisible] = useState(false);

  const roomId = param.roomId;
  const shareableLink = typeof window !== "undefined" ? `${window.location.origin}/editor/${roomId}` : "";

  const createFile = () => {
    const roomId = uuidV4();
    router.push(`/editor/${roomId}`);
  };

  const toggleBoxVisibility = () => {
    setIsBoxVisible(!isBoxVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
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
    const bearer = document.cookie
      .split("; ")
      .filter((item) => item.includes("AuthToken"));

    var token = null;

    if(bearer.length > 0){
      token = bearer[0].split("=")[1];
    }

    if (token) {
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
        .catch((err) => {
          if (err && err.response && err.response.status === 401) {
            setLoggedIn(false);
          }
        });
    }
  }, []);

  return (
    <>
      <div className={style.nav}>
        <div className={style.nav__menu}>
          <Link href="/">
            <img src={images.logo_dark} alt="" />
          </Link>
          <div className={style.nav__list}>
            {roomId ? (
              <div className={style.share} onClick={toggleBoxVisibility}>
                <div className={`${style.img} app__flex btn-1`}>
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
                      <span className="app__flex" onClick={copyLinkHandler}>
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
            ) : (
              <div className={style.new_file} onClick={() => createFile()}>
                <div className="app__flex btn-2">
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="plus"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path
                      fill="currentColor"
                      d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"
                    ></path>
                  </svg>
                  <span>New file</span>
                </div>
              </div>
            )}
            {isLoggedIn ? (
              <Link href="/dashboard" style={{ textDecoration: "none" }}>
                <div className={style.dashboard}>
                  <div className="app__flex">
                    <svg
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="currentColor"
                        d="M4 13h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm-1 7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4zm10 0a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v7zm1-10h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1z"
                      />
                    </svg>
                    <span>Dashboard</span>
                  </div>
                </div>
              </Link>
            ) : (
              <div className={style.signin}>
                <Link href="/login">
                  <span className="app__flex">
                    Sign in <img src={images.rightArrow} alt="" />
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default NavBar;
