import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { LayoutDashboard, ArrowUpCircle, ArrowDownCircle, LogOut, Plus, X, Trash2 } from 'lucide-react';
import './Expense.css';

const Expense = ({ setIsAuth }) => {
  const [showModal, setShowModal] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({ category: '', amount: '', date: '', icon: '💸' });
  const location = useLocation();

  const totalExpense = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

  const getExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/v1/get-expenses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  useEffect(() => { getExpenses(); }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/v1/add-expense', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setFormData({ category: '', amount: '', date: '', icon: '💸' });
      getExpenses();
    } catch (err) {
      alert("Error adding expense");
    }
  };

  const deleteExpense = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/v1/delete-expense/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        getExpenses();
      } catch (err) {
        console.error("Error deleting expense:", err);
      }
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">Expense Tracker</div>
        <div className="user-profile">
          <div className="avatar">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rodrick" alt="User" />
          </div>
          <h3 className="user-name">User</h3>
        </div>
        <nav className="side-nav">
          <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
            <LayoutDashboard size={20}/> Dashboard
          </Link>
          <Link to="/income" className={`nav-item ${location.pathname === '/income' ? 'active' : ''}`}>
            <ArrowUpCircle size={20}/> Income
          </Link>
          <Link to="/expense" className={`nav-item ${location.pathname === '/expense' ? 'active' : ''}`}>
            <ArrowDownCircle size={20}/> Expense
          </Link>
          <button className="nav-item logout" onClick={() => { localStorage.removeItem('token'); setIsAuth(false); }}>
            <LogOut size={20}/> Logout
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="expense-header">
          <div className="header-text">
            <h1>Expense Overview</h1>
            <p>Track your spending trends over time.</p>
          </div>
          <button className="add-btn-reference" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Add Expense
          </button>
        </header>

        <div className="summary-card">
          <div className="summary-info">
            <p>Total Monthly Spending</p>
            <h2>${totalExpense.toLocaleString()}</h2>
          </div>
        </div>

        <section className="transactions-section">
          <div className="section-header">
            <h3>All Expenses</h3>
          </div>
          <div className="t-grid">
            {expenses.map((exp) => (
              <div className="t-item" key={exp._id}>
                <div className="t-icon-box">💸</div>
                <div className="t-info">
                  <p className="t-name">{exp.category}</p>
                  <p className="t-date">{new Date(exp.date).toLocaleDateString()}</p>
                </div>
                <div className="t-amount-tag">-${Number(exp.amount).toLocaleString()}</div>
                <button className="delete-btn" onClick={() => deleteExpense(exp._id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <div className="modal-header">
                <h2>Add Expense</h2>
                <button className="close-x" onClick={() => setShowModal(false)}><X size={20}/></button>
              </div>
              <form onSubmit={handleAddExpense} className="modal-form">
                <div className="form-group">
                  <label>Expense Category</label>
                  <input type="text" placeholder="e.g. Rent" required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Amount</label>
                  <input type="number" placeholder="0.00" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                </div>
                <button type="submit" className="save-expense-btn">Save Expense</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Expense;