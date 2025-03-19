const crypto = require('crypto');
const Agent = require('../models/agentModel')
const AgentToken = require('../models/agentTokenModel')

function generateAuthToken() {
    return crypto.randomBytes(32).toString('hex');
}


class AgentService {
    async createAgentToken(){
        return generateAuthToken();
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

    async updateAgentById(agent_id, updateData) {
        try {
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

    async getAgentById(agent_id) {
        console.log(agent_id);
        try {
            const agent = await Agent.findOne({ "agentId": agent_id }).lean();

            if (!agent) {
                throw new Error('Agent not found');
            }

            return agent;
        
        } catch (error) {
            console.error('Error fetching agent by ID:', error);
            throw error;
        } 
    }

    async createAgentToken(agent_id) {
        try {
            const token = generateAuthToken();

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