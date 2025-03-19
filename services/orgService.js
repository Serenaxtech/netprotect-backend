const Organization = require('../models/organizationModel');
const Agent = require('../models/agentModel');

class OrganizationService {
    async createOrganization(adminEmail, organizationName) {
        try {
            const newOrganization = new Organization({ adminEmail, organizationName });
            const savedOrganization = await newOrganization.save();
            return savedOrganization;
        } catch (error) {
            console.error('Error creating organization:', error);
            throw new Error('Failed to create organization');
        }
    }

    async getOrganizationById(organizationId) {
        try {
            const organization = await Organization.findById(organizationId).lean();
            if (!organization) {
                throw new Error('Organization not found');
            }
            return organization;
        } catch (error) {
            console.error('Error fetching organization by ID:', error);
            throw error;
        }
    }

    async updateOrganization(organizationId, updates) {
        try {
            const updatedOrganization = await Organization.findByIdAndUpdate(
                organizationId,
                { $set: {"adminEmail": updates.admin_email, "organizationName": updates.organization_name } },
                { new: true, runValidators: true }
            ).lean();

            if (!updatedOrganization) {
                throw new Error('Organization not found');
            }
            return updatedOrganization;
        } catch (error) {
            console.error('Error updating organization:', error);
            throw error;
        }
    }

    async deleteOrganization(organizationId) {
        try {
            const deletedOrganization = await Organization.findByIdAndDelete(organizationId).lean();
            if (!deletedOrganization) {
                throw new Error('Organization not found');
            }
            return deletedOrganization;
        } catch (error) {
            console.error('Error deleting organization:', error);
            throw error;
        }
    }

    async addAgentToOrganization(organizationId, agentID) {
        try {
            const organization = await Organization.findById(organizationId);

            if (!organization) {
                throw new Error('Organization not found');
            }

            const agent = await Agent.findOne({ "agentId": agentID });
            if (!agent) {
                throw new Error('Agent not found');
            }

            // Add the agentID to the organization's agentIds array if not already present
            if (!organization.agentIds.includes(agentID)) {
                organization.agentIds.push(agentID);
                await organization.save();
            }

            return organization;
        } catch (error) {
            console.error('Error adding agent to organization:', error);
            throw error;
        }
    }

    async removeAgentFromOrganization(organizationId, agentID) {
        try {
            const organization = await Organization.findById(organizationId);
            if (!organization) {
                throw new Error('Organization not found');
            }

            // Remove the agentID from the organization's agentIds array
            organization.agentIds = organization.agentIds.filter(id => id !== agentID);
            await organization.save();

            return organization;
        } catch (error) {
            console.error('Error removing agent from organization:', error);
            throw error;
        }
    }

    async getAllOrganizations(filter = {}, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const organizations = await Organization.find(filter)
                .skip(skip)
                .limit(limit)
                .lean();
    
            const total = await Organization.countDocuments(filter);
            return { organizations, total };
        } catch (error) {
            console.error('Error fetching all organizations:', error);
            throw new Error('Failed to fetch organizations');
        }
    }

    async deleteAllAgentsFromOrganization(organizationId) {
        try {
            const organization = await Organization.findById(organizationId);
            
            if (!organization) {
                throw new Error('Organization not found');
            }

            const agentIDs = organization.agentIds;

            if (agentIDs.length > 0) {
                await Agent.deleteMany({ agentID: { $in: agentIDs } });
            }

            organization.agentIds = [];
            await organization.save();

            return organization;
        } catch (error) {
            console.error('Error deleting all agents from organization:', error);
            throw error;
        }
    }

}

module.exports = new OrganizationService();