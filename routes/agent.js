var express = require('express');
const authenticateAgent = require('../middelwares/agentAuthMiddleware');
const agentController = require('../controllers/agentController');
const configFileController = require('../controllers/configFileController');

var router = express.Router();


router.get('/', authenticateAgent, function(req, res, next) {
    res.json({message: "Agent Authenticated"});
});

// update this to be only admin access
router.get('/all', agentController.getAllAgents);

// update this to be only admin access
router.get('/:agent_id', agentController.getAgentById);

// update this to be only admin access
router.put('/:agent_id', agentController.updateAgentById);

// update this to be only admin access
router.get('/revoke/:agent_id', agentController.revokeToken);

// update this to be only admin access
router.delete('/:agent_id', agentController.deleteAgentById);

// update this to be only admin access
// I need to protect all endpoints from csrf attack !!!!!!!!
router.get('/checkin/:agent_id', authenticateAgent, agentController.updateAgentLastConnection);

// update this to be only admin access
router.get( '/token/create', agentController.createAgentAuthToken);


// ? TO DO - Endpoint to receive data from the agent
router.post( '/collector', authenticateAgent, agentController.receiveData);

// ? TO DO - Endpoint to send the config file to the agent
// ? if the remote configuration is allowed
router.get( '/:agent_id/config', configFileController.getConfigByAgentId);
router.post( '/:agent_id/config', configFileController.createConfigFile);
router.put( '/:agent_id/config', configFileController.updateConfigFile);
router.delete( '/:agent_id/config', configFileController.deleteConfigFile);

router.post( '/create', agentController.createAgent);


module.exports = router;
