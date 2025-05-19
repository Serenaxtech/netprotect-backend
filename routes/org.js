const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/orgController');
const roleMiddleware = require('../middelwares/roleMiddelware');
const authMiddleware = require('../middelwares/authMiddleware');


router.get('/all', authMiddleware, roleMiddleware('root'), organizationController.getAllOrganizations);
router.post('/', authMiddleware, roleMiddleware('root'), organizationController.createOrganization);
router.get('/:org_id', authMiddleware, roleMiddleware('root', 'integrator', 'admin'), organizationController.getOrganizationById);
router.put('/:org_id',  authMiddleware, roleMiddleware('root', 'integrator', 'admin'), organizationController.updateOrganization);
router.delete('/:org_id',  authMiddleware, roleMiddleware('root'), organizationController.deleteOrganization);
router.post('/:org_id/agent/:agent_id',  authMiddleware, roleMiddleware('root', 'integrator'), organizationController.addAgentToOrganization);
router.delete('/:org_id/agent/:agent_id',  authMiddleware, roleMiddleware('root', 'integrator'), organizationController.removeAgentFromOrganization);
router.delete('/:org_id/agent',  authMiddleware, roleMiddleware('root', 'integrator'), organizationController.deleteAllAgentsFromOrganization);

module.exports = router;