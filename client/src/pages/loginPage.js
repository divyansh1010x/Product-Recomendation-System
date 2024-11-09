import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle login function
  const handleLogin = async (e) => {
    e.preventDefault();

    setError('');

    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, userId }),
      });

      if (response.ok) {
        const user = await response.json();
        console.log('Login successful:', user);

        // Store user info in session storage
        sessionStorage.setItem('user', JSON.stringify(user));

        // Fetch and store the favorite category
        await fetchFavoriteCategory(user.user_id);

        // Navigate to the home page
        navigate('/dummy');
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid login credentials');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('An error occurred during login. Please try again.');
    }
  };

  // Fetch favorite category function
  const fetchFavoriteCategory = async (userId) => {
    try {
      const response = await fetch('http://localhost:5001/fav_category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: userId }),  // Match your API's expected request body format
      });

      if (!response.ok) throw new Error('Failed to fetch favorite category');

      const data = await response.json();

      // Assuming the favorite category is provided directly in the API's response
      if (data.favorite_category) {
        sessionStorage.setItem('favorite_category', data.favorite_category);
      }
    } catch (error) {
      console.error('Error fetching favorite category:', error);
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
