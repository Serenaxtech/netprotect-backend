const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const agentSchema = new mongoose.Schema({
    agentId: { 
        type: String, 
        default: () => uuidv4(), 
        unique: true
    },
    name: { type: String, required: true },
    state: { type: String, default: 'active' },
    lastConnection: { type: Date, default: Date.now },
    remoteConfiguration: { type: Boolean, required: true },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    }
});


agentSchema.pre('save', function (next) {
    if (this.isModified('agentId')) {
        throw new Error('Agent ID cannot be modified');
    }
    next();
});

// agentSchema.index({ agentId: 1 }, { unique: true });

module.exports = mongoose.model('Agent', agentSchema);