import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expense from './pages/Expense'; // 1. IMPORT THE EXPENSE PAGE

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuth(!!token);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={isAuth ? <Dashboard setIsAuth={setIsAuth} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/income" 
          element={isAuth ? <Income setIsAuth={setIsAuth} /> : <Navigate to="/login" />} 
        />
        
        {/* 2. ADD THE EXPENSE ROUTE HERE */}
        <Route 
          path="/expense" 
          element={isAuth ? <Expense setIsAuth={setIsAuth} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;