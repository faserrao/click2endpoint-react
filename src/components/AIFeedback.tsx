import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

interface AIFeedbackProps {
  onFeedback: (helpful: boolean, comment?: string) => void;
}

export function AIFeedback({ onFeedback }: AIFeedbackProps) {
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = (helpful: boolean) => {
    if (helpful) {
      onFeedback(true);
      setSubmitted(true);
    } else {
      setShowComment(true);
    }
  };

  const handleSubmitComment = () => {
    onFeedback(false, comment);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-[#1E1E1E] p-4 rounded-lg border border-[#00ADB5]/30">
        <p className="text-sm text-gray-400 text-center">
          ✓ Thanks for your feedback! This helps improve AI accuracy.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#1E1E1E] p-6 rounded-lg border border-[#3A3A3A]">
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-[#00ADB5]" />
        Was the AI suggestion helpful?
      </h3>

      {!showComment ? (
        <div className="flex gap-3">
          <button
            onClick={() => handleFeedback(true)}
            className="flex-1 px-4 py-3 bg-green-600/20 hover:bg-green-600/30 border border-green-600/50 rounded-lg transition-colors flex items-center justify-center gap-2 text-green-400"
          >
            <ThumbsUp className="w-5 h-5" />
            Yes, helpful
          </button>
          <button
            onClick={() => handleFeedback(false)}
            className="flex-1 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 rounded-lg transition-colors flex items-center justify-center gap-2 text-red-400"
          >
            <ThumbsDown className="w-5 h-5" />
            No, not helpful
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-400">
            What could be improved? (optional)
          </p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="E.g., Wrong endpoint suggested, confidence too high/low, etc."
            className="w-full bg-[#121212] border border-[#3A3A3A] rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:border-[#00ADB5] focus:outline-none min-h-[80px] resize-y"
          />
          <div className="flex gap-3">
            <button
              onClick={() => setShowComment(false)}
              className="px-4 py-2 bg-[#2A2A2A] hover:bg-[#3A3A3A] rounded-lg text-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitComment}
              className="flex-1 px-4 py-2 bg-[#00ADB5] hover:bg-[#00BFC9] rounded-lg text-white transition-colors"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
