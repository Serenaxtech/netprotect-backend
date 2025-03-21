const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: { 
    type: String, 
    required: true,
    set: (value) => bcrypt.hashSync(value, 10)
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { 
    type: String,
    match: /^\+?[0-9]{7,15}$/
  },
  role: {
    type: String,
    enum: ['root', 'admin', 'integrator', 'user'],
    default: 'user'
  },
  organizations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  }]
}, { timestamps: true });


userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);