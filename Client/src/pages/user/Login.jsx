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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ username, password });
      window.location.href = "/dashboard";
    } catch (error) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-food-img">
        <div className="login-food-div">
          <img src={Foods} className="login-food" alt="Food" />
        </div>
      </div>
      <div className="login-details">
        <h1 className="login-text">MINTMORSEL</h1>
        <input
          className="login-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          className="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {error && (
          <p className="login-error text-red-500 text-center mt-2">{error}</p>
        )}
        <div className="login-buttons-div center">
          <form onSubmit={handleSubmit}>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <Link to="/signup">
            <button type="button" className="login-signup-btn" disabled={loading}>
              Create an account
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
