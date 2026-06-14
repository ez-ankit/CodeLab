"use client";

import { v4 as uuidV4 } from "uuid";
import { useRouter } from "next/navigation";

import style from "@/src/App.module.scss";
import { NavBar } from "@/src/components";

export default function Home() {
  const router = useRouter();

  const createFile = () => {
    const roomId = uuidV4();
    router.push(`/editor/${roomId}`);
  };

  return (
    <>
      <NavBar />

      <section className={style.container}>
        <div className={style.bg}></div>
        <div className={`${style.top} app__flex`}>
          <div>
            <h1 style={{fontSize: "50px"}}>Unleash the Power of Collaboration⚡️</h1>
            <p>
              CodeLab is a collaborative online real-time code editor for
              technical
              <br />
              interviews, pair programming, teaching... you name it.
            </p>

            <div onClick={createFile} className={`${style.new__file} app__flex`}>
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
        </div>
      </section>
    </>
  );
}
