import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [pin, setPin] = useState('');
  const [gmapLink, setGmapLink] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signup data:', {
      username,
      phoneNumber,
      addressLine1,
      pin,
      gmapLink,
    });
    // Implement backend logic to save user data
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
          <label>Phone Number:</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Address Line 1:</label>
          <input
            type="text"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Pin Code:</label>
          <input
            type="number"
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
        <button type="submit">Signup</button>
      </form>
      <p>
        Already registered? <Link to="/">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
