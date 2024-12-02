const express = require('express');
const UserController = require('../controllers/UserController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Define routes and connect them to controller functions
router.get('/', authenticateToken, UserController.getUser);             // Get all users
// router.post('/', authenticateToken, UserController.createUser);             // Create a new user
router.get('/:id', authenticateToken, UserController.getUserById);          // Get a single user by ID
router.get('/profile/:username', UserController.getUserByUsername);          // Get a single user by username
router.put('/:id', authenticateToken, UserController.updateUser);           // Update a user by ID
router.delete('/:id', authenticateToken, UserController.deleteUser);        // Delete a user by ID


module.exports = router;
