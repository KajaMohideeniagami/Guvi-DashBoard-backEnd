// // routes/queryRoutes.js
// const express = require('express');
// const Query = require('../models/queryModel');

// const router = express.Router();

// // Route to get all queries
// router.get('/queries', async (req, res) => {
//   try {
//     const queries = await Query.find();  // Retrieve all queries from the database
//     res.json(queries);
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching queries', error: err.message });
//   }
// });

// // Route to create a new query
// router.post('/queries', async (req, res) => {
//   const { problem, availability } = req.body;

//   try {
//     // Create a new query document in the database
//     const newQuery = new Query({ problem, availability });

//     // Save the new query and return it in the response
//     await newQuery.save();
//     res.status(201).json(newQuery);  // Created status
//   } catch (err) {
//     res.status(400).json({ message: 'Error creating query', error: err.message });
//   }
// });

// module.exports = router;


const express = require("express");
const jwt = require("jsonwebtoken");
const Query = require("../models/queryModel");

const router = express.Router();

// ✅ Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info (from login)
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// ✅ POST /api/queries → Create a query (Protected)
router.post("/queries", verifyToken, async (req, res) => {
  const { problem, availability } = req.body;

  try {
    if (!problem || !availability) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newQuery = new Query({
      problem,
      availability,
      userId: req.user.id, // link to logged-in user
    });

    await newQuery.save();
    res.status(201).json({
      message: "Query submitted successfully",
      query: newQuery,
    });
  } catch (err) {
    console.error("Error creating query:", err);
    res.status(400).json({ message: "Error creating query", error: err.message });
  }
});

// ✅ GET /api/queries → Get user’s own queries (Protected)
router.get("/queries", verifyToken, async (req, res) => {
  try {
    const queries = await Query.find({ userId: req.user.id });
    res.json(queries);
  } catch (err) {
    console.error("Error fetching queries:", err);
    res.status(500).json({ message: "Error fetching queries", error: err.message });
  }
});

module.exports = router;
