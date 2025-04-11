// src/components/Signup.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signup } from '../../services/authService';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [gmapLink, setGmapLink] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password || !pin || !gmapLink || !address) {
      alert('Please fill all required fields');
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
      alert('Signup successful!');
      // Redirect to login page after successful signup
      window.location.href = '/login';
    } catch (error) {
      setError('Failed to create account' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-page">
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="tel"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Google Maps Link:</label>
          <input
            type="text"
            value={gmapLink}
            onChange={(e) => setGmapLink(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing up...' : 'Signup'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <p>
        Already registered? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
