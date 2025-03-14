const agentAuthService = require('../services/agentService');


class agentController {
    
    async createAgentAuthToken(req, res) {
        try {
            const agentAuthToken = await agentAuthService.createAgentToken();
            res.json({"agent-token": agentAuthToken});
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createAgent(req, res) {
        try {
            const { agent_name: name, accept_remote_config: remoteConfiguration } = req.body;
    
            if (!name) {
                return res.status(400).json({ message: 'Agent name is required' });
            }
    
            const agent_data = { name, remoteConfiguration };
    
            const createdAgent = await agentAuthService.createAgent(agent_data);
    
            res.status(201).json(
                {
                    message: "success", 
                    "data": {
                        "agent_id": createdAgent.agentId,
                        "agent_name": createdAgent.name
                    }
                }
            );
    
        } catch (error) {
            console.error('Error creating agent:', error); // Log the error for debugging
            res.status(500).json({ message: 'Internal server error', error: error.message });
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