import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import './PriceChart.css';

function PriceChart({ productId }) {
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!productId) return;

    const fetchPriceHistory = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`http://localhost:5000/api/prices/${productId}`);
        // Map data to chart-friendly format, oldest first
        const formatted = res.data
          .map((entry) => ({
            date: new Date(entry.checkedAt).toLocaleDateString(),
            price: entry.price,
          }))
          .reverse();

        setPriceHistory(formatted);
      } catch (err) {
        setError('Failed to load price history.');
      } finally {
        setLoading(false);
      }
    };

    fetchPriceHistory();
  }, [productId]);

  if (loading) return <p>Loading price history...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!priceHistory.length) return <p>No price history available.</p>;

  return (
    <div className="price-chart-container">
      <h3>Price History</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={priceHistory} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="date" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#007bff" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PriceChart;
