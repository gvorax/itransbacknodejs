const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: 'string',
    require: true,
  },
  email: {
    type: 'string',
    require: true,
    unique: true,
  },
  password: {
    require: true,
    minlength: 6,
    type: 'string',
  },
  loginTime: {
    require: true,
    type: Date,
    default: new Date(),
  },
  registerTime: {
    require: true,
    type: Date,
    default: new Date(),
  },
  status: {
    require: true,
    type: 'string',
    default: 'active',
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model('users', UserSchema);
