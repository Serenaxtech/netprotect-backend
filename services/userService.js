const User = require('../models/userModel');
const { SignupToken } = require('../models/signupTokenModel');
const bcrypt = require('bcrypt');

class UserService {

  //!! This will be so secured for now 
  //!! we will not be able to create
  //!! a root account using the web interface
  async createRootUser() {

  }

  async createUser(user_data, user_role) {
    try {
      const { username, firstname, lastname, email, phone_number, organizations, password } = user_data;

      const check_user = await User.findOne({
        $or: [
          { username },
          { email },
          { phoneNumber: phone_number },
        ]
      });

      if (check_user) {
        if (check_user.email === email) {
          throw new Error('A User With Similar Email Already Exists');
        } else if (check_user.phoneNumber === phone_number) {
          throw new Error('A User With Similar Phone Number Already Exists');
        } else if (check_user.username === username) {
          throw new Error('A User With Similar Username Already Exists');
        }

        
      }

      const new_user = new User({
        username,
        firstName: firstname,
        lastName: lastname,
        email,
        phoneNumber: phone_number,
        organizations,
        role: user_role,
        password
      });

      const savedUser = await new_user.save();
      return savedUser;
    } catch (error) {
      console.error(`Error creating ${user_role} user`, error);
      throw new Error(`${user_role} user creation failed: ${error.message}`);
    }
  }

}

module.exports = new UserService();