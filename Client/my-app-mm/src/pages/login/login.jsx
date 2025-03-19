import React from 'react';
import { Link } from 'react-router-dom';
// import './login.css';

const Login = () => {
  return (
    <div className="login-page">
      <h1>Login</h1>
      <form>
        <input type="username" placeholder="Username" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p>
        Not registered? <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
};

export default Login;
