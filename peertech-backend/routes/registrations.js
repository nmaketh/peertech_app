const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    competition: { type: mongoose.Schema.Types.ObjectId, ref: 'Competition', required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Registration', RegistrationSchema);