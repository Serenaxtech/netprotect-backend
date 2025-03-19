const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
    agentId: {
        type: String,
        required: true,
        unique: true
    },
    rawConfig: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});


configSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('ConfigFile', configSchema);