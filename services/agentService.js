const crypto = require('crypto');
const Agent = require('../models/agentModel')
const Org = require('../models/organizationModel')
const AgentToken = require('../models/agentTokenModel')




class AgentService {

    async generateAuthToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    async getAllAgents() {
        try {
            const agents = await Agent.find().lean();
            
            return agents;

        } catch (error) {
            console.error('Error fetching agents:', error);
            throw new Error(`Error fetching agents: ${error.message}`);
        }
    }

    async getAllAgentsByOrganizationId(org_id) {
        try {
            const organization = await Org.findById(org_id);

            // console.log(organization);

            const agents_id = organization.agentIds;

            const agents = [];
            for (const agent_id of agents_id) {
                const agent = await Agent.find({ "agentId": agent_id }).lean();
                agents.push(...agent);
            }
            
            return agents;

        } catch (error) {
            console.error('Error fetching agents:', error);
            throw new Error(`Error fetching agents: ${error.message}`);
        }
    }

    async updateAgentLastConnection(agent_id) {
        try {

            const updatedAgent = await Agent.findOneAndUpdate(
                { "agentId": agent_id },
                { $set: { lastConnection: new Date().toISOString() } }, 
                { new: true, runValidators: true }
            ).lean();

            if (!updatedAgent) {
                throw new Error('Agent not found');
            }

            return updatedAgent;
        
        } catch (error) {
            console.error('Error updating agent last connection:', error);
            throw error;
        }
    }

    async updateAgentById(agent_id, updateData, list_of_organizations, role) {
        try { 
            const agent = await Agent.findOne({ "agentId": agent_id }).lean();
            
            if (!agent) {
                throw new Error('Agent not found');
            }

            if ( !(role === 'root') ) {
                if (!list_of_organizations.includes(agent.organizationId) ) {
                    throw new Error('Agent not found');
                }
            }

            const updatedAgent = await Agent.findOneAndUpdate(
                { "agentId": agent_id },
                { $set: updateData }, 
                { new: true, runValidators: true }
            ).lean();

            if (!updatedAgent) {
                throw new Error('Agent not found');
            }
            return updatedAgent;
        } catch (error) {
            console.error('Error updating agent by ID:', error);
            throw error;
        }
    }

    async getAgentById(agent_id, list_of_organizations, role) {
        console.log(agent_id);
        try {
            const agent = await Agent.findOne({ "agentId": agent_id }).lean();
            
            if (!agent) {
                throw new Error('Agent not found');
            }

            if ( role !== 'root' ) {
                if (!list_of_organizations.includes(agent.organizationId) ) {
                    throw new Error('Agent not found');
                }
            }
            console.log(agent);

            return agent;
        
        } catch (error) {
            console.error('Error fetching agent by ID:', error);
            throw error;
        } 
    }

    async createAgentToken(agent_id) {
        try {
            const token = await this.generateAuthToken();

            const newToken = new AgentToken({
                agent: agent_id,
                token: token, 
            });

            await newToken.save();
            return token;
        } catch (error) {
            console.error('Error creating agent token:', error);
            throw new Error(`Error creating agent token: ${error.message}`);
        }
    }

    async createAgent(agent_data) {
        try {
            const agent_data_withtime = {
                ...agent_data,
                lastConnection: new Date().toISOString(),
            };

            const newAgent = new Agent(agent_data_withtime);

            const agentOrganization = await Org.findById(agent_data.organizationId);
            agentOrganization.agentIds.push(newAgent.agentId);
            await agentOrganization.save();

            const savedAgent = await newAgent.save();
            
            const plainTextToken = await this.createAgentToken(savedAgent._id);

            return { created_agent: savedAgent, agent_token: plainTextToken };

        } catch (error) {
            console.error('Error creating agent:', error);
            throw new Error(`Error creating agent: ${error.message}`);
        }
    }

    async deleteAgentById(agent_id) {
        try {
            const deletedAgent = await Agent.findOneAndDelete({ "agentId": agent_id }).lean();

            if (!deletedAgent) {
                throw new Error('Agent not found');
            }
            return deletedAgent;
        
        } catch (error) {
            console.error('Error deleting agent by agentId:', error);
            throw error;
        }
    }

    async revokeToken(agent_id) {
        try {
            // !! This can be better i don't need to revoke a token
            // !! if it's already revoked
            const agent = await Agent.findOneAndUpdate(
                {"agentId": agent_id},
                {state: 'inactive'}
            );

            if (!agent) {
                throw new Error('Agent not found');
            }

            const token = await AgentToken.findOneAndUpdate(
                {"agent": agent._id},
                { revoked: true, revokedAt: new Date() },
                { new: true }
            );

            if (!token) {
                throw new Error('Token not found');
            }


            return {stopped_agent: agent, revoked_token: token};
        } catch (error) {
            console.error('Error revoking token:', error);
            throw error;
        }
    }

    async getAgentToken(agent_id, list_of_organizations, role) {
        try {
            // First find the agent to verify organization membership
            const agent = await Agent.findOne({ "agentId": agent_id }).lean();

            console.log(agent);
            
            if (!agent) {
                throw new Error('Agent not found');
            }
    
            // Check organization membership unless user is root
            if (role !== 'root') {
                if (!list_of_organizations.includes(agent.organizationId)) {
                    throw new Error('Agent not found');
                }
            }

            console.log(list_of_organizations);
    
            // Find the active token for this agent
            const agentToken = await AgentToken.findOne({
                agent: agent._id,
                revoked: false
            }).lean();

            console.log(agentToken);
    
            if (!agentToken) {
                throw new Error('Token not found');
            }
    
            return agentToken.token;
    
        } catch (error) {
            console.error('Error getting agent token:', error);
            throw error;
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


module.exports = new AgentService();