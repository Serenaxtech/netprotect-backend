const agentService = require('../services/agentService');


class agentController {
    
    async createAgentAuthToken(req, res) {
        try {
            const agentAuthToken = await agentService.createAgentToken();
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
    
            const createdAgent = await agentService.createAgent(agent_data);
    
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
            console.error('Error creating agent:', error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }

    async getAllAgents(req, res){
        try {
            console.log("Get All Agents");
            const all_agents = await agentService.getAllAgents();

            const all_agents_formatted = all_agents.map(agent => ({
                agent_id: agent.agentId,
                agent_name: agent.name
            }));

            res.status(200).json({
                message: "success",
                data: all_agents_formatted
            });
        
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getAgentById(req, res) {
        try {

            const { agent_id } = req.params;

            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

            if (!uuidRegex.test(agent_id)) {
                return res.status(400).json({ message: 'Invalid agentId format' });
            }

            const agent = await agentService.getAgentById(agent_id);

            res.status(200).json(
                {
                    message: "success", 
                    "data": {
                        "agent_id": agent.agentId,
                        "agent_name": agent.name,
                        "agent_state": agent.state,
                        "remote_config": agent.remoteConfiguration,
                        "agent_last_connection": agent.lastConnection
                    }
                }
            );

        } catch (error) {

            if (error.message === 'Agent not found') {
                return res.status(404).json({ message: 'Agent not found' });
            }

            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deleteAgentById(req, res) {
        try {
            const { agent_id } = req.params;

            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

            if (!uuidRegex.test(agent_id)) {
                return res.status(400).json({ message: 'Invalid agentId format' });
            }

            const agent = await agentService.deleteAgentById(agent_id);

            res.status(200).json(
                { 
                    message: "Agent Deleted Successfully",
                    "data": {
                        "agent_id": agent.agentId,
                        "agent_name": agent.name,
                        "agent_state": agent.state,
                        "remote_config": agent.remoteConfiguration,
                        "agent_last_connection": agent.lastConnection
                    }
                }
            );

        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateAgentLastConnection(req, res) {
        try {
            const { agent_id } = req.params;

            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

            if (!uuidRegex.test(agent_id)) {
                return res.status(400).json({ message: 'Invalid agentId format' });
            }
            
            const updated_agent = await agentService.updateAgentLastConnection(agent_id);

            res.status(200).json(
                { 
                    message: "Agent Updated Successfully",
                    "data": {
                        "agent_id": updated_agent.agentId,
                        "agent_name": updated_agent.name,
                        "agent_state": updated_agent.state,
                        "remote_config": updated_agent.remoteConfiguration,
                        "agent_last_connection": updated_agent.lastConnection
                    }
                }
            );

        } catch (error) {

            if (error.message === 'Agent not found') {
                return res.status(404).json({ message: 'Agent not found' });
            }

            console.error('Error in updateAgentLastConnection controller:', error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }

    async updateAgentById(req, res) {
        try {
            const { agent_id } = req.params;
            const { agent_name, agent_state, agent_remote_config } = req.body;

            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

            if (!uuidRegex.test(agent_id)) {
                return res.status(400).json({ message: 'Invalid agentId format' });
            }
            
            const update_data = {};
            if (agent_name !== undefined) update_data.name = agent_name;
            if (agent_state !== undefined) update_data.state = agent_state;
            // if (agent_last_connection !== undefined) update_data.lastConnection = agent_last_connection;
            if (agent_remote_config !== undefined) update_data.remoteConfiguration = agent_remote_config;

            if (Object.keys(update_data).length === 0) {
                return res.status(400).json({ message: 'No fields to update' });
            }
            
            const updated_agent = await agentService.updateAgentById(agent_id, update_data);

            res.status(200).json(
                { 
                    message: "Agent Updated Successfully",
                    "data": {
                        "agent_id": updated_agent.agentId,
                        "agent_name": updated_agent.name,
                        "agent_state": updated_agent.state,
                        "remote_config": updated_agent.remoteConfiguration,
                        "agent_last_connection": updated_agent.lastConnection
                    }
                }
            );

        } catch (error) {

            if (error.message === 'Agent not found') {
                return res.status(404).json({ message: 'Agent not found' });
            }

            console.error('Error in updateAgentById controller:', error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
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