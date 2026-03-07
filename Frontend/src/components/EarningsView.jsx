import { useState, useEffect } from 'react';
import { fetchUserEarnings } from '../api/api';
import './EarningsView.css';

export default function EarningsView() {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchUserEarnings()
      .then(setEarnings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="earnings-loading">Loading your earnings...</div>;
  if (error) return <div className="earnings-error">{error}</div>;
  if (!earnings) return null;

  return (
    <section className="earnings-section">
      <h2 className="earnings-title">Your Earnings</h2>
      <div className="earnings-card">
        <div className="earnings-points">
          <span className="points-value">{earnings.points.toLocaleString()}</span>
          <span className="points-label">Points</span>
        </div>
        <div className="earnings-details">
          <p><strong>{earnings.name}</strong></p>
          <p className="neighborhood">{earnings.neighborhoodName}</p>
          {earnings.rank > 0 && (
            <p className="rank-badge">Rank #{earnings.rank} overall</p>
          )}
        </div>
      </div>
    </section>
  );
}
