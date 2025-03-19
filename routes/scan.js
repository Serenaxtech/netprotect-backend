const express = require('express');
const router = express.Router();
const scanResultController = require('../controllers/scanController');

router.post('/', scanResultController.createScanResult);

router.get('/agent/:agent_id', scanResultController.getScanResultsByAgent);

// router.get('/scan-name/:scanName', scanResultController.getScanResultsByScanName);

router.get('/agent/:agent_id/latest', scanResultController.getLatestScanResultForAgent);

router.delete('/agent/:agent_id', scanResultController.deleteScanResultsByAgent);

module.exports = router;