const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    },
    questionUrl: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Exam', examSchema);

