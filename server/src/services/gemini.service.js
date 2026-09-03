import { GoogleGenAI } from '@google/genai';

class GeminiService {
  constructor() {
    this.ai = null;
    this.initClient();
  }

  initClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      try {
        this.ai = new GoogleGenAI({ apiKey });
      } catch (err) {
        console.error('[Gemini Service] Initialization failed:', err.message);
      }
    } else {
      console.warn('[Gemini Service] GEMINI_API_KEY is not configured or is placeholder.');
    }
  }

  getModelName() {
    return process.env.GEMINI_MODEL || 'gemini-3.5-flash';
  }

  isConfigured() {
    return !!(this.ai && process.env.GEMINI_API_KEY);
  }

  /**
   * Helper to format friendly error messages
   */
  formatError(error) {
    const errStr = error?.message || String(error);

    if (errStr.includes('401') || errStr.includes('API_KEY_INVALID') || errStr.includes('API key')) {
      return {
        friendly: 'Gemini API authentication failed. Please check your GEMINI_API_KEY in the server configuration.',
        status: 401,
      };
    }
    if (errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('quota')) {
      return {
        friendly: 'NEXUS has temporarily reached its AI rate limit. Please try again in a few seconds.',
        status: 429,
      };
    }
    if (errStr.includes('404') || errStr.includes('models/')) {
      return {
        friendly: `The requested Gemini model (${this.getModelName()}) is unavailable. Please verify GEMINI_MODEL in server .env.`,
        status: 404,
      };
    }
    if (errStr.includes('fetch') || errStr.includes('ENOTFOUND') || errStr.includes('ETIMEDOUT')) {
      return {
        friendly: 'Network connectivity issue reaching Gemini AI services. Please check your internet connection.',
        status: 503,
      };
    }

    return {
      friendly: `AI processing error: ${errStr.substring(0, 180)}`,
      status: 500,
    };
  }

  /**
   * Primary method to generate content using Gemini
   */
  async generateContent({
    systemInstruction,
    contents,
    tools = null,
    responseSchema = null,
    temperature = 0.4,
  }) {
    if (!this.ai) {
      this.initClient();
      if (!this.ai) {
        throw new Error('Gemini API is not configured. Please supply a valid GEMINI_API_KEY in server .env.');
      }
    }

    const modelName = this.getModelName();

    try {
      const config = {
        temperature,
      };

      if (systemInstruction) {
        config.systemInstruction = systemInstruction;
      }

      if (responseSchema) {
        config.responseMimeType = 'application/json';
        config.responseSchema = responseSchema;
      }

      if (tools && tools.length > 0) {
        config.tools = tools;
      }

      // Call Google GenAI SDK
      const response = await this.ai.models.generateContent({
        model: modelName,
        contents,
        config,
      });

      return response;
    } catch (error) {
      console.error(`[Gemini API Error - ${modelName}]:`, error.message);
      const formatted = this.formatError(error);
      const customErr = new Error(formatted.friendly);
      customErr.status = formatted.status;
      customErr.originalError = error;
      throw customErr;
    }
  }
}

export const geminiService = new GeminiService();
