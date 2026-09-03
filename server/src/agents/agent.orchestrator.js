import { classifyUserIntent } from './supervisor.agent.js';
import { generalAgent } from './general.agent.js';
import { codingAgent } from './coding.agent.js';
import { plannerAgent } from './planner.agent.js';
import { studyAgent } from './study.agent.js';
import { taskAgent } from './task.agent.js';
import { notesAgent } from './notes.agent.js';
import { toolRegistry } from '../tools/tool.registry.js';
import { geminiService } from '../services/gemini.service.js';
import { Memory } from '../models/Memory.js';
import { AgentRun } from '../models/AgentRun.js';

const agentMap = {
  GENERAL: generalAgent,
  CODING: codingAgent,
  PLANNER: plannerAgent,
  STUDY: studyAgent,
  TASK: taskAgent,
  NOTES: notesAgent,
};

export const getAvailableAgents = () => {
  return Object.values(agentMap).map((a) => ({
    name: a.name,
    displayName: a.displayName,
    description: a.description,
    tools: a.allowedTools,
  }));
};

export class AgentOrchestrator {
  /**
   * Main entry point for processing a user chat message through the multi-agent pipeline
   */
  static async run({
    user,
    userMessage,
    conversationId = null,
    forcedAgent = null,
    history = [],
    image = null, // { data: base64, mimeType: string }
  }) {
    const startTime = Date.now();
    const activityLog = [];
    const toolsUsed = [];

    // Step 1: Log initial receipt
    activityLog.push({
      step: 'REQUEST_RECEIVED',
      detail: 'NEXUS OS received user input',
      timestamp: new Date(),
    });

    // Step 2: Route through Supervisor or respect user forcedAgent
    let selectedAgentName = forcedAgent && forcedAgent !== 'AUTO' ? forcedAgent : null;
    let classificationReason = 'User explicitly selected agent';
    let confidence = 1.0;

    if (!selectedAgentName) {
      activityLog.push({
        step: 'SUPERVISOR_EVALUATING',
        detail: 'Supervisor Agent analyzing intent and context...',
        timestamp: new Date(),
      });

      const classification = await classifyUserIntent(userMessage);
      selectedAgentName = classification.agent;
      classificationReason = classification.reason;
      confidence = classification.confidence;

      activityLog.push({
        step: 'AGENT_SELECTED',
        detail: `Intent identified: ${selectedAgentName} (${classificationReason || 'Matched'})`,
        timestamp: new Date(),
      });
    } else {
      activityLog.push({
        step: 'AGENT_SELECTED',
        detail: `Direct routing to: ${selectedAgentName}`,
        timestamp: new Date(),
      });
    }

    const agent = agentMap[selectedAgentName] || generalAgent;

    // Step 3: Load relevant memory if user has memory enabled
    let memoryContext = '';
    if (user.settings?.memoryEnabled !== false) {
      try {
        const memories = await Memory.find({ user: user._id }).limit(5);
        if (memories.length > 0) {
          memoryContext = `\nUser Memory & Preferences:\n${memories
            .map((m) => `- [${m.category}] ${m.key}: ${m.value}`)
            .join('\n')}\n`;
        }
      } catch (err) {
        console.warn('[Orchestrator] Memory fetch warning:', err.message);
      }
    }

    // Step 4: Build System Instruction
    const systemInstruction = `${agent.systemPrompt}
${memoryContext}
Current User Name: ${user.name}
Today's Date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Never expose internal database credentials or secrets.
Only call valid registered tools provided in your tool definitions.`;

    // Step 5: Build conversation contents array
    const contents = [];

    // Format recent history (limit to last 8 messages for token efficiency)
    const recentHistory = history.slice(-8);
    for (const msg of recentHistory) {
      if (msg.role === 'user') {
        contents.push({
          role: 'user',
          parts: [{ text: msg.content }],
        });
      } else if (msg.role === 'assistant') {
        contents.push({
          role: 'model',
          parts: [{ text: msg.content }],
        });
      }
    }

    // Prepare current turn parts
    const currentParts = [{ text: userMessage }];
    if (image && image.data && image.mimeType) {
      currentParts.push({
        inlineData: {
          data: image.data,
          mimeType: image.mimeType,
        },
      });
      activityLog.push({
        step: 'IMAGE_ATTACHED',
        detail: `Multimodal input attached (${image.mimeType})`,
        timestamp: new Date(),
      });
    }

    contents.push({
      role: 'user',
      parts: currentParts,
    });

    // Step 6: Tool declarations
    const geminiTools = agent.allowedTools.length > 0
      ? toolRegistry.getGeminiFunctionDeclarations(agent.allowedTools)
      : null;

    // Step 7: Execution Loop (Max 4 iterations)
    let iterations = 0;
    const MAX_ITERATIONS = 4;
    let finalResponseText = '';

    while (iterations < MAX_ITERATIONS) {
      iterations++;

      activityLog.push({
        step: 'AI_GENERATING',
        detail: `${agent.displayName} processing (Iteration ${iterations})...`,
        timestamp: new Date(),
      });

      const geminiResult = await geminiService.generateContent({
        systemInstruction,
        contents,
        tools: geminiTools,
        temperature: 0.4,
      });

      // Check for function calls
      const candidate = geminiResult.candidates?.[0];
      const modelContent = candidate?.content;
      const parts = modelContent?.parts || [];

      // Extract text parts
      const textParts = parts.filter((p) => p.text).map((p) => p.text);
      if (textParts.length > 0) {
        finalResponseText = textParts.join('\n');
      }

      // Check if function calls exist
      const functionCalls = parts.filter((p) => p.functionCall).map((p) => p.functionCall);

      if (functionCalls.length === 0) {
        // No further tool calls requested, we have our final response
        break;
      }

      // We have tool calls to execute
      // Append the model's turn to contents
      contents.push({
        role: 'model',
        parts,
      });

      // Execute each tool call
      const functionResponses = [];

      for (const fc of functionCalls) {
        const toolName = fc.name;
        const toolArgs = fc.args || {};

        activityLog.push({
          step: 'TOOL_INVOKED',
          detail: `Invoking tool: ${toolName}`,
          timestamp: new Date(),
        });

        // Execute tool through tool registry with authenticated user context
        const toolContext = { userId: user._id, userName: user.name };
        const toolResult = await toolRegistry.executeTool(toolName, toolArgs, toolContext);

        toolsUsed.push({
          toolName,
          args: toolArgs,
          result: toolResult,
          timestamp: new Date(),
        });

        activityLog.push({
          step: 'TOOL_COMPLETED',
          detail: `Tool ${toolName} completed: ${toolResult.success ? 'Success' : 'Error'}`,
          timestamp: new Date(),
        });

        functionResponses.push({
          functionResponse: {
            name: toolName,
            response: toolResult,
          },
        });
      }

      // Add tool results as a user/tool turn back to Gemini contents
      contents.push({
        role: 'user',
        parts: functionResponses,
      });
    }

    if (!finalResponseText) {
      finalResponseText = 'Task processed successfully by NEXUS AI.';
    }

    activityLog.push({
      step: 'RESPONSE_COMPLETE',
      detail: 'Generated final response for user',
      timestamp: new Date(),
    });

    const durationMs = Date.now() - startTime;

    // Record Agent Run asynchronously
    try {
      await AgentRun.create({
        user: user._id,
        conversation: conversationId,
        agent: selectedAgentName,
        intent: classificationReason,
        confidence,
        status: 'completed',
        toolsUsed,
        durationMs,
      });
    } catch (err) {
      console.warn('[Orchestrator] Failed to save AgentRun log:', err.message);
    }

    return {
      content: finalResponseText,
      agent: selectedAgentName,
      confidence,
      reason: classificationReason,
      toolsUsed,
      agentActivity: activityLog,
      durationMs,
    };
  }
}
