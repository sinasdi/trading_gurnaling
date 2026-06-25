const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../db');
const { authenticate } = require('../middleware/auth');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Upload screenshot
router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    const { tradeId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Verify trade belongs to user
    const trade = await db.query(
      'SELECT * FROM trades WHERE id = $1 AND user_id = $2',
      [tradeId, req.user.id]
    );
    
    if (trade.rows.length === 0) {
      return res.status(404).json({ error: 'Trade not found' });
    }
    
    // Save screenshot reference
    const result = await db.query(
      `INSERT INTO screenshots (trade_id, file_path)
       VALUES ($1, $2)
       RETURNING *`,
      [tradeId, `/uploads/${req.file.filename}`]
    );
    
    res.status(201).json({
      message: 'Screenshot uploaded successfully',
      screenshot: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Get trade screenshots
router.get('/:tradeId', authenticate, async (req, res) => {
  try {
    const { tradeId } = req.params;
    
    // Verify trade belongs to user
    const trade = await db.query(
      'SELECT * FROM trades WHERE id = $1 AND user_id = $2',
      [tradeId, req.user.id]
    );
    
    if (trade.rows.length === 0) {
      return res.status(404).json({ error: 'Trade not found' });
    }
    
    const result = await db.query(
      'SELECT * FROM screenshots WHERE trade_id = $1 ORDER BY uploaded_at DESC',
      [tradeId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch screenshots' });
  }
});

// Delete screenshot
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    const screenshot = await db.query('SELECT * FROM screenshots WHERE id = $1', [id]);
    if (screenshot.rows.length === 0) {
      return res.status(404).json({ error: 'Screenshot not found' });
    }
    
    // Verify ownership through trade
    const trade = await db.query(
      'SELECT * FROM trades WHERE id = $1 AND user_id = $2',
      [screenshot.rows[0].trade_id, req.user.id]
    );
    
    if (trade.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    await db.query('DELETE FROM screenshots WHERE id = $1', [id]);
    
    res.json({ message: 'Screenshot deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete screenshot' });
  }
});

module.exports = router;
