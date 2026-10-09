const mongoose = require('mongoose');

const studentRecordSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    marks: {
        Financial_Modeling: { type: Number, default: 0 },
        Accounting_I: { type: Number, default: 0 },
        Investments: { type: Number, default: 0 }
    },
    finance: {
        totalFee: { type: Number, default: 15000 },
        paidFee: { type: Number, default: 0 },
        dueAmount: { type: Number, default: 15000 },
        dueDeadline: { type: String, default: '2025-01-15' },
        transactions: [{
            id: String,
            date: String,
            description: String,
            amount: Number,
            status: String
        }]
    },
    attendedClasses: { type: Number, default: 0 },
    totalClasses: { type: Number, default: 0 },
    attendanceDetails: [{
        name: String,
        classes: Number,
        attended: Number,
        total: Number,
        percentage: Number
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('StudentRecord', studentRecordSchema);

