// User types: resident, volunteer, admin
const users = [
  { id: '1', name: 'Alice Johnson', neighborhoodId: '1', type: 'resident', points: 1250 },
  { id: '2', name: 'Bob Smith', neighborhoodId: '1', type: 'resident', points: 980 },
  { id: '3', name: 'Carol Williams', neighborhoodId: '2', type: 'resident', points: 2100 },
  { id: '4', name: 'David Brown', neighborhoodId: '2', type: 'volunteer', points: 1850 },
  { id: '5', name: 'Eva Martinez', neighborhoodId: '1', type: 'resident', points: 750 },
  { id: '6', name: 'Frank Lee', neighborhoodId: '3', type: 'resident', points: 3200 },
  { id: '7', name: 'Grace Chen', neighborhoodId: '3', type: 'volunteer', points: 2750 },
  { id: '8', name: 'Henry Wilson', neighborhoodId: '2', type: 'resident', points: 1100 },
];

const neighborhoods = [
  { id: '1', name: 'Oak Valley', totalPoints: 2980 },
  { id: '2', name: 'Maple Grove', totalPoints: 5050 },
  { id: '3', name: 'Pine Ridge', totalPoints: 5950 },
];

const redemptionHistory = [];

// Recalculate neighborhood totals from user points
function updateNeighborhoodTotals() {
  const totals = {};
  users.forEach(user => {
    totals[user.neighborhoodId] = (totals[user.neighborhoodId] || 0) + user.points;
  });
  neighborhoods.forEach(n => {
    n.totalPoints = totals[n.id] || 0;
  });
}

function getIndividualLeaderboard(limit = 10) {
  return [...users]
    .sort((a, b) => b.points - a.points)
    .slice(0, limit)
    .map((user, index) => ({
      rank: index + 1,
      ...user,
      neighborhoodName: neighborhoods.find(n => n.id === user.neighborhoodId)?.name || 'Unknown',
    }));
}

function getNeighborhoodLeaderboard(limit = 10) {
  updateNeighborhoodTotals();
  return [...neighborhoods]
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, limit)
    .map((n, index) => ({
      rank: index + 1,
      id: n.id,
      name: n.name,
      totalPoints: n.totalPoints,
      memberCount: users.filter(u => u.neighborhoodId === n.id).length,
    }));
}

function getUserEarnings(userId) {
  const user = users.find(u => u.id === userId);
  if (!user) return null;
  return {
    userId: user.id,
    name: user.name,
    points: user.points,
    neighborhoodName: neighborhoods.find(n => n.id === user.neighborhoodId)?.name || 'Unknown',
    rank: getIndividualLeaderboard(100).findIndex(u => u.id === userId) + 1,
  };
}

function redeemPoints(userId, amount, reason = '') {
  const user = users.find(u => u.id === userId);
  if (!user || user.points < amount || amount <= 0) {
    return { success: false, message: 'Insufficient points or invalid amount' };
  }
  user.points -= amount;
  const record = {
    id: Date.now().toString(),
    userId,
    amount,
    reason,
    timestamp: new Date().toISOString(),
  };
  redemptionHistory.push(record);
  return { success: true, record, newBalance: user.points };
}

module.exports = {
  users,
  neighborhoods,
  redemptionHistory,
  getIndividualLeaderboard,
  getNeighborhoodLeaderboard,
  getUserEarnings,
  redeemPoints,
};
