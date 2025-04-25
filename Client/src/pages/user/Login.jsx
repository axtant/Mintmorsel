// src/components/Login.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../../services/authService";
import "../css/main.css";
import "../css/login.css";
import Foods from "../css/Signup_Images/Food.png";

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
      setError("Invalid username or password " + error);
    }
  };

  return (
    <div className="login-page">
      <div class="food_img">
        <div class="food_div">
          <img src={Foods} class="food" />
        </div>
      </div>
      <div class="login_details">
        <h1 class="login_text">MINTMORSEL</h1>
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
        {error && (
          <p className="error text-red-500 text-center mt-2">{error}</p>
        )}
        <div class="buttons_div center">
          <form onSubmit={handleSubmit}>
            <button type="submit" class="login_btn" onSubmit={handleSubmit}>
              Login
            </button>
          </form>

          <Link to="/signup">
            <button type="button" class="signup_btn">
              Create an account
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
