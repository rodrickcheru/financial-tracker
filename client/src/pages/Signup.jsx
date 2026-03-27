import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sending data to your Express backend
      await axios.post('http://localhost:5000/api/auth/signup', formData);
      alert("Account created! Please login.");
      navigate('/login'); // HCI: Smooth transition to the next step
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="signup-container">
      <div className="brand-title">Expense Tracker</div>
      <div className="form-header">
        <h2>Create an Account</h2>
        <p>Join us today by entering your details below.</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Full Name</label>
          <input type="text" name="fullName" placeholder="John" onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Email Address</label>
          <input type="email" name="email" placeholder="john@example.com" onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input type="password" name="password" placeholder="Min 8 Characters" onChange={handleChange} required />
        </div>
        <button type="submit" className="signup-btn">SIGN UP</button>
      </form>
      <p className="login-link">
        Already have an account? <Link to="/login" className="purple-link">Login</Link>
      </p>
    </div>
  );
};

export default Signup;