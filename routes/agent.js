var express = require('express');
const authenticateAgent = require('../middelwares/agentAuthMiddleware');
const agentAuthController = require('../controllers/agentAuthController');

var router = express.Router();


router.get('/', authenticateAgent, function(req, res, next) {
    res.json({message: "Agent Auth "});
});

// update this to be only admin access
router.get('/all', agentAuthController.getAllAgents)

// update this to be only admin access
router.get( '/token/create', agentAuthController.createAgentAuthToken);



module.exports = router;
