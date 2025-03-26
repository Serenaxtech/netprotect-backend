const jwt = require('jsonwebtoken');
const { User } = require('../models/userModel');

class AuthService {
  generateToken(user) {
    return jwt.sign(
      { userId: user._id, role: user.role, organizations: user.organizations },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  }

  setAuthCookie(res, token) {
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000
    });
  }
}

module.exports = new AuthService();