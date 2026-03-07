const API_BASE = 'http://localhost:1642/api';

function getAuthHeaders() {
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const headers = { 'Content-Type': 'application/json' };
  if (userId) {
    headers['X-User-Id'] = userId;
  }
  return headers;
}

export async function fetchIndividualLeaderboard(limit = 10) {
  const res = await fetch(`${API_BASE}/leaderboard/individuals?limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch');
  return data.data;
}

export async function fetchNeighborhoodLeaderboard(limit = 10) {
  const res = await fetch(`${API_BASE}/leaderboard/neighborhoods?limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch');
  return data.data;
}

export async function fetchUserEarnings() {
  const res = await fetch(`${API_BASE}/user/earnings`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch');
  return data.data;
}

export async function redeemPoints(amount, reason = '') {
  const res = await fetch(`${API_BASE}/redeem-points`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ amount, reason }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Redemption failed');
  return data.data;
}