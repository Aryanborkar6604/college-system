const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const StudentRecord = require('../models/StudentRecord');
const Application = require('../models/Application');
const Notice = require('../models/Notice');
const Exam = require('../models/Exam');

// @route   GET /api/students/record
// @desc    Get current student's record
// @access  Private
router.get('/record', protect, async (req, res) => {
    try {
        let record = await StudentRecord.findOne({ user: req.user._id });
        if (!record) {
            // Return empty structure if not found
            return res.json({
                marks: {},
                finance: { dueAmount: 15000, paidFee: 0, totalFee: 15000, transactions: [] },
                attendanceDetails: [],
                totalClasses: 0,
                attendedClasses: 0
            });
        }
        res.json(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/students/application
// @desc    Get current student's application
// @access  Private
router.get('/application', protect, async (req, res) => {
    try {
        const application = await Application.findOne({ user: req.user._id });
        res.json(application || null);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/students/application
// @desc    Submit an application
// @access  Private
router.post('/application', protect, async (req, res) => {
    try {
        const { course, statement } = req.body;
        
        let application = await Application.findOne({ user: req.user._id });
        if (application) {
            return res.status(400).json({ message: 'Application already exists' });
        }

        application = await Application.create({
            user: req.user._id,
            name: req.user.name,
            email: req.user.email,
            course,
            statement
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/students/finance/pay
// @desc    Make a fee payment
// @access  Private
router.post('/finance/pay', protect, async (req, res) => {
    try {
        const { amount } = req.body;
        const record = await StudentRecord.findOne({ user: req.user._id });

        if (!record) return res.status(404).json({ message: 'Student record not found' });
        if (amount > record.finance.dueAmount) return res.status(400).json({ message: 'Amount exceeds due balance' });

        record.finance.paidFee += amount;
        record.finance.dueAmount -= amount;
        record.finance.transactions.push({
            id: 'TRX' + Date.now(),
            date: new Date().toLocaleDateString(),
            description: 'Fee Payment',
            amount,
            status: 'Paid'
        });

        await record.save();
        res.json(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/students/notices
// @desc    Get all notices
// @access  Private
router.get('/notices', protect, async (req, res) => {
    try {
        const notices = await Notice.find().sort({ createdAt: -1 });
        res.json(notices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/students/exams
// @desc    Get exam timetable
// @access  Private
router.get('/exams', protect, async (req, res) => {
    try {
        const exams = await Exam.find().sort({ date: 1 });
        res.json(exams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

