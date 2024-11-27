const express = require('express');
const router = express.Router();
const Competition = require('../models/Competition');
const Enrollment = require('../models/Enrollment');
const Notification = require('../models/Notification');

// Fetch all competitions
router.get('/', async (req, res) => {
  try {
    const competitions = await Competition.find();
    res.json(competitions);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});

// Create a new competition
router.post('/create', async (req, res) => {
  const { title, description, organizer, endsIn, participants, image } = req.body;

  if (!title || !description || !organizer || !endsIn || !participants || !image) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    const newCompetition = new Competition({
      title,
      description,
      organizer,
      endsIn,
      participants,
      image
    });

    const competition = await newCompetition.save();
    res.json(competition);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});

// Update a competition
router.put('/:id', async (req, res) => {
  const { title, description, organizer, endsIn, participants, image } = req.body;

  if (!title || !description || !organizer || !endsIn || !participants || !image) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    let competition = await Competition.findById(req.params.id);

    if (!competition) {
      return res.status(404).json({ msg: 'Competition not found' });
    }

    competition.title = title;
    competition.description = description;
    competition.organizer = organizer;
    competition.endsIn = endsIn;
    competition.participants = participants;
    competition.image = image;

    await competition.save();
    res.json(competition);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});

// Delete a competition
router.delete('/:id', async (req, res) => {
  try {
    let competition = await Competition.findById(req.params.id);

    if (!competition) {
      return res.status(404).json({ msg: 'Competition not found' });
    }

    await competition.deleteOne();
    res.json({ msg: 'Competition removed' });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});

// Enroll in a competition
router.post('/:id/enroll', async (req, res) => {
  const { studentId } = req.body;

  if (!studentId) {
    return res.status(400).json({ msg: 'Student ID is required' });
  }

  try {
    const competition = await Competition.findById(req.params.id);
    if (!competition) {
      return res.status(404).json({ msg: 'Competition not found' });
    }

    const newEnrollment = new Enrollment({
      student: studentId,
      competition: req.params.id,
      status: 'pending'
    });

    await newEnrollment.save();
    res.json({ msg: 'Enrolled successfully! Waiting for approval.' });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});

// Fetch enrollments for a competition
router.get('/:id/enrollments', async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ competition: req.params.id }).populate('student', 'name email');
    res.json(enrollments);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});

// Update enrollment status
router.put('/:competitionId/enrollments/:enrollmentId', async (req, res) => {
  const { status } = req.body;

  try {
    let enrollment = await Enrollment.findById(req.params.enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ msg: 'Enrollment not found' });
    }

    enrollment.status = status;
    await enrollment.save();

    // Create a notification for the student
    const notification = new Notification({
      student: enrollment.student,
      message: `Your enrollment status for the competition has been ${status}.`
    });
    await notification.save();

    res.json(enrollment);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;