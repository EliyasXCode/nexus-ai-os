import { Conversation } from '../models/Conversation.js';
import { AgentOrchestrator } from '../agents/agent.orchestrator.js';

export const sendMessage = async (req, res, next) => {
  try {
    const { message, conversationId, selectedAgent, image } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message content cannot be empty.',
      });
    }

    let conversation = null;

    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        user: req.user._id,
      });
    }

    if (!conversation) {
      // Create new conversation
      const truncatedTitle = message.length > 35 ? `${message.substring(0, 32)}...` : message;
      conversation = await Conversation.create({
        user: req.user._id,
        title: truncatedTitle,
        selectedAgent: selectedAgent || 'AUTO',
        messages: [],
      });
    }

    // Append user message
    conversation.messages.push({
      role: 'user',
      content: message,
      agent: selectedAgent || 'AUTO',
      image: image ? image.mimeType : null,
      createdAt: new Date(),
    });

    // Run multi-agent orchestrator
    const agentResult = await AgentOrchestrator.run({
      user: req.user,
      userMessage: message,
      conversationId: conversation._id,
      forcedAgent: selectedAgent,
      history: conversation.messages.slice(0, -1),
      image,
    });

    // Append assistant reply with agent activity and tool calls
    conversation.messages.push({
      role: 'assistant',
      content: agentResult.content,
      agent: agentResult.agent,
      toolCalls: agentResult.toolsUsed,
      agentActivity: agentResult.agentActivity,
      createdAt: new Date(),
    });

    await conversation.save();

    return res.status(200).json({
      success: true,
      conversationId: conversation._id,
      title: conversation.title,
      response: agentResult.content,
      agent: agentResult.agent,
      confidence: agentResult.confidence,
      reason: agentResult.reason,
      toolsUsed: agentResult.toolsUsed,
      agentActivity: agentResult.agentActivity,
      durationMs: agentResult.durationMs,
    });
  } catch (error) {
    console.error('[Chat Controller Error]:', error);
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ user: req.user._id })
      .select('title selectedAgent updatedAt createdAt')
      .sort({ updatedAt: -1 })
      .limit(30);

    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    next(error);
  }
};

export const getConversationById = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found or unauthorized',
      });
    }

    return res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    next(error);
  }
};

export const updateConversation = async (req, res, next) => {
  try {
    const { title } = req.body;
    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    return res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
