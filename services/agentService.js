const crypto = require('crypto');
const Agent = require('../models/agentModel')

function generateAuthToken() {
    return crypto.randomBytes(32).toString('hex');
}


class AgentService {
    async createAgentToken(){
        return generateAuthToken();
    }

    async createAgent(agent_data){
        try{
            const newAgent = new Agent(agent_data);
            const savedAgent = await newAgent.save();

        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }
}

module.exports = new AgentService();