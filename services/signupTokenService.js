const jwt = require('jsonwebtoken');
const { SignupToken } = require('../models/signupTokenModel');

class SignupTokenService {
  // Generate a signup token (valid for 10 minutes)
  generateSignupToken(adminEmail, organizationId) {
    const token = jwt.sign(
      { adminEmail, organizationId },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    const newSignupToken = new SignupToken({
      token,
      adminEmail,
      organization: organizationId,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    return newSignupToken.save();
  }

  // Validate a signup token
  async validateSignupToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const signupToken = await SignupToken.findOne({ token });

      if (!signupToken || signupToken.expiresAt < new Date()) {
        throw new Error('Invalid or expired token');
      }

      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}

module.exports = new SignupTokenService();