"use client";

import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

import "./Login.scss";

const Login = () => {
  const router = useRouter();

  const login = (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    axios
      .post(
        "/api/user/login",
        {
          email: email,
          password: password,
        },
      )
      .then((res) => {
        document.cookie = `email=${email}; path=/`;
        document.cookie = `username=${res.data.username}; path=/`;
        document.cookie = `userId=${res.data.userId}; path=/`;
        document.cookie = `AuthToken=${res.data.AuthToken}; path=/`;

        router.push("/");
      })
      .catch((err) => {
        if (err.request.status == 400) {
          alert("Email or Password Missing.");
        }

        if (err.request.status == 401) {
          alert("Authentication failed: Wrong Email or Password.");
        }

        if (err.request.status == 500) {
          alert("Ops!!! Server Error.");
        }
      });

    e.target.reset();
  };

  useEffect(() => {
    document.title = "Login";
  }, []);

  return (
    <div className="login-container">
      <div className="login">
        <div className="login-box">
          <h1>Welcome to CodeLab! 👋🏻</h1>
          <p className="login-p">
            Please sign-in to your account and start the adventure
          </p>

          <div className="example">
            <p>Email: admin@vuexy.com / Pass: admin</p>
          </div>

          <form className="login-form" onSubmit={(e) => login(e)}>
            <label htmlFor="email">
              Email
              <input
                className="input-tag"
                type="email"
                name="email"
                placeholder="admin@codelab.com"
                required
              />
            </label>
            <br />
            <label htmlFor="password">
              Password
              <input
                className="input-tag"
                type="password"
                name="password"
                placeholder="•••••"
                required
              />
            </label>
            <br />
            <div className="check-box">
              <div>
                <input type="checkbox" />
                <span>Remember me</span>
              </div>
              <span>Forget Password?</span>
            </div>
            <input className="submit-btn" type="submit" value="Login" />
          </form>

          <p className="span">
            New on our platform? <Link href="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
