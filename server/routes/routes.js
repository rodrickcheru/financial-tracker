const router = require('express').Router();

// 1. Import all Controllers at the top
const { addIncome, getIncomes, deleteIncome } = require('../controllers/incomeController');
const { addExpense, getExpenses, deleteExpense } = require('../controllers/expenseController');

// 2. Import Middleware
// NOTE: Ensure your middleware file is named 'authMiddleware.js' 
// and the function inside is named 'protect'
const { protect } = require('../middleware/authMiddleware');

// --- ROUTES ---

// Income Routes
router.post('/add-income', protect, addIncome);
router.get('/get-incomes', protect, getIncomes);
router.delete('/delete-income/:id', protect, deleteIncome); 

// Expense Routes
router.post('/add-expense', protect, addExpense);
router.get('/get-expenses', protect, getExpenses);
router.delete('/delete-expense/:id', protect, deleteExpense);


module.exports = router;