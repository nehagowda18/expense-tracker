import React, { useEffect, useState } from 'react';
import { expensesAPI, categoriesAPI } from '../api';
import { format } from 'date-fns';
import './AddExpense.css';

const paymentMethods = ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'upi', 'other'];

export default function AddExpense({ navigate, editingExpense }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '', amount: '', category: '', type: 'expense',
    date: format(new Date(), 'yyyy-MM-dd'), notes: '', paymentMethod: 'upi',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    categoriesAPI.getAll().then(r => setCategories(r.data));
    if (editingExpense) {
      setForm({
        title: editingExpense.title || '',
        amount: editingExpense.amount || '',
        category: editingExpense.category || '',
        type: editingExpense.type || 'expense',
        date: format(new Date(editingExpense.date), 'yyyy-MM-dd'),
        notes: editingExpense.notes || '',
        paymentMethod: editingExpense.paymentMethod || 'upi',
      });
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.title || !form.amount || !form.category) {
      setError('Please fill in title, amount, and category.'); return;
    }
    try {
      setSaving(true);
      if (editingExpense) {
        await expensesAPI.update(editingExpense._id, form);
      } else {
        await expensesAPI.create(form);
      }
      navigate('transactions');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally { setSaving(false); }
  };

  const filteredCats = categories.filter(c => c.type === form.type || c.type === 'both');

  return (
    <div className="add-page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">{editingExpense ? 'Edit Entry' : 'Add Entry'}</h1>
          <p className="page-sub">Record a new transaction</p>
        </div>
        <button className="btn-ghost" onClick={() => navigate('transactions')}>← Back</button>
      </div>

      <div className="form-card">
        <div className="type-toggle">
          <button className={`toggle-btn ${form.type === 'expense' ? 'active-expense' : ''}`}
            onClick={() => setForm(f => ({ ...f, type: 'expense', category: '' }))}>
            ↓ Expense
          </button>
          <button className={`toggle-btn ${form.type === 'income' ? 'active-income' : ''}`}
            onClick={() => setForm(f => ({ ...f, type: 'income', category: '' }))}>
            ↑ Income
          </button>
        </div>

        <div className="form-grid">
          <div className="form-group full">
            <label>Title *</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Lunch at Café" />
          </div>
          <div className="form-group">
            <label>Amount (₹) *</label>
            <input name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="0.00" min="0.01" step="0.01" />
          </div>
          <div className="form-group">
            <label>Date *</label>
            <input name="date" type="date" value={form.date} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Category *</label>
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="">Select category</option>
              {filteredCats.map(c => <option key={c._id} value={c.name}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Payment Method</label>
            <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
              {paymentMethods.map(m => <option key={m} value={m}>{m.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div className="form-group full">
            <label>Notes (optional)</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Any additional details..." rows={3} />
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button className="btn-ghost" onClick={() => navigate('transactions')}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving...' : (editingExpense ? 'Update Entry' : 'Save Entry')}
          </button>
        </div>
      </div>
    </div>
  );
}