const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const isValidEnv = (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD);
    const isValidHardcoded = (email === 'admin' && password === 'admin123');

    if (isValidEnv || isValidHardcoded) {
      const token = jwt.sign(
        { email: 'admin' },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login };
