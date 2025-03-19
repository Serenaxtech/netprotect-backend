const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/orgController');


router.get('/all', organizationController.getAllOrganizations);
router.post('/', organizationController.createOrganization);
router.get('/:org_id', organizationController.getOrganizationById);
router.put('/:org_id', organizationController.updateOrganization);
router.delete('/:org_id', organizationController.deleteOrganization);
router.post('/:org_id/agent/:agent_id', organizationController.addAgentToOrganization);
router.delete('/:org_id/agent/:agent_id', organizationController.removeAgentFromOrganization);
router.delete('/:org_id/agent', organizationController.deleteAllAgentsFromOrganization);

module.exports = router;