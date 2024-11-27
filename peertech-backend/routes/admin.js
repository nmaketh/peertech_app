const express = require('express');
const router = express.Router();
// const auth = require('../middleware/auth');
// const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const Competition = require('../models/Competition');

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});

// Update user role
router.put('/users/:id', async (req, res) => {
  const { role } = req.body;

  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.role = role;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await user.remove();
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});

// Get all competitions
router.get('/competitions', async (req, res) => {
  try {
    const competitions = await Competition.find();
    res.json(competitions);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});

// Delete competition
router.delete('/competitions/:id', async (req, res) => {
  try {
    let competition = await Competition.findById(req.params.id);

    if (!competition) {
      return res.status(404).json({ msg: 'Competition not found' });
    }

    await competition.remove();
    res.json({ msg: 'Competition removed' });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;