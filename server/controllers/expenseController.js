const ExpenseSchema = require('../models/ExpenseModel');

// @desc    Add a new expense
// @route   POST /api/v1/add-expense
exports.addExpense = async (req, res) => {
    // Removed 'icon' from destructuring since we are using a default
    const { category, amount, date } = req.body;

    try {
        // Basic Validation
        if (!category || !amount || !date) {
            return res.status(400).json({ message: 'All fields are required!' });
        }
        
        // Create expense with hardcoded default icon
        const expense = new ExpenseSchema({
            category,
            amount,
            date,
            icon: '💸',
            userId: req.user.id 
        });

        await expense.save();
        res.status(200).json({ message: 'Expense Added Successfully' });
    } catch (error) {
        console.error("Add Expense Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all expenses for the logged-in user
// @route   GET /api/v1/get-expenses
exports.getExpenses = async (req, res) => {
    try {
        // Find expenses belonging to the user, sorted by date (newest first)
        const expenses = await ExpenseSchema.find({ userId: req.user.id }).sort({ date: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        console.error("Get Expenses Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a specific expense
// @route   DELETE /api/v1/delete-expense/:id
exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Ensure we only delete the expense if it belongs to the current user
        const expense = await ExpenseSchema.findOneAndDelete({ 
            _id: id, 
            userId: req.user.id 
        });

        if (!expense) {
            return res.status(404).json({ message: "Expense not found or unauthorized" });
        }

        res.status(200).json({ message: 'Expense Deleted Successfully' });
    } catch (error) {
        console.error("Delete Expense Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};