"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

import "./SignUp.scss";

const SignUp = () => {
  const router = useRouter();

  const passwordValidater = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const register = (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!passwordValidater(password)) {
      alert(
        "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character"
      );
      return;
    }

    axios
      .post("/api/user/register", {
        username: username,
        email: email,
        password: password,
      })
      .then((res) => {
        document.cookie = `email=${email}; path=/`;
        document.cookie = `username=${res.data.username}; path=/`;
        document.cookie = `userId=${res.data.userId}; path=/`;
        document.cookie = `AuthToken=${res.data.AuthToken}; path=/`;

        router.push("/dashboard");
      })
      .catch((error) => {
        alert(error.response.data.message);
      });

    e.target.reset();
  };

  return (
    <div className="login-container">
      <div className="login">
        <div className="login-box">
          <h1>Adventure starts here 🚀</h1>
          <p className="login-p">Make your code sharing easy and fun!</p>

          <div className="example">
            <p>Email: admin@vuexy.com / Pass: admin</p>
          </div>

          <form className="login-form" onSubmit={(e) => register(e)}>
            <label htmlFor="username">
              Username
              <input
                className="input-tag"
                type="text"
                name="username"
                placeholder="Enter your username"
                required
              />
            </label>
            <br />
            <label htmlFor="email">
              Email
              <input
                className="input-tag"
                type="email"
                name="email"
                placeholder="Enter your email"
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

            <input className="submit-btn" type="submit" value="Sign Up" />
          </form>

          <p className="span">
            Already have an account? <Link href="/login">Sign in instead</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
