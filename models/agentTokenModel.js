const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const tokenSchema = new mongoose.Schema({
    agent: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Agent',
        required: true 
    },
    token: { 
        type: String,
        required: true,
        set: (value) => bcrypt.hashSync(value, 10)
    },
    createdAt: { 
        type: Date, 
        default: Date.now,
    },

    revoked: {
        type: Boolean,
        default: false
    },

    revokedAt: {
        type: Date,
        default: null
    },

    lastUsed: Date
});


tokenSchema.index({ agent: 1 });

tokenSchema.methods.validateToken = async function(candidateToken) {
    return await bcrypt.compare(candidateToken, this.token);
};

module.exports = mongoose.model('AgentToken', tokenSchema);