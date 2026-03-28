import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

const Login = ({ setIsAuth }) => { // Using destructuring for cleaner props
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Trim email to prevent invisible space errors
    const processedValue = name === 'email' ? value.trim() : value;
    setFormData({ ...formData, [name]: processedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Ensure the URL matches your server.js port (5000)
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      if (response.data.token) {
        // 1. Save the token exactly as 'token' for authMiddleware to find later
        localStorage.setItem('token', response.data.token);
        
        // 2. Update the global authentication state
        if (setIsAuth) {
          setIsAuth(true);
        }
        
        console.log("Login Successful: Token Saved");
        navigate('/dashboard'); 
      }
    } catch (error) {
      // 3. Extract the specific error message from your Backend
      const errorMessage = error.response?.data?.message || "Server is not responding";
      alert("Login Error: " + errorMessage);
      console.error("Full Login Error Context:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="brand-title">Expense Tracker</div>
      <div className="form-header">
        <h2>Welcome Back</h2>
        <p>Login to your account to continue.</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email Address</label>
          <input 
            type="email" 
            name="email" 
            placeholder="pslengoi@usiu.ac.ke" 
            value={formData.email}
            onChange={handleChange} 
            required 
            autoComplete="email"
          />
        </div>
        
        <div className="input-group">
          <label>Password</label>
          <input 
            type="password" 
            name="password" 
            placeholder="••••••••" 
            value={formData.password}
            onChange={handleChange} 
            required 
            autoComplete="current-password"
          />
        </div>

        <button 
          type="submit" 
          className="signup-btn" 
          disabled={loading}
        >
          {loading ? "AUTHENTICATING..." : "LOGIN"}
        </button>
      </form>

      <p className="login-link">
        Don't have an account? <Link to="/signup" className="purple-link">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;