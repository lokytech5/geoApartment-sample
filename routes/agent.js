const express = require('express');
const { validateCreateAgent, validateAgentUpdate } = require('../validation/agentValidator')
const agentController = require('../controllers/agentController')
const auth = require('../middleware/auth')
const router = express.Router();

router.get('/', agentController.getAllAgents);
router.get('/me', auth, agentController.getUserProfile);
router.post('/', validateCreateAgent, agentController.createAgent);
router.put('/:id', auth, validateAgentUpdate, agentController.updateAgent);
router.get('/:id', auth, agentController.getAgentById);
router.delete('/:id', auth, agentController.deleteAgentById);

module.exports = router;