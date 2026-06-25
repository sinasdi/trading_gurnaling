import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const Analytics = ({ token }) => {
  const [summary, setSummary] = useState(null);
  const [byStrategy, setByStrategy] = useState([]);
  const [milestone, setMilestone] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [summaryRes, strategyRes, milestoneRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/analytics/summary`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/analytics/by-strategy`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/analytics/performance-milestone`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setSummary(summaryRes.data);
      setByStrategy(strategyRes.data);
      setMilestone(milestoneRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading analytics...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">📊 Advanced Analytics</h1>

      {/* Performance Milestone */}
      {milestone && (
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">🏆 Performance Milestone</h2>
          {milestone.milestone > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded p-4">
                <p className="text-gray-600 text-sm">Milestone #</p>
                <p className="text-3xl font-bold text-blue-600">{milestone.milestone}</p>
              </div>
              <div className="bg-green-50 rounded p-4">
                <p className="text-gray-600 text-sm">Total P&L (100 trades)</p>
                <p className={`text-3xl font-bold ${milestone.statistics?.total_pnl > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${milestone.statistics?.total_pnl?.toFixed(2)}
                </p>
              </div>
              <div className="bg-purple-50 rounded p-4">
                <p className="text-gray-600 text-sm">Win Rate</p>
                <p className="text-3xl font-bold text-purple-600">{milestone.statistics?.win_rate}%</p>
              </div>
              <div className="bg-orange-50 rounded p-4">
                <p className="text-gray-600 text-sm">Risk/Reward</p>
                <p className="text-3xl font-bold text-orange-600">{milestone.statistics?.risk_reward_ratio?.toFixed(2)}</p>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-yellow-800">
              <p className="font-semibold">Complete {milestone.tradesUntilMilestone} more trades to reach your first milestone report!</p>
              <p className="text-sm mt-2">You'll get detailed analytics after every 100 closed trades.</p>
            </div>
          )}
        </div>
      )}

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Closed</p>
            <p className="text-3xl font-bold text-blue-600">{summary.closed_trades}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Wins</p>
            <p className="text-3xl font-bold text-green-600">{summary.winning_trades}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Losses</p>
            <p className="text-3xl font-bold text-red-600">{summary.losing_trades}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Avg Win</p>
            <p className="text-3xl font-bold text-green-600">$<span>{(summary.total_pnl / summary.winning_trades).toFixed(2)}</span></p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Avg Loss</p>
            <p className="text-3xl font-bold text-red-600">$<span>{(summary.total_pnl / summary.losing_trades).toFixed(2)}</span></p>
          </div>
        </div>
      )}

      {/* Strategy Breakdown */}
      {byStrategy.length > 0 && (
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6">Strategy Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Strategy</th>
                  <th className="px-6 py-4 text-left font-semibold">Trades</th>
                  <th className="px-6 py-4 text-left font-semibold">Wins</th>
                  <th className="px-6 py-4 text-left font-semibold">Win Rate</th>
                  <th className="px-6 py-4 text-left font-semibold">Total P&L</th>
                </tr>
              </thead>
              <tbody>
                {byStrategy.map((strategy, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold">{strategy.strategy || 'No Strategy'}</td>
                    <td className="px-6 py-4">{strategy.total_trades}</td>
                    <td className="px-6 py-4 text-green-600">{strategy.winning_trades}</td>
                    <td className="px-6 py-4">{strategy.win_rate}%</td>
                    <td className={`px-6 py-4 font-semibold ${strategy.total_pnl > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${strategy.total_pnl.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
