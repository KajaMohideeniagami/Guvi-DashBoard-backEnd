// const express = require('express');
// const router = express.Router();
// const Leave = require('../models/leave');

// // @route POST /api/leave
// router.post('/leave', async (req, res) => {
//   try {
//     const { days, fromDate, toDate, reason } = req.body;
//     const newLeave = new Leave({ days, fromDate, toDate, reason });
//     await newLeave.save();
//     res.status(201).json({ message: 'Leave application submitted', data: newLeave });
//   } catch (error) {
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// });

// // @route GET /api/leave
// router.get('/leave', async (req, res) => {
//   try {
//     const leaves = await Leave.find();
//     res.json(leaves);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch leaves' });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Leave = require("../models/leave");
const jwt = require("jsonwebtoken");

// ✅ Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// ✅ POST /api/leave → Apply for leave (Protected)
router.post("/leave", verifyToken, async (req, res) => {
  try {
    const { days, fromDate, toDate, reason } = req.body;

    if (!days || !fromDate || !toDate || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newLeave = new Leave({
      days,
      fromDate,
      toDate,
      reason,
      userId: req.user.id, // store logged-in user ID
    });

    await newLeave.save();
    res.status(201).json({
      message: "Leave application submitted successfully",
      leave: newLeave,
    });
  } catch (error) {
    console.error("Leave submission error:", error);
    res.status(500).json({ message: "Error submitting leave", error: error.message });
  }
});

// ✅ GET /api/leave → Get user’s leave records (Protected)
router.get("/leave", verifyToken, async (req, res) => {
  try {
    // Show only the logged-in user’s leaves
    const leaves = await Leave.find({ userId: req.user.id });
    res.json(leaves);
  } catch (error) {
    console.error("Fetch leave error:", error);
    res.status(500).json({ message: "Failed to fetch leaves", error: error.message });
  }
});

module.exports = router;
