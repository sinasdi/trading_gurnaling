const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { validateRegister, validateLogin } = require('../validators');

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    
    // Validation
    const { error } = validateRegister({ email, password, username });
    if (error) return res.status(400).json({ error: error.details[0].message });
    
    // Check if user exists
    const user = await db.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (user.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user
    const result = await db.query(
      'INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING id, email, username',
      [email, passwordHash, username]
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    const { error } = validateLogin({ email, password });
    if (error) return res.status(400).json({ error: error.details[0].message });
    
    // Find user
    const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user.rows[0].id, email: user.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.rows[0].id,
        email: user.rows[0].email,
        username: user.rows[0].username
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
