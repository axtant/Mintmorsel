// src/components/Login.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../../services/authService";
import "../css/main.css";
import "../css/Login.css";
import Bowl from "../css/Login_Images/Bowl.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ username, password }); // Send credentials to backend
      // Redirect to dashboard or home page after successful login
      window.location.href = "/dashboard";
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-page">
      <div className="Middle_img">
        <div className="curved-text">
          <span style={{ "--i": 0 }}>M</span>
          <span style={{ "--i": 1 }}>i</span>
          <span style={{ "--i": 2 }}>n</span>
          <span style={{ "--i": 3 }}>t</span>
          <span style={{ "--i": 4 }}>m</span>
          <span style={{ "--i": 5 }}>o</span>
          <span style={{ "--i": 6 }}>r</span>
          <span style={{ "--i": 7 }}>s</span>
          <span style={{ "--i": 8 }}>e</span>
          <span style={{ "--i": 9 }}>l</span>
        </div>
        <img src={Bowl} className="Bowl-img" />
        <div class="triangles">
          <div class="triangle1"></div>
          <div class="triangle2"></div>
          <div class="triangle3"></div>
          <div class="triangle4"></div>
        </div>
      </div>
      <div class="login_details">
        <h1 class="login_text">Login</h1>
        <input
          class="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          class="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
      </div>
      <div class="buttons_div center">
        <form onSubmit={handleSubmit}>
          <button type="submit" class="login_btn">Login</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
        <h2 class="or ">or</h2>
        <Link to="/signup">
          <button type="button" class="signup_btn">Create an account</button>
        </Link>
      </div>
    </div>
  );
};

export default Login;
