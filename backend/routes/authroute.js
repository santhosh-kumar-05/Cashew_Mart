const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/authontoller'); // corrected
const router = express.Router();

// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile/:id', getUserProfile);


module.exports = router;
