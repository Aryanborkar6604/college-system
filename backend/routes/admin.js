const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const User = require('../models/User');
const StudentRecord = require('../models/StudentRecord');
const Application = require('../models/Application');
const Notice = require('../models/Notice');
const Exam = require('../models/Exam');

// @route   GET /api/admin/dashboard
// @desc    Get dashboard stats
// @access  Private/Admin
router.get('/dashboard', protect, admin, async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalApplications = await Application.countDocuments();
        const pendingApplications = await Application.countDocuments({ status: 'Pending' });

        const students = await User.find({ role: 'student' });
        let paidInFull = 0;
        let totalDue = 0;

        for (let student of students) {
            const record = await StudentRecord.findOne({ user: student._id });
            if (record) {
                if (record.finance.dueAmount === 0) paidInFull++;
                totalDue += record.finance.dueAmount;
            }
        }

        res.json({
            totalStudents,
            totalApplications,
            pendingApplications,
            paidInFull,
            outstandingDues: totalStudents - paidInFull
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/admin/students
// @desc    Get all students
// @access  Private/Admin
router.get('/students', protect, admin, async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/admin/applications
// @desc    Get all applications
// @access  Private/Admin
router.get('/applications', protect, admin, async (req, res) => {
    try {
        const applications = await Application.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/admin/applications/:id
// @desc    Approve or reject application
// @access  Private/Admin
router.put('/applications/:id', protect, admin, async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id);

        if (!application) return res.status(404).json({ message: 'Application not found' });

        application.status = status;
        await application.save();

        if (status === 'Approved') {
            // Provision student record
            const existingRecord = await StudentRecord.findOne({ user: application.user });
            if (!existingRecord) {
                await StudentRecord.create({
                    user: application.user,
                    attendanceDetails: [
                        { name: 'Financial Modeling', classes: 30, attended: 0, total: 30, percentage: 0 },
                        { name: 'Accounting I', classes: 20, attended: 0, total: 20, percentage: 0 },
                        { name: 'Investments', classes: 30, attended: 0, total: 30, percentage: 0 }
                    ]
                });
            }
            
            // Ensure user role is student
            await User.findByIdAndUpdate(application.user, { role: 'student' });
        }

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/admin/marks/:studentId
// @desc    Update student marks
// @access  Private/Admin
router.put('/marks/:studentId', protect, admin, async (req, res) => {
    try {
        const { marks } = req.body;
        let record = await StudentRecord.findOne({ user: req.params.studentId });
        
        if (!record) return res.status(404).json({ message: 'Record not found' });

        record.marks = { ...record.marks, ...marks };
        await record.save();

        res.json(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/admin/attendance/:studentId
// @desc    Update student attendance
// @access  Private/Admin
router.put('/attendance/:studentId', protect, admin, async (req, res) => {
    try {
        const { attendedClasses, totalClasses } = req.body;
        let record = await StudentRecord.findOne({ user: req.params.studentId });
        
        if (!record) return res.status(404).json({ message: 'Record not found' });

        const ratio = totalClasses > 0 ? attendedClasses / totalClasses : 0;
        
        record.attendedClasses = attendedClasses;
        record.totalClasses = totalClasses;
        
        // Update subject breakdowns proportionally
        record.attendanceDetails = record.attendanceDetails.map(sub => {
            const newAttended = Math.round(sub.total * ratio);
            const newPercentage = sub.total > 0 ? parseFloat(((newAttended / sub.total) * 100).toFixed(1)) : 0;
            return { ...sub.toObject(), attended: newAttended, percentage: newPercentage };
        });

        await record.save();
        res.json(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/admin/notices
// @desc    Create a notice
// @access  Private/Admin
router.post('/notices', protect, admin, async (req, res) => {
    try {
        const { title, content } = req.body;
        const notice = await Notice.create({
            title,
            content,
            date: new Date().toLocaleDateString(),
            postedBy: req.user.name
        });
        res.status(201).json(notice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

