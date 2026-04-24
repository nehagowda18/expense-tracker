import React, { useEffect, useState } from 'react';
import { categoriesAPI } from '../api';
import './Categories.css';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', icon: '📦', color: '#7c6af7', type: 'both' });
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try { const res = await categoriesAPI.getAll(); setCategories(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAdd = async () => {
    if (!form.name) return;
    try {
      setAdding(true);
      await categoriesAPI.create(form);
      setForm({ name: '', icon: '📦', color: '#7c6af7', type: 'both' });
      fetchCategories();
    } catch (err) { alert(err.response?.data?.message || 'Error adding category'); }
    finally { setAdding(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await categoriesAPI.delete(id);
    fetchCategories();
  };

  return (
    <div className="categories-page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-sub">{categories.length} categories</p>
        </div>
      </div>

      <div className="add-cat-card">
        <h2 className="section-title">Add New Category</h2>
        <div className="cat-form">
          <input placeholder="Category name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <input placeholder="Icon (emoji)" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} style={{ width: 80 }} />
          <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} style={{ width: 50, padding: 4, cursor: 'pointer' }} />
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
            <option value="both">Both</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <button className="btn-primary" onClick={handleAdd} disabled={adding}>{adding ? '...' : 'Add'}</button>
        </div>
      </div>

      {loading ? <div className="loading-state"><div className="spinner" /></div> : (
        <div className="cat-grid">
          {categories.map(cat => (
            <div key={cat._id} className="cat-card">
              <div className="cat-icon" style={{ background: cat.color + '22', color: cat.color }}>{cat.icon}</div>
              <div className="cat-info">
                <p className="cat-name">{cat.name}</p>
                <p className="cat-type">{cat.type}</p>
              </div>
              <button className="action-btn del" onClick={() => handleDelete(cat._id)}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}