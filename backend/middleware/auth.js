const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Token received:', token ? 'YES' : 'NO');
  if (!token) return res.status(401).json({ msg: 'No token, access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded userId:', decoded.userId);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log('JWT Error:', err.message);
    res.status(401).json({ msg: 'Token invalid' });
  }
};