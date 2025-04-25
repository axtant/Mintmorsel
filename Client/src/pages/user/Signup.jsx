// src/components/Signup.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signup } from "../../services/authService";
import "../css/main.css";
import "../css/Signup.css";
const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [gmapLink, setGmapLink] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password || !pin || !gmapLink || !address) {
      alert("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await signup({
        username,
        password,
        pin: parseInt(pin),
        gMapLink: gmapLink,
        address,
      });
      alert("Signup successful!");
      // Redirect to login page after successful signup
      window.location.href = "/login";
    } catch (error) {
      setError("Failed to create account" + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-page">
      <div class="signup_details">
        <div class="signup_text">Signup</div>
        <div className="form-group">
          <input
            class="new_username"
            placeholder="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            class="new_password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            class="Phone_no"
            placeholder="Phone no."
            type="tel"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            placeholder="Google Maps Link"
            class="Maps_link"
            type="text"
            value={gmapLink}
            onChange={(e) => setGmapLink(e.target.value)}
            required
          />
          <Link to="https://www.google.co.in/maps" class="Google_maps">
            {" "}
            <i class="fa-solid fa-location-arrow fa-1x"></i>
          </Link>
        </div>
        <div className="form-group">
          <textarea
            placeholder="Address"
            className="Address" // Use className instead of class in React
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <form onSubmit={handleSubmit}>
          <button class="submit_btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing up..." : "Signup"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
        <div class="Already_registered">
          Already registered?{" "}
          <Link to="/login" class="Login_link">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
