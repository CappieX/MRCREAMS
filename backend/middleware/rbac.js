const { defineAbilitiesFor } = require('../config/abilities');

/**
 * Middleware to check for permissions using CASL
 * @param {string} action - The action to perform (e.g., 'read', 'create')
 * @param {string} subject - The subject to perform action on (e.g., 'User', 'Report')
 * @param {string} field - Optional field to check
 */
const checkPermission = (action, subject, field) => {
  return (req, res, next) => {
    // req.user must be populated by authentication middleware
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const ability = defineAbilitiesFor(req.user);

    if (ability.can(action, subject, field)) {
      return next();
    }

    return res.status(403).json({
      error: 'Forbidden',
      message: `You are not allowed to ${action} ${subject}`
    });
  };
};

module.exports = { checkPermission };
