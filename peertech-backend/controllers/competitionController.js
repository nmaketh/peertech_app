const Competition = require('../models/Competition');
const User = require('../models/User');

// Create a new competition
exports.createCompetition = async (req, res) => {
    const { title, description, organizer, endsIn, participants, image } = req.body;

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
        console.error('Error creating competition:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get all competitions
exports.getCompetitions = async (req, res) => {
    try {
        const competitions = await Competition.find();
        res.json(competitions);
    } catch (err) {
        console.error('Error getting competitions:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Update a competition
exports.updateCompetition = async (req, res) => {
    const { title, description, organizer, endsIn, participants, image } = req.body;

    try {
        let competition = await Competition.findById(req.params.id);
        if (!competition) {
            return res.status(404).json({ msg: 'Competition not found' });
        }

        competition = await Competition.findByIdAndUpdate(
            req.params.id,
            { $set: { title, description, organizer, endsIn, participants, image } },
            { new: true }
        );

        res.json(competition);
    } catch (err) {
        console.error('Error updating competition:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Delete a competition
exports.deleteCompetition = async (req, res) => {
    try {
        let competition = await Competition.findById(req.params.id);
        if (!competition) {
            return res.status(404).json({ msg: 'Competition not found' });
        }

        await Competition.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Competition removed' });
    } catch (err) {
        console.error('Error deleting competition:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Enroll a student in a competition
exports.enrollCompetition = async (req, res) => {
    try {
        const competition = await Competition.findById(req.params.id);
        if (!competition) {
            return res.status(404).json({ msg: 'Competition not found' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (competition.participants.includes(req.user.id)) {
            return res.status(400).json({ msg: 'Already enrolled in this competition' });
        }

        competition.participants.push(req.user.id);
        await competition.save();

        res.json({ msg: 'Enrolled successfully' });
    } catch (err) {
        console.error('Error enrolling in competition:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};