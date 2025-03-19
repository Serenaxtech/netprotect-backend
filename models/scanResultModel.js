const mongoose = require('mongoose');

const scanResultSchema = new mongoose.Schema({
    scanName: {
        type: String,
        required: true,
        trim: true
    },
    scanResult: {
        type: Object,
        required: true
    },
    scanDate: {
        type: Date,
        default: Date.now 
    },
    agentId: {
        type: String,
        required: true,
        index: true
    }
}, { timestamps: true });


module.exports = mongoose.model('ScanResult', scanResultSchema);