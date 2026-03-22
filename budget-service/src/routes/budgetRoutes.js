const express = require('express');
const { setBudget, getBudget, addExpense, deleteExpense, getExpenses, getBudgetReport } = require('../controllers/budgetController');
const { authMiddleware, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Organizer / Admin routes
router.post('/', [authMiddleware, authorizeRoles('ORGANIZER', 'ADMIN')], setBudget);
router.post('/expense', [authMiddleware, authorizeRoles('ORGANIZER', 'ADMIN')], addExpense);
router.delete('/expense/:id', [authMiddleware, authorizeRoles('ORGANIZER', 'ADMIN')], deleteExpense);

// Read routes 
router.get('/event/:eventId', authMiddleware, getBudget);
router.get('/:budgetId/expenses', authMiddleware, getExpenses);
router.get('/event/:eventId/report', authMiddleware, getBudgetReport);

module.exports = router;
