const userService = require("../services/userService");

class UserController {
  // Can be used only by the root user
  async createIntegratorUser(req, res) {
    try {
      const { username, firstname, lastname, email, phone_number, organizations, password, confirm_password } = req.body;

      // Validate required fields
      if (!username || !firstname || !lastname || !email || !phone_number || !organizations || !password || !confirm_password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Check if passwords match
      if (password !== confirm_password) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }

      // Create integrator user
      const user_data = { username, firstname, lastname, email, phone_number, organizations, password };
      await userService.createUser(user_data, 'integrator');

      res.status(201).json({ message: 'Integrator user created successfully' });
    } catch (error) {
      console.error('Error in createIntegratorUser:', error);

      // Handle specific error cases
      if (error.message.includes('A User With Similar Email Already Exists')) {
        return res.status(400).json({ message: 'Email already taken' });
      }

      if (error.message.includes('A User With Similar Phone Number Already Exists')) {
        return res.status(400).json({ message: 'Phone Number already taken' });
      }

      if (error.message.includes('A User With Similar Username Already Exists')) {
        return res.status(400).json({ message: 'Username already taken' });
      }

      // Generic error response
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async createAdminUser(req, res) {
    try {
      const { username, firstname, lastname, email, phone_number, organizations, password, confirm_password } = req.body;

      // Validate required fields
      if (!username || !firstname || !lastname || !email || !phone_number || !organizations || !password || !confirm_password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Check if passwords match
      if (password !== confirm_password) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }

      // Create admin user
      const user_data = { username, firstname, lastname, email, phone_number, organizations, password };
      await userService.createUser(user_data, 'admin');

      res.status(201).json({ message: 'Admin user created successfully' });
    } catch (error) {
      console.error('Error in createAdminUser:', error);

      // Handle specific error cases
      if (error.message.includes('A User With Similar Email Already Exists')) {
        return res.status(400).json({ message: 'Email already taken' });
      }

      if (error.message.includes('A User With Similar Phone Number Already Exists')) {
        return res.status(400).json({ message: 'Phone Number already taken' });
      }

      if (error.message.includes('A User With Similar Username Already Exists')) {
        return res.status(400).json({ message: 'Username already taken' });
      }

      // Generic error response
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async createNormalUser(req, res) {
    try {
      const { username, firstname, lastname, email, phone_number, organizations, password, confirm_password } = req.body;

      // Validate required fields
      if (!username || !firstname || !lastname || !email || !phone_number || !organizations || !password || !confirm_password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Check if passwords match
      if (password !== confirm_password) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }

      // Create normal user
      const user_data = { username, firstname, lastname, email, phone_number, organizations, password };
      await userService.createUser(user_data, 'user');

      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error in createNormalUser:', error);

      // Handle specific error cases
      if (error.message.includes('A User With Similar Email Already Exists')) {
        return res.status(400).json({ message: 'Email already taken' });
      }

      if (error.message.includes('A User With Similar Phone Number Already Exists')) {
        return res.status(400).json({ message: 'Phone Number already taken' });
      }

      if (error.message.includes('A User With Similar Username Already Exists')) {
        return res.status(400).json({ message: 'Username already taken' });
      }

      // Generic error response
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getUserProfile(req, res) {
    try {
      const userId = req.user._id; // Get user ID from authenticated request
      const user = await userService.getUserById(userId);
      res.status(200).json(user);
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      
      if (error.message === 'User not found') {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getUserOrganizations(req, res) {
    try {
      const userId = req.user._id;
      const user = await userService.getUserById(userId);
      res.status(200).json(user.organizations);
    } catch (error) {
      console.error('Error in getUserOrganizations:', error);
      
      if (error.message === 'User not found') {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = new UserController();