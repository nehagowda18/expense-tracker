import React from 'react';
import './Sidebar.css';

const navItems = [
  { id: 'dashboard', icon: '⬡', label: 'Dashboard' },
  { id: 'transactions', icon: '↕', label: 'Transactions' },
  { id: 'add', icon: '+', label: 'Add Entry' },
  { id: 'categories', icon: '◈', label: 'Categories' },
];

export default function Sidebar({ activePage, navigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">◈</span>
        <span className="logo-text">SpendWise</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => navigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {activePage === item.id && <span className="nav-indicator" />}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p className="sidebar-tip">Track every rupee.</p>
      </div>
    </aside>
  );
}