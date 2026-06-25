import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NewTrade = ({ token }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    symbol: '',
    entryPrice: '',
    exitPrice: '',
    quantity: '',
    riskAmount: '',
    rewardAmount: '',
    strategy: '',
    notes: '',
    entryDate: new Date().toISOString().split('T')[0],
    exitDate: ''
  });
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleScreenshotChange = (e) => {
    setScreenshot(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create trade
      const tradeResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/trades`,
        {
          ...formData,
          entryPrice: parseFloat(formData.entryPrice),
          exitPrice: formData.exitPrice ? parseFloat(formData.exitPrice) : null,
          quantity: parseInt(formData.quantity),
          riskAmount: parseFloat(formData.riskAmount) || null,
          rewardAmount: parseFloat(formData.rewardAmount) || null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Upload screenshot if provided
      if (screenshot) {
        const formDataFile = new FormData();
        formDataFile.append('file', screenshot);
        formDataFile.append('tradeId', tradeResponse.data.trade.id);

        await axios.post(
          `${process.env.REACT_APP_API_URL}/screenshots/upload`,
          formDataFile,
          { 
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      alert('Trade created successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create trade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">📝 New Trade</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Symbol *</label>
            <input
              type="text"
              name="symbol"
              value={formData.symbol}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
              placeholder="e.g., EURUSD"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Strategy</label>
            <input
              type="text"
              name="strategy"
              value={formData.strategy}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="e.g., Breakout"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Entry Price *</label>
            <input
              type="number"
              name="entryPrice"
              value={formData.entryPrice}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
              step="0.0001"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Exit Price</label>
            <input
              type="number"
              name="exitPrice"
              value={formData.exitPrice}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              step="0.0001"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Risk Amount</label>
            <input
              type="number"
              name="riskAmount"
              value={formData.riskAmount}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Reward Amount</label>
            <input
              type="number"
              name="rewardAmount"
              value={formData.rewardAmount}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Entry Date *</label>
            <input
              type="date"
              name="entryDate"
              value={formData.entryDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Exit Date</label>
            <input
              type="date"
              name="exitDate"
              value={formData.exitDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 h-24"
            placeholder="Add your trade analysis notes..."
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Screenshot</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleScreenshotChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          {screenshot && <p className="text-sm text-green-600 mt-2">✓ File selected: {screenshot.name}</p>}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Trade'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-gray-300 text-gray-800 font-semibold py-3 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTrade;
