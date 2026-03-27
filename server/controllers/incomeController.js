const IncomeSchema = require("../models/IncomeModel");

// 1. Add a new income entry
exports.addIncome = async (req, res) => {
    // Added 'icon' here so your emoji selection works!
    const { source, amount, date, icon } = req.body;

    if (!source || !amount || !date) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    try {
        const income = new IncomeSchema({
            source,
            amount,
            date,
            icon: icon || '💰', // Default icon if none provided
            userId: req.user.id 
        });
        await income.save();
        res.status(200).json({ message: "Income Added Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// 2. Get all incomes for the logged-in user
exports.getIncomes = async (req, res) => {
    try {
        const incomes = await IncomeSchema.find({ userId: req.user.id }).sort({ date: 1 });
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// 3. THE MISSING PIECE: Delete income
exports.deleteIncome = async (req, res) => {
    const { id } = req.params;
    try {
        // Ensure we only delete income belonging to the logged-in user
        const income = await IncomeSchema.findOneAndDelete({ 
            _id: id, 
            userId: req.user.id 
        });

        if (!income) {
            return res.status(404).json({ message: "Income entry not found" });
        }

        res.status(200).json({ message: "Income Deleted Successfully" });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ message: "Server Error: Could not delete" });
    }
};