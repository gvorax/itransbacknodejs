const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const jwtSecret = 'mysecretPassword2002#';

exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!password) {
    return res.status(400).json({ message: 'Password less than 1 characters' });
  }
  try {
    bcrypt.hash(password, 10).then(async (hash) => {
      await User.create({
        name,
        email,
        password: hash,
      })
        .then((user) => {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign({ id: user._id, email }, jwtSecret, {
            expiresIn: maxAge, // 3hrs in sec
          });
          res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
          res.status(201).json({
            message: 'User successfully created',
            token,
          });
        })
        .catch((error) =>
          res.status(400).json({
            message: 'User not successful created',
            error: error.message,
          })
        );
    });
  } catch (err) {
    res.status(401).json({
      message: 'User not successful created',
      error: error.mesage,
    });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  // Check if username and password is provided
  if (!email || !password) {
    return res.status(400).json({
      message: 'Email or Password not present',
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        message: 'Login not successful',
        error: 'User not found',
      });
    } else if (user.status === 'block') {
      res.status(401).json({
        message: 'Login not successful',
        error: 'You are blocked',
      });
    } else {
      // comparing given password with hashed password
      await User.findOneAndUpdate(
        { email },
        { loginTime: new Date() },
        { new: true }
      );
      bcrypt.compare(password, user.password).then(function (result) {
        if (result) {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign({ id: user._id, email }, jwtSecret, {
            expiresIn: maxAge, // 3hrs in sec
          });
          res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
          res.status(201).json({
            message: 'User successfully Logged in',
            token: token,
          });
        } else {
          res.status(400).json({ message: 'Login not succesful' });
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      message: 'An error occurred',
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res, next) => {
  const { id } = req.body;
  await User.findByIdAndRemove(id)
    .then((user) =>
      res.status(201).json({ message: 'User successfully deleted', user })
    )
    .catch((error) =>
      res
        .status(400)
        .json({ message: 'An error occurred', error: error.message })
    );
};

exports.getUsers = async (req, res, next) => {
  const users = await User.find({});

  await res.send(users);
};

exports.updateUser = async (req, res, next) => {
  const { id, status, select } = req.body;
  const user = await User.findOneAndUpdate(
    { _id: id },
    { $set: { status: status, select: select } },
    { new: true }
  );
  await res.send(user);
};
