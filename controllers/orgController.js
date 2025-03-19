const organizationService = require('../services/orgService');

class OrganizationController {
    async createOrganization(req, res) {
        try {
            const { admin_email, organization_name } = req.body;

            if (!admin_email || !organization_name) {
                return res.status(400).json({ error: 'adminEmail and organizationName are required' });
            }

            const newOrganization = await organizationService.createOrganization(admin_email, organization_name);
            res.status(201).json({ message: 'Organization created successfully', organization: newOrganization });
        } catch (error) {
            console.error('Error in createOrganization controller:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getOrganizationById(req, res) {
        try {
            const { org_id } = req.params;

            const organization = await organizationService.getOrganizationById(org_id);
            res.status(200).json({ message: 'Organization retrieved successfully', organization });
        } catch (error) {
            if (error.message === 'Organization not found') {
                return res.status(404).json({ error: 'Organization not found' });
            }
            console.error('Error in getOrganizationById controller:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async updateOrganization(req, res) {
        try {
            const { org_id } = req.params;
            const { admin_email, organization_name } = req.body;

            const updates = { admin_email, organization_name }

            if (Object.keys(updates).length === 0) {
                return res.status(400).json({ error: 'No updates provided' });
            }

            const updatedOrganization = await organizationService.updateOrganization(org_id, updates);
            res.status(200).json({ message: 'Organization updated successfully', organization: updatedOrganization });
        } catch (error) {
            if (error.message === 'Organization not found') {
                return res.status(404).json({ error: 'Organization not found' });
            }
            console.error('Error in updateOrganization controller:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async deleteOrganization(req, res) {
        try {
            const { org_id } = req.params;

            const deletedOrganization = await organizationService.deleteOrganization(org_id);
            res.status(200).json({ message: 'Organization deleted successfully', organization: deletedOrganization });
        } catch (error) {
            if (error.message === 'Organization not found') {
                return res.status(404).json({ error: 'Organization not found' });
            }
            console.error('Error in deleteOrganization controller:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async addAgentToOrganization(req, res) {
        try {
            const { org_id } = req.params;
            const { agent_id } = req.params;

            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(agent_id)) {
                return res.status(400).json({ message: 'Invalid agentId format' });
            }

            const updatedOrganization = await organizationService.addAgentToOrganization(org_id, agent_id);
            res.status(200).json({
                message: 'Agent added to organization successfully',
                organization: updatedOrganization
            });
        } catch (error) {
            if (error.message === 'Organization not found') {
                return res.status(404).json({ error: 'Organization not found' });
            }
            if (error.message === 'Agent not found') {
                return res.status(404).json({ error: 'Agent not found' });
            }
            console.error('Error in addAgentToOrganization controller:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async removeAgentFromOrganization(req, res) {
        try {
            const { org_id } = req.params;
            const { agent_id } = req.params;

            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(agent_id)) {
                return res.status(400).json({ message: 'Invalid agentId format' });
            }

            const updatedOrganization = await organizationService.removeAgentFromOrganization(org_id, agent_id);
            res.status(200).json({
                message: 'Agent removed from organization successfully',
                organization: updatedOrganization
            });
        } catch (error) {
            if (error.message === 'Organization not found') {
                return res.status(404).json({ error: 'Organization not found' });
            }
            console.error('Error in removeAgentFromOrganization controller:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async deleteAllAgentsFromOrganization(req, res) {
        try {
            const { org_id } = req.params;

            const updatedOrganization = await organizationService.deleteAllAgentsFromOrganization(org_id);
            res.status(200).json({
                message: 'All agents deleted successfully from the organization',
                organization: updatedOrganization
            });
        } catch (error) {
            if (error.message === 'Organization not found') {
                return res.status(404).json({ error: 'Organization not found' });
            }
            console.error('Error in deleteAllAgentsFromOrganization controller:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getAllOrganizations(req, res) {
        try {
            const filter = {};
            if (req.query.adminEmail) {
                filter.adminEmail = req.query.adminEmail;
            }
            if (req.query.organizationName) {
                filter.organizationName = req.query.organizationName;
            }
    
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
    
            const { organizations, total } = await organizationService.getAllOrganizations(filter, page, limit);
            res.status(200).json({
                message: 'Organizations retrieved successfully',
                organizations,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            });
        } catch (error) {
            console.error('Error in getAllOrganizations controller:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}


module.exports = new OrganizationController();