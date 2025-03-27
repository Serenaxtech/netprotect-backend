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
            const { agent_name: name, accept_remote_config: remoteConfiguration, agent_organization: organizationId } = req.body;
    
            if (!name) {
                return res.status(400).json({ message: 'Agent name is required' });
            }
    
            const agent_data = { name, remoteConfiguration, organizationId};
    
            const { created_agent, agent_token } = await agentService.createAgent(agent_data);

            console.log(created_agent);
    
            res.status(201).json(
                {
                    message: "success",
                    "data": {
                        "agent_id": created_agent.agentId,
                        "agent_name": created_agent.name,
                        "agent_token": agent_token
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


    // For Admin and Integrator Users
    async getAllAgentsByOrganizations(req, res){
        try {

            const all_agents = [];
            
            console.log(req.user.organizations);

            for (const org_id of req.user.organizations) {
                const agents = await agentService.getAllAgentsByOrganizationId(org_id);
                all_agents.push(...agents);
            }

            const all_agents_formatted = all_agents.map(agent => ({
                agent_id: agent.agentId,
                agent_name: agent.name,
                agent_organization: agent.organizationId
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
            const list_of_organizations = req.user.organizations;
            const role = req.user.role;

            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

            if (!uuidRegex.test(agent_id)) {
                return res.status(400).json({ message: 'Invalid agentId format' });
            }

            const agent = await agentService.getAgentById(agent_id, list_of_organizations, role);

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
            const valid_states = ['active', 'inactive']
            const { agent_id } = req.params;
            const { agent_name, agent_state, agent_remote_config } = req.body;

            const list_of_organizations = req.user.organizations;
            const role = req.user.role;

            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

            if (!uuidRegex.test(agent_id)) {
                return res.status(400).json({ message: 'Invalid agentId format' });
            }
            
            const update_data = {};

            if (!valid_states.includes(agent_state)) {
                return res.status(400).json({error: 'invalid agent state'});
            }

            if (agent_name !== undefined) update_data.name = agent_name;
            if (agent_state !== undefined && role === 'root') update_data.state = agent_state;
            


            // if (agent_last_connection !== undefined) update_data.lastConnection = agent_last_connection;
            if (agent_remote_config !== undefined && role == 'root') update_data.remoteConfiguration = agent_remote_config;

            if (Object.keys(update_data).length === 0) {
                return res.status(400).json({ message: 'No fields to update' });
            }
            
            const updated_agent = await agentService.updateAgentById(agent_id, update_data, list_of_organizations, role);

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

    async revokeToken(req, res) {
        try {
            const { agent_id } = req.params;

            const { stopped_agent, revoked_token } = await agentService.revokeToken(agent_id);

            res.status(200).json({
                message: 'Token revoked successfully',
                "data": {
                    "agent_id": stopped_agent.agentId,
                    "agent_name": stopped_agent.name,
                    "agent_state": stopped_agent.state,
                    "remote_config": stopped_agent.remoteConfiguration,
                    "agent_last_connection": stopped_agent.lastConnection,
                    "agent_token": revoked_token
                },
            });
        
        } catch (error) {
            if (error.message === 'Token not found') {
                return res.status(404).json({ message: 'Token not found' });
            }
            console.error('Error in revokeToken controller:', error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }

    async receiveData(req, res){
        try {

        } catch(error) {

        }
    }


    async getConfigFile(req, res){
        try {

        } catch(error) {
            
        }
    }
}

module.exports = new agentController();