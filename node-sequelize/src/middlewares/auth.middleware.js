const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Verify Bearer Token
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication token missing or invalid format' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(401).json({ message: 'User belonging to this token no longer exists' });
    }

    req.user = user;
    next();
  } 
  catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};


// Role-based Access Control
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: Access denied for role '${req.user ? req.user.role : 'Guest'}'`,
      });
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRoles };