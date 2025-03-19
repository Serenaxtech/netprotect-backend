const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    adminEmail: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    organizationName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    agentIds: [{
        type: String, 
        required: false,
        ref: 'Agent'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Organization', organizationSchema);