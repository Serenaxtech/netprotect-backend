const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token;
    console.log(`token : ${token}`);
    if (!token) throw new Error('Authentication required');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.userId;
    const user = await User.findOne({ _id: user_id });
    console.log(user);
    if (!user) throw new Error('User not found');

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = authMiddleware;