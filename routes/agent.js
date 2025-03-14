var express = require('express');
const authenticateAgent = require('../middelwares/agentAuthMiddleware');
const agentAuthController = require('../controllers/agentController');

var router = express.Router();


router.get('/', authenticateAgent, function(req, res, next) {
    res.json({message: "Agent Auth "});
});

// update this to be only admin access
router.get('/all', agentAuthController.getAllAgents)

// update this to be only admin access
router.get( '/token/create', agentAuthController.createAgentAuthToken);

router.post( '/create', agentAuthController.createAgent);


module.exports = router;
