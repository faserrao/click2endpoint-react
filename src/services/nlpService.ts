// NLP Service for parsing natural language use cases into endpoint mappings
// Uses OpenAI GPT-4 to extract intent, endpoint, and parameters

import endpointMap from '../data/endpointMap';

export interface NLPParseResult {
  success: boolean;
  endpoint?: string;
  confidence: number;
  suggestedAnswers?: Record<string, string>;
  parameters?: Record<string, any>;
  error?: string;
}

export interface AuditLogEntry {
  timestamp: string;
  userInput: string;
  aiSuggestion: NLPParseResult;
  userSelection: {
    endpoint: string;
    answers: Record<string, string>;
  };
  accepted: boolean; // Did user follow AI suggestion?
}

/**
 * Parse natural language use case using OpenAI GPT-4
 */
export async function parseUseCase(
  userInput: string,
  openAIKey: string
): Promise<NLPParseResult> {
  if (!openAIKey) {
    return {
      success: false,
      confidence: 0,
      error: 'OpenAI API key not configured'
    };
  }

  if (!userInput.trim()) {
    return {
      success: false,
      confidence: 0,
      error: 'No input provided'
    };
  }

  try {
    // Build context about available endpoints
    const endpointContext = Object.entries(endpointMap)
      .map(([key, info]) => `${key}: ${info.description}`)
      .join('\n');

    const systemPrompt = `You are an AI assistant that maps natural language use cases to API endpoints.

Available endpoints:
${endpointContext}

Your task is to analyze the user's use case and determine:
1. Which endpoint best matches their needs
2. How confident you are (0-100%)
3. What parameter values can be extracted from their description

Respond with JSON only in this format:
{
  "endpoint": "/jobs/single-doc-job-template",
  "confidence": 85,
  "suggestedAnswers": {
    "questionId": "value"
  },
  "parameters": {
    "parameterName": "extractedValue"
  },
  "reasoning": "Brief explanation of why this endpoint was chosen"
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userInput }
        ],
        temperature: 0.3, // Lower temperature for more consistent results
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from OpenAI');
    }

    // Parse JSON response
    const parsed = JSON.parse(aiResponse);

    return {
      success: true,
      endpoint: parsed.endpoint,
      confidence: parsed.confidence || 0,
      suggestedAnswers: parsed.suggestedAnswers || {},
      parameters: parsed.parameters || {}
    };

  } catch (error) {
    console.error('NLP parsing error:', error);
    return {
      success: false,
      confidence: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Save audit log entry to localStorage
 */
export function logAuditEntry(entry: AuditLogEntry): void {
  try {
    const logs = getAuditLogs();
    logs.push(entry);

    // Keep only last 100 entries
    if (logs.length > 100) {
      logs.shift();
    }

    localStorage.setItem('click2endpoint_audit_log', JSON.stringify(logs));
  } catch (error) {
    console.error('Failed to save audit log:', error);
  }
}

/**
 * Get all audit logs from localStorage
 */
export function getAuditLogs(): AuditLogEntry[] {
  try {
    const stored = localStorage.getItem('click2endpoint_audit_log');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load audit logs:', error);
    return [];
  }
}

/**
 * Calculate AI accuracy based on audit logs
 */
export function calculateAccuracy(): {
  totalSuggestions: number;
  accepted: number;
  accuracy: number;
} {
  const logs = getAuditLogs();
  const totalSuggestions = logs.length;
  const accepted = logs.filter(log => log.accepted).length;

  return {
    totalSuggestions,
    accepted,
    accuracy: totalSuggestions > 0 ? (accepted / totalSuggestions) * 100 : 0
  };
}
