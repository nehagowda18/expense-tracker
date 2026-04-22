const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

const defaultCategories = [
  { name: 'Food & Dining', icon: '🍔', color: '#f59e0b', type: 'expense' },
  { name: 'Transport', icon: '🚗', color: '#3b82f6', type: 'expense' },
  { name: 'Shopping', icon: '🛍️', color: '#ec4899', type: 'expense' },
  { name: 'Bills & Utilities', icon: '💡', color: '#8b5cf6', type: 'expense' },
  { name: 'Healthcare', icon: '🏥', color: '#ef4444', type: 'expense' },
  { name: 'Entertainment', icon: '🎮', color: '#06b6d4', type: 'expense' },
  { name: 'Education', icon: '📚', color: '#10b981', type: 'expense' },
  { name: 'Travel', icon: '✈️', color: '#f97316', type: 'expense' },
  { name: 'Salary', icon: '💼', color: '#22c55e', type: 'income' },
  { name: 'Freelance', icon: '💻', color: '#6366f1', type: 'income' },
  { name: 'Investment', icon: '📈', color: '#14b8a6', type: 'income' },
  { name: 'Other', icon: '📦', color: '#6b7280', type: 'both' },
];

// GET /api/categories - Get all categories
router.get('/', async (req, res) => {
  try {
    let categories = await Category.find().sort({ name: 1 });
    if (categories.length === 0) {
      categories = await Category.insertMany(defaultCategories);
    }
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/categories - Create category
router.post('/', async (req, res) => {
  try {
    const category = new Category(req.body);
    const saved = await category.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/categories/:id - Delete category
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
