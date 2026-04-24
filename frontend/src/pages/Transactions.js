import React, { useEffect, useState } from 'react';
import { expensesAPI, categoriesAPI } from '../api';
import { format } from 'date-fns';
import './Transactions.css';

export default function Transactions({ navigate }) {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ type: '', category: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, [filters]);
  useEffect(() => { categoriesAPI.getAll().then(r => setCategories(r.data)); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await expensesAPI.getAll({ ...filters, limit: 100 });
      setExpenses(res.data.expenses);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    await expensesAPI.delete(id);
    fetchData();
  };

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  return (
    <div className="transactions-page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-sub">{expenses.length} entries</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('add')}>+ Add Entry</button>
      </div>

      <div className="filters-bar">
        <select value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}>
          <option value="">All Types</option>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <select value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c._id} value={c.name}>{c.icon} {c.name}</option>)}
        </select>
        <button className="btn-ghost" onClick={() => setFilters({ type: '', category: '' })}>Clear</button>
      </div>

      {loading ? (
        <div className="loading-state"><div className="spinner" /><p>Loading...</p></div>
      ) : expenses.length === 0 ? (
        <div className="empty-state"><p>No transactions found.</p></div>
      ) : (
        <div className="tx-table">
          <div className="tx-table-header">
            <span>Description</span><span>Category</span><span>Date</span><span>Amount</span><span>Actions</span>
          </div>
          {expenses.map(e => (
            <div key={e._id} className="tx-table-row">
              <div className="tx-desc">
                <span className={`type-badge ${e.type}`}>{e.type === 'income' ? '↑' : '↓'}</span>
                <div>
                  <p className="tx-title">{e.title}</p>
                  {e.notes && <p className="tx-notes">{e.notes}</p>}
                </div>
              </div>
              <span className="tx-cat">{e.category}</span>
              <span className="tx-date">{format(new Date(e.date), 'dd MMM yyyy')}</span>
              <span className={`tx-amt ${e.type === 'income' ? 'income-text' : 'expense-text'}`}>
                {e.type === 'income' ? '+' : '-'}{fmt(e.amount)}
              </span>
              <div className="tx-actions">
                <button className="action-btn edit" onClick={() => navigate('add', e)}>✎</button>
                <button className="action-btn del" onClick={() => handleDelete(e._id)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}