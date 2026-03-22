const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

const setBudget = async (req, res) => {
    try {
        const { eventId, totalBudget } = req.body;
        
        let budget = await Budget.findOne({ where: { eventId } });
        if (budget) {
            budget.totalBudget = totalBudget;
            await budget.save();
        } else {
            budget = await Budget.create({ eventId, totalBudget });
        }
        res.status(200).json(budget);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBudget = async (req, res) => {
    try {
        const { eventId } = req.params;
        const budget = await Budget.findOne({ where: { eventId } });
        if (!budget) return res.status(404).json({ message: 'Budget not found for this event' });
        res.json(budget);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addExpense = async (req, res) => {
    try {
        const { budgetId, category, amount, description, expenseDate } = req.body;
        
        const expense = await Expense.create({
            budgetId,
            category,
            amount,
            description,
            expenseDate
        });
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getExpenses = async (req, res) => {
    try {
        const { budgetId } = req.params;
        const expenses = await Expense.findAll({ where: { budgetId }, order: [['expenseDate', 'DESC']] });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBudgetReport = async (req, res) => {
    try {
        const { eventId } = req.params;
        const budget = await Budget.findOne({ where: { eventId } });
        if (!budget) return res.status(404).json({ message: 'Budget not found' });

        const expenses = await Expense.findAll({ where: { budgetId: budget.id } });
        const totalSpent = expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        const remaining = parseFloat(budget.totalBudget) - totalSpent;

        res.json({
            eventId,
            budgetId: budget.id,
            totalBudget: budget.totalBudget,
            totalSpent,
            remaining,
            expensesCount: expenses.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await Expense.findByPk(id);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });
        
        await expense.destroy();
        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { setBudget, getBudget, addExpense, deleteExpense, getExpenses, getBudgetReport };
