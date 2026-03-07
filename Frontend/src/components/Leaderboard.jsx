import { useState, useEffect } from 'react';
import { fetchIndividualLeaderboard, fetchNeighborhoodLeaderboard } from '../api/api';
import './Leaderboard.css';

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('individuals');
  const [individuals, setIndividuals] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetch = activeTab === 'individuals' ? fetchIndividualLeaderboard : fetchNeighborhoodLeaderboard;
    fetch()
      .then(activeTab === 'individuals' ? setIndividuals : setNeighborhoods)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [activeTab]);

  const getRankBadge = (rank) => {
    if (rank === 1) return <span className="rank-badge gold">🥇</span>;
    if (rank === 2) return <span className="rank-badge silver">🥈</span>;
    if (rank === 3) return <span className="rank-badge bronze">🥉</span>;
    return <span className="rank-number">{rank}</span>;
  };

  return (
    <section className="leaderboard-section">
      <h2 className="section-title">Community Leaderboard</h2>
      <p className="section-subtitle">Compete and climb the ranks!</p>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'individuals' ? 'active' : ''}`}
          onClick={() => setActiveTab('individuals')}
        >
          Top Performers
        </button>
        <button
          className={`tab ${activeTab === 'neighborhoods' ? 'active' : ''}`}
          onClick={() => setActiveTab('neighborhoods')}
        >
          Neighborhoods
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading rankings...</div>}

      {!loading && !error && activeTab === 'individuals' && (
        <div className="leaderboard-list">
          {individuals.map((item) => (
            <div key={item.id} className="leaderboard-card individual">
              <div className="rank">{getRankBadge(item.rank)}</div>
              <div className="card-info">
                <h3>{item.name}</h3>
                <span className="meta">{item.neighborhoodName}</span>
              </div>
              <div className="points">{item.points.toLocaleString()} pts</div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && activeTab === 'neighborhoods' && (
        <div className="leaderboard-list">
          {neighborhoods.map((item) => (
            <div key={item.id} className="leaderboard-card neighborhood">
              <div className="rank">{getRankBadge(item.rank)}</div>
              <div className="card-info">
                <h3>{item.name}</h3>
                <span className="meta">{item.memberCount} members</span>
              </div>
              <div className="points">{item.totalPoints.toLocaleString()} pts</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}