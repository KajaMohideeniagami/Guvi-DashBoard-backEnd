// models/queryModel.js
const mongoose = require('mongoose');

// Define the query schema
const querySchema = new mongoose.Schema({
  problem: { type: String, required: true },
  availability: { type: Date, required: true },
}, { timestamps: true });  // Timestamps will automatically add createdAt and updatedAt

// Create the Query model
const Query = mongoose.model('Query', querySchema);

module.exports = Query;
