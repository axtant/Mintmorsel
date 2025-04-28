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
      window.location.href = "/login";
    } catch (error) {
      setError("Failed to create account" + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-details">
        <div className="signup-text">Signup</div>
        <div className="signup-form-group">
          <input
            className="signup-username"
            placeholder="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="signup-password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="signup-form-group">
          <input
            className="signup-phone"
            placeholder="Phone no."
            type="tel"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
          />
        </div>
        <div className="signup-form-group">
          <input
            placeholder="Google Maps Link"
            className="signup-maps-link"
            type="text"
            value={gmapLink}
            onChange={(e) => setGmapLink(e.target.value)}
            required
          />
          <Link to="https://www.google.co.in/maps" className="signup-google-maps">
            <i className="fa-solid fa-location-arrow fa-1x"></i>
          </Link>
        </div>
        <div className="signup-form-group">
          <textarea
            placeholder="Address"
            className="signup-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <form onSubmit={handleSubmit}>
          <button className="signup-submit-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing up..." : "Signup"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
        <div className="signup-already-registered">
          Already registered?{" "}
          <Link to="/login" className="signup-login-link">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
