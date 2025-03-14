const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {

        await mongoose.connect(process.env.MONGO_AGENT_URI);
        mongoose.set('debug', true);

        console.log('[+] Successfully Connected To MongoDB');

    } catch (err) {
        console.error('[-] MongoDB connection error:', err.message);
        process.exit(1);
    
    }
};

module.exports = connectDB;