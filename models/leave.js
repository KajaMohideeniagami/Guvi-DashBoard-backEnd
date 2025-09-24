const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  days: String,
  fromDate: String,
  toDate: String,
  reason: String,
});

module.exports = mongoose.model('leave', leaveSchema);
