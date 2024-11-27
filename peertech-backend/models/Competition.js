const mongoose = require('mongoose');

const CompetitionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  organizer: {
    type: String,
    required: true
  },
  endsIn: {
    type: Date,
    required: true
  },
  participants: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Competition', CompetitionSchema);