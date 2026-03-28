import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  LogOut, 
  Plus, 
  X, 
  ChevronDown,
  Trash2 
} from 'lucide-react';
import './Income.css';

const Income = ({ setIsAuth }) => {
  const [showModal, setShowModal] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);
  const location = useLocation();

  const [incomes, setIncomes] = useState([]);
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    date: '',
    icon: '💰' 
  });

  const iconOptions = ['💰', '💼', '📈', '🎁', '🏦', '💸', '🎨', '🛒', '🎓', '🏠'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIncomes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/v1/get-incomes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIncomes(response.data);
    } catch (error) {
      console.error("Error fetching incomes:", error);
    }
  };

  useEffect(() => { getIncomes(); }, []);

  const handleAddIncome = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/v1/add-income', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setFormData({ source: '', amount: '', date: '', icon: '💰' });
      getIncomes();
    } catch (error) {
      alert("Error adding income: Server Error");
    }
  };

  const deleteIncome = async (id) => {
    if (window.confirm("Delete this income entry?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/v1/delete-income/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        getIncomes(); 
      } catch (error) {
        console.error("Error deleting income:", error);
      }
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">Expense Tracker</div>
        <div className="user-profile">
          <div className="avatar">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
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
        <header className="income-header">
          <div className="header-text">
            <h1>Income Overview</h1>
            <p>Track your earnings over time.</p>
          </div>
          <button className="add-income-main-btn" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Add Income
          </button>
        </header>

        {/* --- DYNAMIC INCOME CHART --- */}
        <section className="income-chart-card">
          <div className="chart-layout-grid">
            <div className="y-axis-labels">
              <span>Max</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0</span>
            </div>

            <div className="bar-chart-container">
              {incomes.length > 0 ? (
                incomes.slice(-7).map((income, index) => {
                  const maxVal = 14000; 
                  const barHeight = Math.min((income.amount / maxVal) * 100, 100);

                  return (
                    <div className="bar-column" key={income._id}>
                      <div 
                        className={`bar-pillar ${index % 2 === 0 ? 'dark' : 'light'}`} 
                        style={{ height: `${barHeight}%` }}
                        title={`${income.source}: $${income.amount}`}
                      ></div>
                      <span className="bar-footer-date">
                        {new Date(income.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="empty-chart-msg">Add income to see your trends</div>
              )}
            </div>
          </div>
        </section>

        <section className="sources-card">
          <div className="card-header">
            <h3>Income Sources</h3>
            {/* Download button removed from here */}
          </div>
          <div className="t-list">
            {incomes.map((income) => (
              <div className="t-item" key={income._id}>
                <div className="t-icon salary">{income.icon}</div>
                <div className="t-text">
                  <p className="t-name">{income.source}</p>
                  <p className="t-date">{new Date(income.date).toLocaleDateString()}</p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span className="t-amount pos">+${income.amount.toLocaleString()}</span>
                  <button 
                    className="delete-btn" 
                    onClick={() => deleteIncome(income._id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4d' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <div className="modal-header">
                <div className="header-left">
                  <div className="icon-preview-sq">{formData.icon}</div>
                  <h2>Add Income</h2>
                </div>
                <button className="close-x-btn" onClick={() => setShowModal(false)}><X size={20}/></button>
              </div>
              
              <form className="modal-body" onSubmit={handleAddIncome}>
                <div className="dropdown-wrapper" ref={pickerRef}>
                  <label className="input-label">Pick Icon</label>
                  <div className="icon-select-trigger" onClick={() => setShowPicker(!showPicker)}>
                    <span>{formData.icon} Select an icon</span>
                    <ChevronDown size={16} />
                  </div>

                  {showPicker && (
                    <div className="emoji-picker-popup">
                      <div className="emoji-grid">
                        {iconOptions.map(emoji => (
                          <button 
                            key={emoji} 
                            type="button" 
                            className={`emoji-btn ${formData.icon === emoji ? 'active' : ''}`}
                            onClick={() => { setFormData({...formData, icon: emoji}); setShowPicker(false); }}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-input-group">
                  <label>Income Source</label>
                  <input type="text" value={formData.source} onChange={(e) => setFormData({...formData, source: e.target.value})} required />
                </div>
                <div className="form-input-group">
                  <label>Amount</label>
                  <input type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
                </div>
                <div className="form-input-group">
                  <label>Date</label>
                  <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
                </div>

                <button type="submit" className="final-add-btn">Add Income</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Income;