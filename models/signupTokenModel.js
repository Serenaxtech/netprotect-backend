const mongoose = require('mongoose');

const signupTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  adminEmail: { type: String, required: true },
  organization: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organization',
    required: true 
  },
  expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model('SignupToken', signupTokenSchema); 