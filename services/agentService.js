const crypto = require('crypto');
const Agent = require('../models/agentModel')

function generateAuthToken() {
    return crypto.randomBytes(32).toString('hex');
}


class AgentService {
    async createAgentToken(){
        return generateAuthToken();
    }

    async createAgent(agent_data) {
        try {
            const agent_data_withtime = {
                ...agent_data,
                lastConnection: new Date().toISOString(), // Store as UTC ISO string
            };

            const newAgent = new Agent(agent_data_withtime);
            const savedAgent = await newAgent.save();

            return savedAgent;

        } catch (error) {
            console.error('Error creating agent:', error);
            throw new Error(`Error creating agent: ${error.message}`);
        }
    }
}

module.exports = new AgentService();