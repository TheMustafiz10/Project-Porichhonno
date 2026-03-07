import { GoogleGenerativeAI } from '@google/generative-ai';
import SuraiyaAiAssistant from './suraiya_ai.model.js';

const getAIProvider = () => (process.env.AI_PROVIDER || 'gemini').toLowerCase();

// Lazily create the Gemini client after dotenv has been loaded by server startup.
const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing in environment variables');
  }

  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

const getGrokApiKey = () => {
  // Allow fallback to GEMINI_API_KEY for existing local setups where users pasted xAI keys there.
  const key = process.env.GROK_API_KEY || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('GROK_API_KEY is missing in environment variables');
  }

  return key;
};

// System prompt for waste sorting context
const SYSTEM_PROMPT = `You are EcoCycle Green's helpful waste sorting assistant for পরিচ্ছন্ন (Porichonno), a waste management education platform in Bangladesh. 

Your role is to help users understand how to properly sort and dispose of waste items in an eco-friendly manner. When answering questions:

1. Categorize waste into: Organic (compost), Recyclable (paper, plastic, metal, glass), Hazardous (batteries, chemicals), or Non-recyclable
2. Provide clear, concise instructions in simple, friendly language
3. Include environmental benefits and eco-friendly tips when relevant
4. Be culturally sensitive to Bangladesh context and local practices
5. Encourage sustainable waste management and recycling
6. If unsure, encourage proper disposal through local waste management systems

Keep responses brief (2-4 sentences), actionable, and environmentally conscious. Use a warm, encouraging tone to promote eco-awareness. 🌱♻️`;

// Try newer model IDs first, then fall back for older project keys.
const GEMINI_MODEL_CANDIDATES = [
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
];

const GROK_DEFAULT_MODELS = ['grok-2-latest', 'grok-2', 'grok-beta'];
const GROK_MODEL_CANDIDATES = [
  process.env.GROK_MODEL,
  ...GROK_DEFAULT_MODELS,
].filter((v, i, arr) => v && arr.indexOf(v) === i);

// Mock responses for when quota is exceeded (for university testing)
const MOCK_RESPONSES = {
  plastic: '♻️ Great question! Clean your plastic bottles thoroughly, remove caps and labels, and place them in the recyclable bin. Dry bottles recycle better and prevent contamination.',
  recycle: '🌍 To recycle properly: separate materials by type (plastic, paper, metal, glass), rinse containers, and check local guidelines. Never mix recyclables with food waste!',
  compost: '🌱 Composting is easy! Start with a bin or pile. Add fruit/vegetable scraps, coffee grounds, eggshells, and yard waste. Avoid meat, dairy, and oils. Mix regularly and keep moist.',
  electronics: '🔋 E-waste contains hazardous materials. Never throw electronics in regular trash! Find local e-waste collection centers or manufacturer take-back programs.',
  default: '♻️ For proper waste sorting: Recyclables (plastic, paper, metal, glass) go in blue bins. Organic waste (food scraps) in compost. Hazardous items (batteries, chemicals) need special disposal. When in doubt, check with local waste management!',
};

function getMockResponse(question) {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('plastic') || lowerQuestion.includes('bottle')) {
    return MOCK_RESPONSES.plastic;
  }
  if (lowerQuestion.includes('recycle') || lowerQuestion.includes('recycling')) {
    return MOCK_RESPONSES.recycle;
  }
  if (lowerQuestion.includes('compost')) {
    return MOCK_RESPONSES.compost;
  }
  if (lowerQuestion.includes('electronic') || lowerQuestion.includes('e-waste')) {
    return MOCK_RESPONSES.electronics;
  }
  
  return MOCK_RESPONSES.default;
}

function isQuotaErrorMessage(message) {
  return (
    message.includes('429') ||
    message.includes('Too Many Requests') ||
    message.includes('quota') ||
    message.includes('rate limit') ||
    message.includes('Resource has been exhausted')
  );
}

function isModelNotFoundMessage(message) {
  return (
    message.includes('404 Not Found') ||
    message.includes('is not found for API version') ||
    message.includes('not supported for generateContent') ||
    message.includes('model_not_found') ||
    message.includes('model not found')
  );
}

async function generateWithGeminiFallback(genAI, prompt, question) {
  let lastError = null;

  for (const modelName of GEMINI_MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return { text: response.text(), isMock: false };
    } catch (error) {
      lastError = error;

      const message = String(error?.message || '');
      
      // Check if it's a quota/rate limit error
      const isQuotaError = isQuotaErrorMessage(message);

      // If quota exceeded, return mock response immediately
      if (isQuotaError) {
        console.warn('⚠️ Gemini quota exceeded. Returning mock response for testing.');
        return { text: getMockResponse(question), isMock: true };
      }

      // Check if it's a model not found error (try next model)
      const isModelNotFound = isModelNotFoundMessage(message);

      if (!isModelNotFound) {
        // Some other error - throw it
        throw error;
      }
      // If model not found, continue to next model candidate
    }
  }

  // All models failed - check if last error was quota related
  const lastMessage = String(lastError?.message || '');
  if (isQuotaErrorMessage(lastMessage)) {
    console.warn('⚠️ All models quota exceeded. Returning mock response.');
    return { text: getMockResponse(question), isMock: true };
  }

  throw lastError || new Error('No compatible Gemini model is available');
}

async function generateWithGrokFallback(question) {
  const apiKey = getGrokApiKey();
  let lastError = null;

  for (const modelName of GROK_MODEL_CANDIDATES) {
    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: question },
          ],
          temperature: 0.3,
          max_tokens: 220,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMessage = String(
          payload?.error?.message ||
            payload?.message ||
            payload?.error ||
            payload?.code ||
            `${response.status}`
        );

        // Quota should immediately fall back to mock for smooth demos.
        if (response.status === 429 || isQuotaErrorMessage(errorMessage.toLowerCase())) {
          console.warn('⚠️ Grok quota exceeded. Returning mock response for testing.');
          return { text: getMockResponse(question), isMock: true };
        }

        // Some xAI accounts may not have access to a specific Grok model.
        // Try next model candidate for 403/404 before failing.
        if (response.status === 403 || response.status === 404) {
          lastError = new Error(`Grok API error (${response.status}) on model ${modelName}: ${errorMessage}`);
          continue;
        }

        throw new Error(`Grok API error (${response.status}): ${errorMessage}`);
      }

      const content = payload?.choices?.[0]?.message?.content;
      if (!content || !String(content).trim()) {
        throw new Error('Grok API returned an empty response');
      }

      return { text: String(content).trim(), isMock: false };
    } catch (error) {
      lastError = error;
      const message = String(error?.message || '').toLowerCase();

      if (isQuotaErrorMessage(message)) {
        console.warn('⚠️ Grok quota exceeded. Returning mock response for testing.');
        return { text: getMockResponse(question), isMock: true };
      }

      if (!isModelNotFoundMessage(message)) {
        throw error;
      }
    }
  }

  const lastMessage = String(lastError?.message || '');
  if (isQuotaErrorMessage(lastMessage)) {
    console.warn('⚠️ Grok model quota exceeded. Returning mock response.');
    return { text: getMockResponse(question), isMock: true };
  }

  if (isModelNotFoundMessage(lastMessage.toLowerCase())) {
    throw new Error(
      `No compatible Grok model is available for this key. Tried: ${GROK_MODEL_CANDIDATES.join(', ')}`
    );
  }

  throw lastError || new Error('No compatible Grok model is available');
}

async function generateWithProviderFallback(provider, prompt, question) {
  if (provider === 'grok') {
    return generateWithGrokFallback(question);
  }

  const geminiClient = getGeminiClient();
  return generateWithGeminiFallback(geminiClient, prompt, question);
}

/**
 * Ask AI Assistant about waste sorting
 * POST /api/suraiya/ai-assistant/ask
 */
export const askAiAssistant = async (req, res) => {
  const startTime = Date.now();
  const { question, userId, sessionId } = req.body || {};
  
  try {
    // Validation
    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Question is required',
      });
    }

    if (question.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Question is too long (max 500 characters)',
      });
    }

    // Generate AI response with provider-aware fallback for compatibility.
    // If quota exceeded, returns mock response automatically.
    const provider = getAIProvider();
    const prompt = `${SYSTEM_PROMPT}\n\nUser Question: ${question}`;
    const result = await generateWithProviderFallback(provider, prompt, question);
    const aiResponse = result.text;
    const isMockResponse = result.isMock;

    // Detect waste category from the question
    const wasteCategory = detectWasteCategory(question);

    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Get IP address
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Save to database (using hardcoded test user ID if none provided)
    const assistantLog = await SuraiyaAiAssistant.create({
      userId: userId || 'suraiya_test_user_1',
      userQuestion: question.trim(),
      aiResponse,
      wasteCategory,
      sessionId: sessionId || null,
      ipAddress,
      responseTime,
    });

    return res.status(200).json({
      success: true,
      data: {
        id: assistantLog._id,
        question: assistantLog.userQuestion,
        answer: assistantLog.aiResponse,
        category: assistantLog.wasteCategory,
        timestamp: assistantLog.createdAt,
        isMock: isMockResponse, // Flag for testing/debugging
        provider,
      },
    });
  } catch (error) {
    console.error('AI Assistant Error:', error);

    const errorMessage = String(error?.message || '');

    // Handle specific Google AI errors
    if (
      error.message &&
      (error.message.includes('API key') ||
        error.message.includes('missing in environment variables'))
    ) {
      return res.status(500).json({
        success: false,
        message: 'AI service configuration error. Please contact support.',
      });
    }

    // Handle Grok auth/permission issues explicitly for easier setup debugging.
    if (errorMessage.includes('Grok API error (401)') || errorMessage.includes('Grok API error (403)')) {
      return res.status(500).json({
        success: false,
        message: 'Grok key is invalid or does not have required access. Check GROK_API_KEY and xAI account permissions.',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      });
    }

    // Handle xAI team billing/license setup issues explicitly.
    const lowerError = errorMessage.toLowerCase();
    if (lowerError.includes('credits') || lowerError.includes('licenses')) {
      return res.status(500).json({
        success: false,
        message: 'Your xAI team has no active credits/licenses. Add billing or licenses in xAI Console, then retry.',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      });
    }

    // Catch any quota errors that slip through and return mock
    if (
      errorMessage.includes('429') ||
      errorMessage.includes('quota') ||
      errorMessage.includes('rate limit') ||
      errorMessage.includes('Too Many Requests')
    ) {
      console.warn('⚠️ Quota error caught in catch block. Returning mock response.');
      
      const safeQuestion = String(question || '').trim();
      const mockResponse = getMockResponse(safeQuestion || 'waste sorting help');
      const wasteCategory = detectWasteCategory(safeQuestion);
      const responseTime = Date.now() - startTime;
      const ipAddress = req.ip || req.connection.remoteAddress;

      // Save mock response to database for testing
      const assistantLog = await SuraiyaAiAssistant.create({
        userId: userId || 'suraiya_test_user_1',
        userQuestion: safeQuestion,
        aiResponse: mockResponse,
        wasteCategory,
        sessionId: sessionId || null,
        ipAddress,
        responseTime,
      });

      return res.status(200).json({
        success: true,
        data: {
          id: assistantLog._id,
          question: assistantLog.userQuestion,
          answer: assistantLog.aiResponse,
          category: assistantLog.wasteCategory,
          timestamp: assistantLog.createdAt,
          isMock: true,
        },
        warning: 'Quota exceeded - mock response returned for testing',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to get AI response. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Get user's conversation history
 * GET /api/suraiya/ai-assistant/history/:userId
 */
export const getUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, page = 1 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const history = await SuraiyaAiAssistant.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('userQuestion aiResponse wasteCategory createdAt isHelpful');

    const total = await SuraiyaAiAssistant.countDocuments({ userId });

    return res.status(200).json({
      success: true,
      data: {
        history,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get History Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve history',
    });
  }
};

/**
 * Submit feedback on AI response
 * PATCH /api/suraiya/ai-assistant/feedback/:id
 */
export const submitFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { isHelpful } = req.body;

    if (typeof isHelpful !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isHelpful must be a boolean value',
      });
    }

    const updated = await SuraiyaAiAssistant.findByIdAndUpdate(
      id,
      { isHelpful },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        id: updated._id,
        isHelpful: updated.isHelpful,
      },
    });
  } catch (error) {
    console.error('Submit Feedback Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
    });
  }
};

/**
 * Helper function to detect waste category from question
 */
function detectWasteCategory(question) {
  const lowerQuestion = question.toLowerCase();

  // Organic waste keywords
  if (
    lowerQuestion.match(
      /food|vegetable|fruit|peel|organic|compost|kitchen|egg|bones|fish/i
    )
  ) {
    return 'organic';
  }

  // Recyclable waste keywords
  if (
    lowerQuestion.match(
      /paper|cardboard|plastic|bottle|can|metal|aluminum|glass|newspaper|magazine/i
    )
  ) {
    return 'recyclable';
  }

  // Hazardous waste keywords
  if (
    lowerQuestion.match(
      /battery|chemical|paint|oil|medicine|drug|toxic|hazardous|pesticide|electronic/i
    )
  ) {
    return 'hazardous';
  }

  // Non-recyclable waste keywords
  if (
    lowerQuestion.match(
      /diaper|tissue|napkin|styrofoam|ceramic|broken glass|mirror/i
    )
  ) {
    return 'non-recyclable';
  }

  // General waste
  if (lowerQuestion.match(/trash|garbage|waste|throw|dispose/i)) {
    return 'general';
  }

  return 'unknown';
}
