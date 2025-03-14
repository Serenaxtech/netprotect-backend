const crypto = require('crypto');
const Agent = require('../models/agentModel')

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

    async createAgent(agent_data) {
        try {
            const agent_data_withtime = {
                ...agent_data,
                lastConnection: new Date().toISOString(),
            };

            const newAgent = new Agent(agent_data_withtime);
            const savedAgent = await newAgent.save();

            return savedAgent;

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

}


module.exports = new AgentService();