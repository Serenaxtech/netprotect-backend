const ScanResult = require('../models/scanResultModel');

class ScanResultService {
    async createScanResult(scanName, scanResult, agentID) {
        try {
            const newScanResult = new ScanResult({
                scanName,
                scanResult,
                agentID
            });

            const savedScanResult = await newScanResult.save();
            return savedScanResult;
        } catch (error) {
            console.error('Error creating scan result:', error);
            throw new Error('Failed to create scan result');
        }
    }

    async getScanResultsByAgent(agent_id) {
        try {
            const scanResults = await ScanResult.find({ "agentId": agent_id }).sort({ scanDate: -1 });

            return scanResults;
        } catch (error) {
            console.error('Error fetching scan results by agent:', error);
            throw new Error('Failed to fetch scan results');
        }
    }

    // async getScanResultsByScanName(scanName) {
    //     try {
    //         const scanResults = await ScanResult.find({ scanName }).sort({ scanDate: -1 });
    //         return scanResults;
    //     } catch (error) {
    //         console.error('Error fetching scan results by scan name:', error);
    //         throw new Error('Failed to fetch scan results');
    //     }
    // }

    async getLatestScanResultForAgent(agent_id) {
        try {
            const latestScanResult = await ScanResult.findOne({ "agentId": agent_id }).sort({ scanDate: -1 });
            return latestScanResult;
        } catch (error) {
            console.error('Error fetching latest scan result:', error);
            throw new Error('Failed to fetch latest scan result');
        }
    }

    async deleteScanResultsByAgent(agent_id) {
        try {
            const deletedResults = await ScanResult.deleteMany({ "agentId": agent_id });
            return deletedResults;
        } catch (error) {
            console.error('Error deleting scan results by agent:', error);
            throw new Error('Failed to delete scan results');
        }
    }
}

module.exports = new ScanResultService();