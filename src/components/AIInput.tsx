import React, { useState } from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { parseUseCase, NLPParseResult } from '../services/nlpService';

interface AIInputProps {
  onParsed: (result: NLPParseResult, userInput: string) => void;
  openAIKey: string;
}

export function AIInput({ onParsed, openAIKey }: AIInputProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!input.trim()) {
      setError('Please describe your use case');
      return;
    }

    if (!openAIKey) {
      setError('OpenAI API key not configured. Please add it in Settings.');
      return;
    }

    setLoading(true);

    try {
      const result = await parseUseCase(input, openAIKey);

      if (result.success) {
        onParsed(result, input);
      } else {
        setError(result.error || 'Failed to parse use case');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1E1E1E] p-8 rounded-xl border-2 border-[#00ADB5]">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-6 h-6 text-[#00ADB5]" />
        <h2 className="text-2xl font-bold text-white">AI-Assisted Mode</h2>
      </div>

      <p className="text-gray-400 mb-6">
        Describe what you want to do in plain English, and AI will suggest the best endpoint and configuration.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            What would you like to do?
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Example: I need to send legal contracts to 100 clients using a template..."
            className="w-full bg-[#121212] border border-[#3A3A3A] rounded-lg p-4 text-gray-200 placeholder-gray-500 focus:border-[#00ADB5] focus:outline-none min-h-[120px] resize-y"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className={`w-full px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            loading || !input.trim()
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-[#00ADB5] hover:bg-[#00BFC9] text-white'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Analyze Use Case
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-[#3A3A3A]">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">Example use cases:</h3>
        <div className="space-y-2">
          {[
            'Send monthly newsletters to my customer list',
            'Mail legal contracts to 50 clients using a saved template',
            'Send a single personalized letter to one recipient',
            'Merge multiple documents and mail them to an address list'
          ].map((example, idx) => (
            <button
              key={idx}
              onClick={() => setInput(example)}
              className="w-full text-left px-4 py-2 bg-[#2A2A2A] hover:bg-[#3A3A3A] rounded-lg text-sm text-gray-300 transition-colors"
              disabled={loading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
