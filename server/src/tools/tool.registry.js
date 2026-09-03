import { taskTools } from './task.tools.js';
import { noteTools } from './note.tools.js';
import { utilityTools } from './utility.tools.js';

class ToolRegistry {
  constructor() {
    this.tools = new Map();
    this.registerAll([...taskTools, ...noteTools, ...utilityTools]);
  }

  register(tool) {
    if (!tool.name || !tool.execute) {
      throw new Error(`Invalid tool registration: missing name or execute method`);
    }
    this.tools.set(tool.name, tool);
  }

  registerAll(toolsList) {
    for (const tool of toolsList) {
      this.register(tool);
    }
  }

  getTool(name) {
    return this.tools.get(name);
  }

  getAllTools() {
    return Array.from(this.tools.values());
  }

  /**
   * Generates function declarations in the format expected by Gemini
   * config.tools = [{ functionDeclarations: [...] }]
   */
  getGeminiFunctionDeclarations(filterToolNames = null) {
    const list = filterToolNames
      ? filterToolNames.map((name) => this.tools.get(name)).filter(Boolean)
      : this.getAllTools();

    return [
      {
        functionDeclarations: list.map((tool) => ({
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters,
        })),
      },
    ];
  }

  /**
   * Safe execution of registered tool
   */
  async executeTool(name, args, context) {
    const tool = this.tools.get(name);
    if (!tool) {
      return {
        success: false,
        error: `Tool "${name}" is not registered in the NEXUS Tool Registry.`,
      };
    }

    try {
      // Validate arguments with Zod if schema exists
      let validatedArgs = args;
      if (tool.validationSchema) {
        const parsed = tool.validationSchema.safeParse(args || {});
        if (!parsed.success) {
          return {
            success: false,
            error: `Tool argument validation failed: ${parsed.error.errors
              .map((e) => `${e.path.join('.')}: ${e.message}`)
              .join(', ')}`,
          };
        }
        validatedArgs = parsed.data;
      }

      // Execute safely with user context
      const result = await tool.execute(validatedArgs, context);
      return result;
    } catch (error) {
      console.error(`[Tool Execution Error - ${name}]:`, error);
      return {
        success: false,
        error: `Error executing tool ${name}: ${error.message}`,
      };
    }
  }
}

export const toolRegistry = new ToolRegistry();
