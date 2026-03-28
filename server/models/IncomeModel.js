const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
    source: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    amount: {
        type: Number,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    // This stores the specific icon/emoji picked from your new sticker-picker
    icon: {
        type: String,
        default: '💰',
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Income', IncomeSchema);