import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ token }) => {
  const [trades, setTrades] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ symbol: '', status: '' });

  useEffect(() => {
    fetchTrades();
    fetchSummary();
  }, []);

  const fetchTrades = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/trades`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: filters
        }
      );
      setTrades(response.data.trades);
    } catch (error) {
      console.error('Error fetching trades:', error);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/analytics/summary`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSummary(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching summary:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">📊 Dashboard</h1>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Trades</p>
            <p className="text-3xl font-bold text-blue-600">{summary.total_trades}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Win Rate</p>
            <p className="text-3xl font-bold text-green-600">{summary.win_rate}%</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total P&L</p>
            <p className={`text-3xl font-bold ${summary.total_pnl > 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${summary.total_pnl?.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Best Trade</p>
            <p className="text-3xl font-bold text-green-600">${summary.best_trade?.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Worst Trade</p>
            <p className="text-3xl font-bold text-red-600">${summary.worst_trade?.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Symbol"
            value={filters.symbol}
            onChange={(e) => setFilters({ ...filters, symbol: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
          </select>
          <button
            onClick={fetchTrades}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* Trades Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-800">Symbol</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-800">Entry</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-800">Exit</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-800">Qty</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-800">P&L</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-800">Status</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-800">Date</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold">{trade.symbol}</td>
                <td className="px-6 py-4">${trade.entry_price.toFixed(2)}</td>
                <td className="px-6 py-4">${trade.exit_price?.toFixed(2) || '-'}</td>
                <td className="px-6 py-4">{trade.quantity}</td>
                <td className={`px-6 py-4 font-semibold ${trade.pnl > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${trade.pnl?.toFixed(2) || '-'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${trade.status === 'CLOSED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {trade.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(trade.entry_date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {trades.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            No trades found. Start by creating a new trade!
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
