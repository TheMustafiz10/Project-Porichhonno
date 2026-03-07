import { useState } from 'react';
import { redeemPoints } from '../api/api';
import './RedeemPoints.css';

export default function RedeemPoints({ onRedeem }) {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsed = parseInt(amount);
    if (!parsed || parsed <= 0) {
      setMessage('Please enter a valid amount');
      setIsSuccess(false);
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const data = await redeemPoints(parsed, reason);
      setMessage(`Success! Redeemed ${data.redeemed} points. New balance: ${data.newBalance}`);
      setIsSuccess(true);
      setAmount('');
      setReason('');
      onRedeem?.();
    } catch (err) {
      setMessage(err.message);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="redeem-section">
      <h2 className="redeem-title">Redeem Points</h2>
      <p className="redeem-subtitle">Exchange your points for rewards</p>

      <form className="redeem-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Amount to redeem</label>
          <input
            id="amount"
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 100"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reason">Reason (optional)</label>
          <input
            id="reason"
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Gift card"
            disabled={loading}
          />
        </div>
        <button type="submit" className="redeem-btn" disabled={loading}>
          {loading ? 'Processing...' : 'Redeem Points'}
        </button>
      </form>

      {message && (
        <div className={`redeem-message ${isSuccess ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </section>
  );
}