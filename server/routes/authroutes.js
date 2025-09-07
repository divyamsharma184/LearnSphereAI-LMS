const express = require('express'); 
const router = express.Router();
const { register, login } = require('../controllers/authcontroller');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/user');

// Register and Login
router.post('/register', register);
router.post('/login', login);

// Protected route to get authenticated user
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // don't send password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

module.exports = router;
