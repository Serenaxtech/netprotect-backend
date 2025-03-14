const crypto = require('crypto');

function generateAuthToken() {
    return crypto.randomBytes(32).toString('hex');
}


class AgentService {
    async createAgentToken(){
        return generateAuthToken()
    }
}

module.exports = new AgentService();