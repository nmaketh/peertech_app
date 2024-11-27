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

        // Create unique index on the email field
        await User.collection.createIndex({ email: 1 }, { unique: true });
        console.log('Unique index created on email field');

        // Create unique index on the username field with sparse option
        await User.collection.createIndex({ username: 1 }, { unique: true, sparse: true });
        console.log('Unique index created on username field with sparse option');

        // Close the connection
        mongoose.connection.close();
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

connectDB();