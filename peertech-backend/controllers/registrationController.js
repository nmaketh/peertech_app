// peertech-backend/controllers/registrationController.js
const User = require('../models/User');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    await user.save();
    res.send({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};