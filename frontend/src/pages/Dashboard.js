import React, { useEffect, useState } from 'react';
import { expensesAPI } from '../api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { format, subDays } from 'date-fns';
import './Dashboard.css';

const COLORS = ['#7c6af7', '#f7c26a', '#34d399', '#f87171', '#06b6d4', '#ec4899', '#f97316', '#8b5cf6'];

export default function Dashboard({ navigate }) {
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0, categoryBreakdown: [] });
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryRes, recentRes] = await Promise.all([
        expensesAPI.getSummary(),
        expensesAPI.getAll({ limit: 5 }),
      ]);
      setSummary(summaryRes.data);
      setRecentExpenses(recentRes.data.expenses);

      const weekly = [];
      for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dayStr = format(date, 'EEE');
        const start = format(date, 'yyyy-MM-dd') + 'T00:00:00.000Z';
        const end = format(date, 'yyyy-MM-dd') + 'T23:59:59.999Z';
        const res = await expensesAPI.getSummary({ startDate: start, endDate: end });
        weekly.push({ day: dayStr, expense: res.data.expense, income: res.data.income });
      }
      setWeeklyData(weekly);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  return (
    <div className="dashboard fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">{format(new Date(), 'MMMM yyyy')}</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('add')}>+ Add Entry</button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading your finances...</p>
        </div>
      ) : (
        <>
          <div className="stat-cards">
            <div className="stat-card income-card">
              <p className="stat-label">Total Income</p>
              <p className="stat-value income-value">{fmt(summary.income)}</p>
              <span className="stat-badge">↑ This period</span>
            </div>
            <div className="stat-card expense-card">
              <p className="stat-label">Total Expenses</p>
              <p className="stat-value expense-value">{fmt(summary.expense)}</p>
              <span className="stat-badge">↓ This period</span>
            </div>
            <div className={`stat-card balance-card ${summary.balance >= 0 ? 'positive' : 'negative'}`}>
              <p className="stat-label">Net Balance</p>
              <p className="stat-value balance-value">{fmt(summary.balance)}</p>
              <span className="stat-badge">{summary.balance >= 0 ? '✓ Surplus' : '⚠ Deficit'}</span>
            </div>
          </div>

          <div className="charts-row">
            <div className="chart-card">
              <h2 className="chart-title">Weekly Activity</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" tick={{ fill: '#9090b0', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#9090b0', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1a1a26', border: '1px solid #2a2a3d', borderRadius: 8, color: '#e8e8f0' }}
                    formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, '']}
                  />
                  <Bar dataKey="income" fill="#34d399" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="#f87171" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="chart-legend">
                <span><span className="dot" style={{ background: '#34d399' }} /> Income</span>
                <span><span className="dot" style={{ background: '#f87171' }} /> Expense</span>
              </div>
            </div>

            <div className="chart-card">
              <h2 className="chart-title">Expense Breakdown</h2>
              {summary.categoryBreakdown.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={summary.categoryBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                        dataKey="total" nameKey="_id" paddingAngle={3}>
                        {summary.categoryBreakdown.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: '#1a1a26', border: '1px solid #2a2a3d', borderRadius: 8, color: '#e8e8f0' }}
                        formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pie-legend">
                    {summary.categoryBreakdown.slice(0, 4).map((c, i) => (
                      <div key={c._id} className="pie-legend-item">
                        <span className="dot" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="pie-cat">{c._id}</span>
                        <span className="pie-val">₹{c.total.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="empty-chart">
                  <p>No expense data yet.</p>
                  <button className="btn-ghost" onClick={() => navigate('add')}>Add your first expense</button>
                </div>
              )}
            </div>
          </div>

          <div className="recent-section">
            <div className="section-header">
              <h2 className="chart-title">Recent Transactions</h2>
              <button className="btn-ghost" onClick={() => navigate('transactions')}>View all →</button>
            </div>
            {recentExpenses.length === 0 ? (
              <div className="empty-state">
                <p>No transactions yet. Start tracking!</p>
                <button className="btn-primary" onClick={() => navigate('add')}>+ Add First Entry</button>
              </div>
            ) : (
              <div className="transaction-list">
                {recentExpenses.map((e) => (
                  <div key={e._id} className="transaction-row">
                    <div className="tx-left">
                      <div className="tx-icon">{e.type === 'income' ? '↑' : '↓'}</div>
                      <div>
                        <p className="tx-title">{e.title}</p>
                        <p className="tx-meta">{e.category} · {format(new Date(e.date), 'dd MMM yyyy')}</p>
                      </div>
                    </div>
                    <p className={`tx-amount ${e.type === 'income' ? 'income-text' : 'expense-text'}`}>
                      {e.type === 'income' ? '+' : '-'}{fmt(e.amount)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}