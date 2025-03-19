const ConfigFile = require('../models/configFileModel');

class ConfigService {
    async createConfigFile(agentId, rawConfig) {
        try {

            const existingConfig = await ConfigFile.findOne({ agentId });

            if (existingConfig) {
                throw new Error('A configuration file for this agentId already exists');
            }

            const newConfig = new ConfigFile({ agentId, rawConfig });
            const savedConfig = await newConfig.save();
            return savedConfig;
        } catch (error) {
            console.error('Error creating config file:', error);
            throw error;
        }
    }

    async getConfigByAgentId(agentId) {
        try {
            const config = await ConfigFile.findOne({ agentId }).lean();
            if (!config) {
                throw new Error('Config file not found');
            }
            return config;
        } catch (error) {
            console.error('Error fetching config file:', error);
            throw error;
        }
    }

    async updateConfigFile(agentId, rawConfig) {
        try {
            const updatedConfig = await ConfigFile.findOneAndUpdate(
                { agentId },
                { $set: { rawConfig, updatedAt: new Date() } },
                { new: true }
            );

            if (!updatedConfig) {
                throw new Error('Config file not found for this agentId');
            }

            return updatedConfig;
        } catch (error) {
            console.error('Error updating config file:', error);
            throw error;
        }
    }

    async deleteConfigFile(agentId) {
        try {
            const deletedConfig = await ConfigFile.findOneAndDelete({ agentId });

            if (!deletedConfig) {
                throw new Error('Config file not found for this agentId');
            }

            return deletedConfig;
        } catch (error) {
            console.error('Error deleting config file:', error);
            throw error;
        }
    }
}

module.exports = new ConfigService();