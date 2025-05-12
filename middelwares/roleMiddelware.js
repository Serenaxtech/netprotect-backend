// middlewares/roleMiddleware.js
const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
      console.log('User Role:', req.user.role);
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      }
      next();
    };
  };
  
  module.exports = roleMiddleware;