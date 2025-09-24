const express = require('express');
const router = express.Router();
const Leave = require('../models/leave');

// @route POST /api/leave
router.post('/leave', async (req, res) => {
  try {
    const { days, fromDate, toDate, reason } = req.body;
    const newLeave = new Leave({ days, fromDate, toDate, reason });
    await newLeave.save();
    res.status(201).json({ message: 'Leave application submitted', data: newLeave });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// @route GET /api/leave
router.get('/leave', async (req, res) => {
  try {
    const leaves = await Leave.find();
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaves' });
  }
});

module.exports = router;
