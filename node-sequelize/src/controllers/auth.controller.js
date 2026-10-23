const jwt = require('jsonwebtoken');
const { User } = require('../models');

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    // const allowedRoles = ['customer', 'captain'];
    // if (role && !allowedRoles.includes(role)) {
    //   return res.status(400).json({ message: 'Invalid role for public registration' });
    // }
    const assignedRole = role || 'customer';
    console.log("register:",assignedRole)

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
    });

    const token = signToken(user.id, user.role);

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    const user = await User.findOne({ where: { email } });
    console.log("login:",user)
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(user.id, user.role);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  return res.status(200).json({
    status: 'success',
    user: req.user,
  });
};