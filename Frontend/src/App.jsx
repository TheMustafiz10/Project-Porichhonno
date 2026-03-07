import { useState, useEffect } from 'react';
import Leaderboard from './components/Leaderboard';
import EarningsView from './components/EarningsView';
import RedeemPoints from './components/RedeemPoints';
import './App.css';

const VIEWS = {
  leaderboard: 'leaderboard',
  earnings: 'earnings',
  redeem: 'redeem',
};

// Demo users for testing (matches backend data)
const DEMO_USERS = [
  { id: '1', name: 'Alice Johnson', type: 'resident' },
  { id: '2', name: 'Bob Smith', type: 'resident' },
  { id: '3', name: 'Carol Williams', type: 'resident' },
  { id: '4', name: 'David Brown', type: 'volunteer' },
  { id: '6', name: 'Frank Lee', type: 'resident' },
  { id: '7', name: 'Grace Chen', type: 'volunteer' },
];

export default function App() {
  const [currentView, setCurrentView] = useState(VIEWS.leaderboard);
  const [userId, setUserId] = useState(() => localStorage.getItem('userId') || '1');

  useEffect(() => {
    localStorage.setItem('userId', userId);
  }, [userId]);

  const renderView = () => {
    switch (currentView) {
      case VIEWS.earnings:
        return <EarningsView />;
      case VIEWS.redeem:
        return <RedeemPoints onRedeem={() => setCurrentView(VIEWS.earnings)} />;
      default:
        return <Leaderboard />;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Community Leaderboard</h1>
        <p className="tagline">Foster competition. Climb the ranks.</p>

        <div className="user-selector">
          <label>View as:</label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="user-select"
          >
            {DEMO_USERS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.type})
              </option>
            ))}
          </select>
        </div>
      </header>

      <nav className="nav">
        <button
          className={currentView === VIEWS.leaderboard ? 'active' : ''}
          onClick={() => setCurrentView(VIEWS.leaderboard)}
        >
          Leaderboard
        </button>
        <button
          className={currentView === VIEWS.earnings ? 'active' : ''}
          onClick={() => setCurrentView(VIEWS.earnings)}
        >
          View Earnings
        </button>
        <button
          className={currentView === VIEWS.redeem ? 'active' : ''}
          onClick={() => setCurrentView(VIEWS.redeem)}
        >
          Redeem Points
        </button>
      </nav>

      <main className="main">{renderView()}</main>
    </div>
  );
}
