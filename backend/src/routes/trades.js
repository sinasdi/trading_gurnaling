const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

// Get all trades
router.get('/', authenticate, async (req, res) => {
  try {
    const { symbol, status, strategy, startDate, endDate, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM trades WHERE user_id = $1';
    const params = [req.user.id];
    let paramCount = 2;
    
    if (symbol) {
      query += ` AND symbol ILIKE $${paramCount}`;
      params.push(`%${symbol}%`);
      paramCount++;
    }
    
    if (status) {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }
    
    if (strategy) {
      query += ` AND strategy ILIKE $${paramCount}`;
      params.push(`%${strategy}%`);
      paramCount++;
    }
    
    if (startDate) {
      query += ` AND entry_date >= $${paramCount}`;
      params.push(startDate);
      paramCount++;
    }
    
    if (endDate) {
      query += ` AND entry_date <= $${paramCount}`;
      params.push(endDate);
      paramCount++;
    }
    
    query += ` ORDER BY entry_date DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);
    
    const result = await db.query(query, params);
    
    res.json({
      trades: result.rows,
      total: result.rows.length,
      page,
      limit
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch trades' });
  }
});

// Create trade
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      symbol,
      entryPrice,
      exitPrice,
      quantity,
      riskAmount,
      rewardAmount,
      strategy,
      notes,
      entryDate,
      exitDate
    } = req.body;
    
    // Calculate P&L
    const pnl = exitPrice ? (exitPrice - entryPrice) * quantity : null;
    
    const result = await db.query(
      `INSERT INTO trades (
        user_id, symbol, entry_price, exit_price, quantity,
        risk_amount, reward_amount, pnl, strategy, notes,
        entry_date, exit_date, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        req.user.id,
        symbol,
        entryPrice,
        exitPrice || null,
        quantity,
        riskAmount,
        rewardAmount,
        pnl,
        strategy,
        notes,
        entryDate,
        exitDate || null,
        exitDate ? 'CLOSED' : 'OPEN'
      ]
    );
    
    res.status(201).json({
      message: 'Trade created successfully',
      trade: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create trade' });
  }
});

// Update trade
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { exitPrice, exitDate, notes } = req.body;
    
    // Calculate new P&L
    const tradeResult = await db.query('SELECT * FROM trades WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (tradeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Trade not found' });
    }
    
    const trade = tradeResult.rows[0];
    const pnl = exitPrice ? (exitPrice - trade.entry_price) * trade.quantity : null;
    
    const result = await db.query(
      `UPDATE trades SET
        exit_price = COALESCE($1, exit_price),
        exit_date = COALESCE($2, exit_date),
        pnl = COALESCE($3, pnl),
        notes = COALESCE($4, notes),
        status = CASE WHEN $2 IS NOT NULL THEN 'CLOSED' ELSE status END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5 AND user_id = $6
      RETURNING *`,
      [exitPrice, exitDate, pnl, notes, id, req.user.id]
    );
    
    res.json({
      message: 'Trade updated successfully',
      trade: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update trade' });
  }
});

// Delete trade
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'DELETE FROM trades WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Trade not found' });
    }
    
    res.json({ message: 'Trade deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete trade' });
  }
});

module.exports = router;
