const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['student', 'teacher', 'admin']
  },
  isEmailConfirmed: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('User', UserSchema);