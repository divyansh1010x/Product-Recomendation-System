import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Importing external CSS for styles
function LoginPage() {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Reset any previous error
    setError('');
    // Send login request to the server API
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, userId }),
      });
      // Handle server response
      if (response.ok) {
        const user = await response.json();
        console.log('Login successful:', user);
        navigate('/home');
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid login credentials');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('An error occurred during login. Please try again.');
    }
  };
  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="userId">User ID:</label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <p className="signup-link">
          New user? <a href="/signup">Sign up here</a>
        </p>
      </div>
    </div>
  );
}
export default LoginPage;