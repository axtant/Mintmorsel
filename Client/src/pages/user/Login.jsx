// src/components/Login.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../../services/authService';
import '../css/main.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ username, password }); // Send credentials to backend
      // Redirect to dashboard or home page after successful login
      window.location.href = '/dashboard';
    } catch (error) {
      setError('Invalid username or password' + error);
    }
  };
  
  return (
    <div className="login-page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <p>
        Not registered? <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
};

export default Login;
