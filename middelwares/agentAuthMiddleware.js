const express = require('express');
const Agent = require('../models/agentModel');
const AgentToken = require('../models/agentTokenModel'); 

const authenticateAgent = async (req, res, next) => {

  const agentAuthToken = req.headers['x-agent-token']; 
  const agentId = req.headers['x-agent-id'];

  if (!agentAuthToken || !agentId) {
    return res.status(401).json({ error: 'Agent token required and Agent Id required' });
  }

  try {
    const agent = await Agent.findOne( { "agentId": agentId } );
    
    if (!agent) {
      return res.status(401).json({ error: 'Agent not found' });
    }

    const agent_retrieved_hashed_token = await AgentToken.findOne({ "agent": agent._id });

    if (!agent_retrieved_hashed_token) {
      return res.status(401).json({ error: 'Token not found for this agent' });
    }

    const isValidToken = await agent_retrieved_hashed_token.validateToken(agentAuthToken);

    if (!isValidToken){
      return res.status(401).json({ error: 'Invalid Token' });
    }

    agent.last_used = new Date();
    await agent.save();

    req.agent = agent;
    next();

  } catch (err) {
    next(err);
  }
};

module.exports = authenticateAgent;