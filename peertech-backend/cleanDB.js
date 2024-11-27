const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  cleanUpDatabase();
}).catch(err => console.log(err));

const User = require('./models/User');

async function cleanUpDatabase() {
  try {
    // Remove documents with null values for username or email
    await User.deleteMany({ $or: [{ username: null }, { email: null }] });
    console.log('Database cleaned up');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error cleaning up database:', err);
  }
}