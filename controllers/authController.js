const authService = require('../services/authService');
const userService = require('../services/userService');
const signupTokenService = require('../services/signupTokenService');

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await userService.loginUser(email, password);
  
      const token = authService.generateToken(user);
      authService.setAuthCookie(res, token);
  
      return res.status(200).json({ message: 'Login successful' });
    
    } catch (error) {
      console.error('Error in login:', error);
  
      if (error.message.includes('Invalid credentials')) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Logout
  async logout(req, res) {
    try {
      res.clearCookie('auth_token');
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Signup with token
  async signup(req, res) {
    try {
      const { token } = req.query;
      const { email, password, firstName, lastName, phoneNumber, role } = req.body;

      // Validate signup token
      const tokenPayload = await signupTokenService.validateSignupToken(token);
      const { adminEmail, organization } = tokenPayload;

      // Create user
      const newUser = await userService.createUser(
        { email, password, firstName, lastName, phoneNumber, role },
        { adminEmail, organization }
      );

      res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();