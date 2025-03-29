var express = require('express');
const authenticateAgent = require('../middelwares/agentAuthMiddleware');
const authMiddleware = require('../middelwares/authMiddleware');
const roleMiddleware = require('../middelwares/roleMiddelware');
const agentController = require('../controllers/agentController');
const configFileController = require('../controllers/configFileController');

var router = express.Router();


router.get('/', authenticateAgent, function(req, res, next) {
    res.json({message: "Agent Authenticated"});
});

router.post( '/create', authMiddleware, roleMiddleware('root', 'admin', 'integrator'), agentController.createAgent);

// Only root account
router.get('/root/all',authMiddleware, roleMiddleware('root'), agentController.getAllAgents);

// only admin and integrator accounts
// This will get all the agents that an organization had (the organization id will be taken from the an Admin or User JWT Token)
router.get('/all',authMiddleware, roleMiddleware('admin', 'integrator'), agentController.getAllAgentsByOrganizations);

// Get Agent By ID, this endpoint is for admin and integrator role
router.get('/:agent_id', authMiddleware, roleMiddleware('root', 'admin', 'integrator'), agentController.getAgentById);
router.put('/:agent_id', authMiddleware, roleMiddleware('root', 'admin', 'integrator'), agentController.updateAgentById);

// Only root account can revoke tokens
router.get('/revoke/:agent_id', authMiddleware, roleMiddleware('root'), agentController.revokeToken);

// Only root account can delete agents
// a client will need to contact us in order to remove an agent
router.delete('/:agent_id', authMiddleware, roleMiddleware('root'), agentController.deleteAgentById);

// update this to be only admin access
// I need to protect all endpoints from csrf attack !!!!!!!!
router.get('/checkin/:agent_id', authenticateAgent, agentController.updateAgentLastConnection);

// Only root user can create tokens manually for agents
// this will not create an agent token object in the mongodb database
router.get( '/token/create', authMiddleware, roleMiddleware('root'), agentController.createAgentAuthToken);


// this is replaced by the scan endpoint /api/v1/scan
router.post( '/collector', authenticateAgent, agentController.receiveData);

// ? TO DO - Endpoint to send the config file to the agent
// ? if the remote configuration is allowed
router.get( '/:agent_id/config', authMiddleware, roleMiddleware('root', 'admin', 'integrator'), configFileController.getConfigByAgentId);
router.post( '/:agent_id/config', authMiddleware, roleMiddleware('root'), configFileController.createConfigFile);
router.put( '/:agent_id/config', authMiddleware, roleMiddleware('root', 'admin', 'integrator'), configFileController.updateConfigFile);
router.delete( '/:agent_id/config', authMiddleware, roleMiddleware('root', 'admin', 'integrator'), configFileController.deleteConfigFile);




module.exports = router;
