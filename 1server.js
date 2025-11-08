// 1server.js - COMPLETE BACKEND SERVER CODE

// Core dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 
const cors = require('cors'); 

const app = express();
const PORT = 3000; // Server runs on this port

// Middleware Setup
app.use(cors()); // Enables cross-origin requests from the front-end (localhost:5500)
app.use(bodyParser.json()); // Parses JSON bodies from POST requests
app.use(bodyParser.urlencoded({ extended: true }));

// ==========================================
// 1. DATABASE CONNECTION (MongoDB)
// ==========================================
const DB_URI = 'mongodb://localhost:27017/collegeDB'; 

mongoose.connect(DB_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// ==========================================
// 2. SCHEMA/MODEL DEFINITION
// ==========================================
// Defines the structure for a student application record
const applicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    course: { type: String, required: true },
    academics: String,
    status: { type: String, default: 'Pending' }, // Status: Pending, Approved, Rejected
    submittedAt: { type: Date, default: Date.now }
});

const Application = mongoose.model('Application', applicationSchema);

// ==========================================
// 3. API ROUTES
// ==========================================

// Route 1: Student submits a new application (POST)
app.post('/api/applications', async (req, res) => {
    try {
        const newApplication = new Application(req.body);
        await newApplication.save();
        console.log(`New application submitted: ${newApplication.name}`);
        res.status(201).send({ message: 'Application submitted successfully!', data: newApplication });
    } catch (error) {
        console.error('Submission error:', error);
        res.status(500).send({ message: 'Error submitting application', error });
    }
});

// Route 2: Admin fetches all applications (GET)
// Used by the front-end to list pending applications
app.get('/api/applications', async (req, res) => {
    try {
        // Fetch all applications (the frontend filters for 'Pending')
        const applications = await Application.find({});
        res.status(200).send(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).send({ message: 'Error fetching applications', error });
    }
});

// Route 3: Admin approves or rejects an application (PUT)
app.put('/api/applications/:id', async (req, res) => {
    const { status } = req.body; // status will be 'Approved' or 'Rejected'
    const validStatuses = ['Approved', 'Rejected'];

    if (!validStatuses.includes(status)) {
        return res.status(400).send({ message: 'Invalid status provided' });
    }

    try {
        // Find the application by its MongoDB ID and update its status
        const updatedApp = await Application.findByIdAndUpdate(
            req.params.id, 
            { status: status }, 
            { new: true } // Return the updated document
        );

        if (!updatedApp) {
            return res.status(404).send({ message: 'Application not found' });
        }
        console.log(`Application ${updatedApp.name} status updated to: ${status}`);
        res.status(200).send({ message: `Application ${status} successfully`, data: updatedApp });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).send({ message: 'Error updating application status', error });
    }
});


// ==========================================
// 4. START SERVER
// ==========================================
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});