const express = require('express');
const { Agent } = require('../models/agentModel'); // Your database model

const authenticateAgent = async (req, res, next) => {
  const agentAuthToken = req.headers['x-agent-token'];

  if (!agentAuthToken) {
    return res.status(401).json({ error: 'Agent token required' });
  }

  try {
    // Find agent by hashed API key
    const agent = await Agent.findOne({ where: { api_key: agentAuthToken } });
    
    if (!agent) {
      return res.status(401).json({ error: 'Invalid Agent token' });
    }

    // Update last_used timestamp
    agent.last_used = new Date();
    await agent.save();

    // Attach agent to request object
    req.agent = agent;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authenticateAgent;