// const express = require("express");
// const User = require("../models/User");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const router = express.Router();

// // ✅ REGISTER USER (With password encryption)
// router.post("/register", async (req, res) => {
//   console.log("register-request", req.body);

//   try {
//     const { firstName, lastName, email, username, password } = req.body;

//     if (!firstName || !lastName || !email || !username || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.status(400).json({ message: "Username already taken" });
//     }

//     // 🔹 Hash password before saving
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Save user with hashed password
//     const newUser = new User({ 
//       firstName, 
//       lastName, 
//       email, 
//       username, 
//       password: hashedPassword 
//     });

//     await newUser.save();
//     console.log("✅ User registered:", newUser);

//     res.status(201).json({ message: "User registered successfully!" });
//   } catch (error) {
//     console.error("❌ Error registering user:", error);
//     res.status(500).json({ message: "Error registering user", error: error.message });
//   }
// });

// // ✅ LOGIN USER (With password verification)
// router.post("/login", async (req, res) => {
//   console.log("🔍 Received login request:", req.body);

//   try {
//     const { username, password } = req.body;
    
//     if (!username || !password) {
//       console.error("❌ Missing username or password");
//       return res.status(400).json({ message: "Username and password are required" });
//     }

//     console.log("📥 Login request for:", username);

//     // 🔹 Find user in DB
//     const user = await User.findOne({ username });

//     if (!user) {
//       console.error("❌ User not found:", username);
//       return res.status(400).json({ message: "Invalid username or password" });
//     }

//     console.log("🔹 Found user:", user);

//     // 🔹 Compare hashed passwords
//     const isMatch = bcrypt.compare(password, user.password);
//     console.log("🔹 Password match result:", isMatch);

//     if (!isMatch) {
//       console.error("❌ Incorrect password for:", username);
//       return res.status(400).json({ message: "Invalid username or password" });
//     }

//     // 🔹 Generate JWT Token
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

//     console.log("✅ Login successful:", username);
//     res.json({ token, message: "Login successful" });
//   } catch (error) {
//     console.error("❌ Login error:", error);
//     res.status(500).json({ message: "Login error", error: error.message });
//   }
// });

// module.exports = router;


// routes/authRoutes.js
const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();

// ✅ REGISTER USER
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or username already taken" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token immediately after registration
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({
      message: "User registered successfully!",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ LOGIN USER
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
