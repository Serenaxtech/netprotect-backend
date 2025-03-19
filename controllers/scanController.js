const scanResultService = require('../services/scanResultService');

class ScanResultController {

    async createScanResult(req, res) {
        try {
            const { scan_name, scan_result, agent_id } = req.body;

            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

            if (!uuidRegex.test(agent_id)) {
                return res.status(400).json({ message: 'Invalid agent_id format' });
            }

            if (!scan_name || !scan_result || !agent_id) {
                return res.status(400).json({ error: 'scan_name, scan_result, and agent_id are required' });
            }

            const savedScanResult = await scanResultService.createScanResult(scan_name, scan_result, agent_id);
            
            res.status(201).json({ 
                message: 'Scan result created successfully'
            });

        } catch (error) {
            console.error('Error in createScanResult controller:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getScanResultsByAgent(req, res) {
        try {
            const { agent_id } = req.params;

            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

            if (!uuidRegex.test(agent_id)) {
                return res.status(400).json({ message: 'Invalid agent_id format' });
            }

            const scan_results = await scanResultService.getScanResultsByAgent(agent_id);
            res.status(200).json({ message: 'Scan results retrieved successfully', scan_results });
        } catch (error) {
            console.error('Error in getScanResultsByAgent controller:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getScanResultsByScanName(req, res) {
        try {
            const { scanName } = req.params;

            const scanResults = await scanResultService.getScanResultsByScanName(scanName);
            res.status(200).json({ message: 'Scan results retrieved successfully', scanResults });
        } catch (error) {
            console.error('Error in getScanResultsByScanName controller:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getLatestScanResultForAgent(req, res) {
        try {
            const { agent_id } = req.params;

            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

            if (!uuidRegex.test(agent_id)) {
                return res.status(400).json({ message: 'Invalid agent_id format' });
            }
            
            const latestScanResult = await scanResultService.getLatestScanResultForAgent(agent_id);
            
            if (!latestScanResult) {
                return res.status(404).json({ error: 'No scan results found for this agent' });
            }

            res.status(200).json({ message: 'Latest scan result retrieved successfully', scan_result: latestScanResult });
        
        } catch (error) {
            console.error('Error in getLatestScanResultForAgent controller:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async deleteScanResultsByAgent(req, res) {
        try {
            const { agent_id } = req.params;

            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

            if (!uuidRegex.test(agent_id)) {
                return res.status(400).json({ message: 'Invalid agent_id format' });
            }

            const deletedResults = await scanResultService.deleteScanResultsByAgent(agent_id);
            
            if (deletedResults.deletedCount === 0) {
                return res.status(404).json({ error: 'No scan results found for this agent' });
            }

            res.status(200).json({ message: 'All scan results deleted successfully', deletedCount: deletedResults.deletedCount });
        } catch (error) {
            console.error('Error in deleteScanResultsByAgent controller:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new ScanResultController();