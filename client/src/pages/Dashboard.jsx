import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios'; // Added Axios for data fetching
import { 
  LayoutDashboard, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  LogOut, 
  Wallet, 
  ShoppingCart, 
  Briefcase, 
  Zap 
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = ({ setIsAuth }) => {
  const location = useLocation();
  
  // 1. STATE FOR DATA
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. FETCH DATA FROM BACKEND
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Fetch both simultaneously
      const [incRes, expRes] = await Promise.all([
        axios.get('http://localhost:5000/api/v1/get-incomes', config),
        axios.get('http://localhost:5000/api/v1/get-expenses', config)
      ]);

      setIncomes(incRes.data);
      setExpenses(expRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 3. CALCULATIONS
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalBalance = totalIncome - totalExpenses;

  // Combine and sort for "Recent Transactions" (limit to 3)
  const recentTransactions = [
    ...incomes.map(i => ({ ...i, type: 'income' })),
    ...expenses.map(e => ({ ...e, type: 'expense' }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuth(false);
  };

  if (loading) return <div className="loading-screen">Updating Finances...</div>;

  return (
    <div className="dashboard-layout">
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">Expense Tracker</div>
        
        <div className="user-profile">
          <div className="avatar">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rodrick" alt="User" />
          </div>
          <h3 className="user-name">Rodrick</h3>
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
          <button className="nav-item logout" onClick={handleLogout}>
            <LogOut size={20}/> Logout
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        <header className="content-header">
            <h1>Dashboard Overview</h1>
            <p>Welcome back! Here is your real-time financial summary.</p>
        </header>

        {/* TOP STAT CARDS */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="icon-box purple"><Wallet /></div>
            <div className="stat-info">
              <span>Total Balance</span>
              <h2 style={{ color: totalBalance < 0 ? '#ef4444' : 'inherit' }}>
                ${totalBalance.toLocaleString()}
              </h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="icon-box orange"><ArrowUpCircle /></div>
            <div className="stat-info">
              <span>Total Income</span>
              <h2>${totalIncome.toLocaleString()}</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="icon-box red"><ArrowDownCircle /></div>
            <div className="stat-info">
              <span>Total Expenses</span>
              <h2>${totalExpenses.toLocaleString()}</h2>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION GRID */}
        <div className="dashboard-grid">
          {/* RECENT TRANSACTIONS */}
          <section className="transactions-card">
            <div className="card-header">
              <h3>Recent Transactions</h3>
              <Link to="/income" className="see-all">See All →</Link>
            </div>
            
            <div className="t-list">
              {recentTransactions.map((t, idx) => (
                <div className="t-item" key={t._id || idx}>
                  <div className={`t-icon ${t.type}`}>
                    {t.type === 'income' ? <Briefcase size={18}/> : <ShoppingCart size={18}/>}
                  </div>
                  <div className="t-text">
                    <p className="t-name">{t.source || t.category}</p>
                    <p className="t-date">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`t-amount ${t.type === 'income' ? 'pos' : 'neg'}`}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                  </span>
                </div>
              ))}
              {recentTransactions.length === 0 && <p>No transactions yet.</p>}
            </div>
          </section>

          {/* FINANCIAL OVERVIEW (DYNAMIC DONUT) */}
          <section className="overview-card">
            <h3>Financial Overview</h3>
            <div className="chart-container">
              <div className="donut-mimic">
                <div className="inner-circle">
                  <span>Current Balance</span>
                  <strong>${totalBalance.toLocaleString()}</strong>
                </div>
              </div>
              <div className="chart-legend">
                <p><span className="dot purple"></span> Balance</p>
                <p><span className="dot red"></span> Expenses</p>
                <p><span className="dot orange"></span> Income</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;