import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddExpense from './pages/AddExpense';
import Categories from './pages/Categories';
import './App.css';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [editingExpense, setEditingExpense] = useState(null);

  const navigate = (page, data = null) => {
    setEditingExpense(data);
    setActivePage(page);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard navigate={navigate} />;
      case 'transactions': return <Transactions navigate={navigate} />;
      case 'add': return <AddExpense navigate={navigate} editingExpense={editingExpense} />;
      case 'categories': return <Categories />;
      default: return <Dashboard navigate={navigate} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} navigate={navigate} />
      <main className="app-main">
        {renderPage()}
      </main>
    </div>
  );
}