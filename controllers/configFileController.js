const configFileService = require('../services/configFileService');


class configFileController {

    async createConfigFile(req, res) {

        try {
            const { agent_id } = req.params;

            const  { raw_config } = req.body;

            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
            if (!uuidRegex.test(agent_id)) {
                return res.status(400).json({ message: 'Invalid agentId format' });
            }

            const agent_config_file = await configFileService.createConfigFile(agent_id, raw_config);

            res.status(201).json({
                message: "success"
            });
        
        } catch (error) {

            if (error.message === 'A configuration file for this agentId already exists') {
                return res.status(409).json({ error: 'A configuration file for this agentId already exists' });
            }

            res.status(500).json({ message: 'Internal server error' });
        }

    }

    async getConfigByAgentId(req, res) {

        try {
            const { agent_id } = req.params;
            const organization_ids = req.user.organizations;
            const role = req.user.role;

            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

            if (!uuidRegex.test(agent_id)) {
                return res.status(400).json({ message: 'Invalid agentId format' });
            }

            const agent_config_file = await configFileService.getConfigByAgentId(agent_id, organization_ids, role);

            res.status(201).json({
                message: "success",
                agent_config_file
            });
        
        } catch (error) {
            if (error.message === 'Config file not found') {
                return res.status(404).json({ message: 'Config file not found' });
            }

            if (error.message === 'Agent does not exist') {
                return res.status(404).json({ message: 'Agent does not exist' });
            }

            res.status(500).json({ message: 'Internal server error' });
        }

    }

    async updateConfigFile(req, res) {

        try {
            const { agent_id } = req.params;

            const  { raw_config } = req.body;

            const organization_ids = req.user.organizations;

            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
            if (!uuidRegex.test(agent_id)) {
                return res.status(400).json({ message: 'Invalid agentId format' });
            }

            const updated_config = await configFileService.updateConfigFile(agent_id, raw_config, organization_ids);
            res.status(200).json({ 
                message: 'Config file updated successfully'
            });

        } catch (error) {
            if (error.message === 'Config file not found for this agentId') {
                return res.status(404).json({ error: 'Config file not found for this agentId' });
            }
            console.error('Error in updateConfig controller:', error);
            res.status(500).json({ error: 'Internal server error' });
        }

    }

    async deleteConfigFile(req, res) {
        try {
            const { agent_id } = req.params;

    
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
            if (!uuidRegex.test(agent_id)) {
                return res.status(400).json({ message: 'Invalid agentId format' });
            }
    
            const deletedConfig = await configFileService.deleteConfigFile(agent_id );
            
            res.status(200).json({ 
                message: 'Config file deleted successfully', 
                config: deletedConfig 
            });

        } catch (error) {
            
            if (error.message === 'Config file not found for this agentId') {
                return res.status(404).json({ error: 'Config file not found for this agentId' });
            }
            console.error('Error in deleteConfig controller:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

}

module.exports = new configFileController();