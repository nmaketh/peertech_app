const jwt = require('jsonwebtoken');

// Replace with your JWT secret
const secret = 'your_jwt_secret';

// Replace with a valid user ID and role
const payload = {
    user: {
        id: 'user_id', // Replace with a valid user ID
        role: 'teacher' // Replace with the appropriate role (e.g., 'teacher', 'admin')
    }
};

// Generate the token
const token = jwt.sign(payload, secret, { expiresIn: 360000 });

console.log('Generated JWT Token:', token);