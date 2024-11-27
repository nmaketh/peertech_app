const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Get notifications for a student
router.get('/', async (req, res) => {
  const { studentId } = req.query;

  try {
    const notifications = await Notification.find({ student: studentId });
    res.json(notifications);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});

// Delete a notification
router.delete('/:id', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }

    await Notification.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Notification removed' });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;