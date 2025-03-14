const agentAuthService = require('../services/agentAuthService');


class agentController {
    
    async createAgentAuthToken(req, res) {
        try {
            const agentAuthToken = await agentAuthService.createAgentToken();
            res.json({"agent-token": agentAuthToken});
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getAllAgents(req, res){
        try {
            console.log("Get All Agents")
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    // async getAgentAuthToken(req, res) {
    //     try {
            
    //     } catch (error) {

    //     }
    // }

    // async getAllCustomers(req, res) {
    //     try {
    //         // Fetch all customers from the service
    //         const customers = await customerService.getAllCustomers();
    //         res.json(customers);
    //     } catch (error) {
    //         console.error('Error fetching customers:', error);
    //         res.status(500).json({ message: 'Internal server error' });
    //     }
    // }

}

module.exports = new agentController();