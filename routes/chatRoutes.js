const express = require('express');
const router = express.Router();


const ChatController = require('../controllers/ChatController');


// Submit chat
router.post('/submit-prompt', ChatController.submitPrompt)

router.post('/get-recent-title', ChatController.getRecentTitle)




module.exports = router