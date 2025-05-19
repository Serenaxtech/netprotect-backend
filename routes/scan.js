const express = require('express');
const authenticateAgent = require('../middelwares/agentAuthMiddleware');
const authMiddleware = require('../middelwares/authMiddleware');
const roleMiddleware = require('../middelwares/roleMiddelware');
const scanResultController = require('../controllers/scanController');

const router = express.Router();


router.post('/', authenticateAgent, scanResultController.createScanResult);

router.get('/agent/:agent_id',  authMiddleware, scanResultController.getScanResultsByAgent);

// router.get('/scan-name/:scanName', scanResultController.getScanResultsByScanName);

router.get('/agent/:agent_id/latest',  authMiddleware, scanResultController.getLatestScanResultForAgent);

router.delete('/agent/:agent_id',  authMiddleware, roleMiddleware('root', 'integrator', 'admin'), scanResultController.deleteScanResultsByAgent);

module.exports = router;