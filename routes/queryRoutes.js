// routes/queryRoutes.js
const express = require('express');
const Query = require('../models/queryModel');

const router = express.Router();

// Route to get all queries
router.get('/queries', async (req, res) => {
  try {
    const queries = await Query.find();  // Retrieve all queries from the database
    res.json(queries);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching queries', error: err.message });
  }
});

// Route to create a new query
router.post('/queries', async (req, res) => {
  const { problem, availability } = req.body;

  try {
    // Create a new query document in the database
    const newQuery = new Query({ problem, availability });

    // Save the new query and return it in the response
    await newQuery.save();
    res.status(201).json(newQuery);  // Created status
  } catch (err) {
    res.status(400).json({ message: 'Error creating query', error: err.message });
  }
});

module.exports = router;
