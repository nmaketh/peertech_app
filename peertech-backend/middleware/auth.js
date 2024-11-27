const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('Authorization').replace('Bearer ', '');

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;

    // Check if user is admin
    User.findById(req.user.id).then(user => {
      if (user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
      }
      next();
    });
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};