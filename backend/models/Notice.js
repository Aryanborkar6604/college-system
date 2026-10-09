const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: String
    },
    postedBy: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notice', noticeSchema);

