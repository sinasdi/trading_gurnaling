const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

// Get overall summary
router.get('/summary', authenticate, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        COUNT(*) as total_trades,
        COUNT(CASE WHEN pnl > 0 THEN 1 END) as winning_trades,
        COUNT(CASE WHEN pnl < 0 THEN 1 END) as losing_trades,
        COUNT(CASE WHEN status = 'CLOSED' THEN 1 END) as closed_trades,
        COUNT(CASE WHEN status = 'OPEN' THEN 1 END) as open_trades,
        COALESCE(SUM(pnl), 0) as total_pnl,
        COALESCE(AVG(pnl), 0) as average_pnl,
        COALESCE(MAX(pnl), 0) as best_trade,
        COALESCE(MIN(pnl), 0) as worst_trade,
        ROUND(100.0 * COUNT(CASE WHEN pnl > 0 THEN 1 END) / NULLIF(COUNT(*), 0), 2) as win_rate
      FROM trades
      WHERE user_id = $1 AND status = 'CLOSED'
    `, [req.user.id]);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// Get strategy breakdown
router.get('/by-strategy', authenticate, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        strategy,
        COUNT(*) as total_trades,
        COUNT(CASE WHEN pnl > 0 THEN 1 END) as winning_trades,
        COALESCE(SUM(pnl), 0) as total_pnl,
        ROUND(100.0 * COUNT(CASE WHEN pnl > 0 THEN 1 END) / NULLIF(COUNT(*), 0), 2) as win_rate
      FROM trades
      WHERE user_id = $1 AND status = 'CLOSED'
      GROUP BY strategy
      ORDER BY total_pnl DESC
    `, [req.user.id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch strategy breakdown' });
  }
});

// Get performance milestone (every 100 trades)
router.get('/performance-milestone', authenticate, async (req, res) => {
  try {
    const countResult = await db.query(
      'SELECT COUNT(*) as total FROM trades WHERE user_id = $1 AND status = \'CLOSED\'',
      [req.user.id]
    );
    
    const totalTrades = parseInt(countResult.rows[0].total);
    const milestones = Math.floor(totalTrades / 100);
    
    if (milestones === 0) {
      return res.json({
        milestone: 0,
        nextMilestone: 100,
        tradesUntilMilestone: 100 - totalTrades,
        message: `Complete ${100 - totalTrades} more trades to reach first milestone`
      });
    }
    
    const startTrade = (milestones - 1) * 100;
    
    const result = await db.query(`
      SELECT
        COUNT(*) as total_trades,
        COUNT(CASE WHEN pnl > 0 THEN 1 END) as winning_trades,
        COUNT(CASE WHEN pnl < 0 THEN 1 END) as losing_trades,
        COALESCE(SUM(pnl), 0) as total_pnl,
        COALESCE(AVG(pnl), 0) as average_pnl,
        COALESCE(MAX(pnl), 0) as best_trade,
        COALESCE(MIN(pnl), 0) as worst_trade,
        ROUND(100.0 * COUNT(CASE WHEN pnl > 0 THEN 1 END) / NULLIF(COUNT(*), 0), 2) as win_rate,
        COALESCE(AVG(CASE WHEN pnl > 0 THEN pnl END), 0) as average_win,
        COALESCE(AVG(CASE WHEN pnl < 0 THEN pnl END), 0) as average_loss,
        ROUND(COALESCE(AVG(CASE WHEN pnl > 0 THEN pnl END), 0) / NULLIF(ABS(COALESCE(AVG(CASE WHEN pnl < 0 THEN pnl END), 0)), 0), 2) as risk_reward_ratio
      FROM (
        SELECT pnl FROM trades
        WHERE user_id = $1 AND status = 'CLOSED'
        ORDER BY entry_date DESC
        LIMIT 100 OFFSET $2
      ) as last_hundred
    `, [req.user.id, startTrade]);
    
    res.json({
      milestone: milestones,
      totalTradesSoFar: totalTrades,
      statistics: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch performance milestone' });
  }
});

// Get detailed P&L report
router.get('/report', authenticate, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = 'SELECT * FROM trades WHERE user_id = $1 AND status = \'CLOSED\'';
    const params = [req.user.id];
    
    if (startDate) {
      query += ' AND entry_date >= $' + (params.length + 1);
      params.push(startDate);
    }
    
    if (endDate) {
      query += ' AND entry_date <= $' + (params.length + 1);
      params.push(endDate);
    }
    
    query += ' ORDER BY entry_date DESC';
    
    const result = await db.query(query, params);
    
    res.json({
      trades: result.rows,
      summary: {
        totalTrades: result.rows.length,
        totalPnL: result.rows.reduce((sum, t) => sum + (t.pnl || 0), 0),
        winRate: Math.round((result.rows.filter(t => t.pnl > 0).length / result.rows.length) * 100)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

module.module = router;
