const express = require('express');
const AgentController = require('../controllers/AgentController')
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();


router.get('/', AgentController.getAllAgents);
router.post('/more_agents', AgentController.getMoreAgentsByUserId);
router.put('/:id', authenticateToken, AgentController.updateAgent); 
router.delete('/:id', authenticateToken, AgentController.deleteAgent); 
router.get('/:chatId', AgentController.getAgentById);  





router.post('/', authenticateToken, AgentController.createAgent); 


module.exports = router;
