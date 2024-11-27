const mongoose = require('mongoose');
const config = require('config');

// Load User model
const User = require('./models/User');

// Connect to MongoDB
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(db);
        console.log('MongoDB Connected...');

        // Remove users with emails
        await User.deleteMany({ email: { $exists: true } });
        console.log('Users with emails removed');

        // Close the connection
        mongoose.connection.close();
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

connectDB();