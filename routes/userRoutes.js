const express = require('express');
const UserController = require('../controllers/UserController');
const authenticateToken = require('../middlewares/authMiddleware');
const { validateUsernameInput } = require('../middlewares/validationMiddleware');


const router = express.Router();

// Define routes and connect them to controller functions
router.get('/', authenticateToken, UserController.getUser);
router.get('/all', UserController.getAllUsers);
// router.post('/', authenticateToken, UserController.createUser);
router.get('/:id', authenticateToken, UserController.getUserById);
router.get('/profile/:username', UserController.getUserByUsername);
router.put('/', validateUsernameInput, authenticateToken, UserController.updateUser);
router.delete('/:id', authenticateToken, UserController.deleteUser);
router.get('/validate-username/:username', authenticateToken, UserController.validateUsername);


module.exports = router;
