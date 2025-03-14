// Agent.js (Updated Agent Model)
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const agentSchema = new mongoose.Schema({
    agentId: { 
        type: String, 
        default: () => uuidv4(), 
        unique: true,
        immutable: true
    },
    name: { type: String, required: true },
    state: { type: String, default: 'inactive' },
    lastConnection: Date,
    remoteConfiguration: Boolean
});


agentSchema.index({ agentId: 1 }, { unique: true });

module.exports = mongoose.model('Agent', agentSchema);