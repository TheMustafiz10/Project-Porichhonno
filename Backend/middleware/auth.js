/**
 * Simple auth middleware - for demo, accepts userId in header
 * Replace with JWT/session auth for production
 */
function optionalAuth(req, res, next) {
  const userId = req.headers['x-user-id'];
  if (userId) {
    req.userId = userId;
  }
  next();
}

function requireAuth(req, res, next) {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  req.userId = userId;
  next();
}

module.exports = { optionalAuth, requireAuth };