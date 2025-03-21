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


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    console.log(this.password);
    const trimmedPassword = this.password.trim();
    this.password = await bcrypt.hash(trimmedPassword, 10);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password.trim(), this.password);
};

module.exports = mongoose.model('User', userSchema);