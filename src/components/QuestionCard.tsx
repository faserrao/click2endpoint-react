import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { questions, getNextQuestion, QuestionOption } from '../data/questions';
import { NLPParseResult } from '../services/nlpService';

interface QuestionCardProps {
  answers: Record<string, string>;
  setAnswers: (answers: Record<string, string>) => void;
  onComplete: () => void;
  onBack: () => void;
  aiSuggestion?: NLPParseResult | null;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  answers,
  setAnswers,
  onComplete,
  onBack,
  aiSuggestion
}) => {
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  useEffect(() => {
    const nextQuestion = getNextQuestion(answers);
    setCurrentQuestionId(nextQuestion);
    
    if (nextQuestion && answers[nextQuestion]) {
      setSelectedValue(answers[nextQuestion]);
    } else {
      setSelectedValue(null);
    }
    
    if (!nextQuestion) {
      onComplete();
    }
  }, [answers, onComplete]);

  // Selecting an option no longer auto-advances - just updates local selection
  const handleSelect = (value: string) => {
    setSelectedValue(value);
  };

  // Next button handler: commits the selection and moves forward
  const handleNext = () => {
    if (selectedValue && currentQuestionId) {
      setAnswers({
        ...answers,
        [currentQuestionId]: selectedValue
      });
    }
  };

  const handleBack = () => {
    // Remove the last answer and go back
    const answerKeys = Object.keys(answers);
    if (answerKeys.length > 0) {
      const lastKey = answerKeys[answerKeys.length - 1];
      const newAnswers = { ...answers };
      delete newAnswers[lastKey];
      setAnswers(newAnswers);
    } else {
      onBack();
    }
  };

  if (!currentQuestionId) {
    return null;
  }

  const question = questions[currentQuestionId];
  if (!question) {
    return null;
  }

  // Check if AI suggested this answer
  const isAISuggested = (value: string): boolean => {
    if (!aiSuggestion || !currentQuestionId) return false;
    return aiSuggestion.suggestedAnswers?.[currentQuestionId] === value;
  };

  return (
    <div className="bg-[#1E1E1E] p-8 rounded-xl">
      {/* AI Confidence Banner */}
      {aiSuggestion && aiSuggestion.confidence > 0 && (
        <div className="mb-6 p-4 bg-[#00ADB5]/10 border border-[#00ADB5]/30 rounded-lg flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#00ADB5] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-[#00ADB5]">AI Suggestion</span>
              {' '}({aiSuggestion.confidence}% confident)
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Options with ✨ are recommended based on your use case description
            </p>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-2 text-white">{question.title}</h2>
      {question.subtitle && (
        <p className="text-gray-400 mb-6">{question.subtitle}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {question.options.map((option: QuestionOption) => (
          <OptionCard
            key={option.value}
            option={option}
            isSelected={selectedValue === option.value}
            isAISuggested={isAISuggested(option.value)}
            onSelect={() => handleSelect(option.value)}
          />
        ))}
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-semibold"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          disabled={!selectedValue}
          className={`px-6 py-3 rounded-lg transition-colors font-semibold ${
            selectedValue
              ? 'bg-[#00ADB5] hover:bg-[#00BFC9]'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

interface OptionCardProps {
  option: QuestionOption;
  isSelected: boolean;
  isAISuggested: boolean;
  onSelect: () => void;
}

const OptionCard: React.FC<OptionCardProps> = ({ option, isSelected, isAISuggested, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className={`
        relative p-6 rounded-xl border-2 transition-all duration-300 text-left
        ${isSelected
          ? 'bg-[#00ADB5] border-[#00ADB5] transform -translate-y-1 shadow-lg'
          : isAISuggested
            ? 'bg-[#2A2A2A] border-[#00ADB5]/50 hover:border-[#00ADB5] hover:transform hover:-translate-y-1 hover:shadow-md'
            : 'bg-[#2A2A2A] border-[#3A3A3A] hover:border-[#4A4A4A] hover:transform hover:-translate-y-1 hover:shadow-md'
        }
      `}
    >
      <div className="flex flex-col h-full">
        <div className={`text-4xl mb-3 ${isSelected ? 'text-white' : 'text-gray-400'}`}>
          {option.icon || '•'}
        </div>
        <h3 className={`text-lg font-semibold mb-2 flex items-center gap-2 ${isSelected ? 'text-white' : 'text-gray-200'}`}>
          {option.label}
          {isAISuggested && !isSelected && (
            <Sparkles className="w-4 h-4 text-[#00ADB5]" />
          )}
        </h3>
        <p className={`text-sm ${isSelected ? 'text-gray-200' : 'text-gray-500'}`}>
          {option.description}
        </p>
        {isSelected && (
          <div className="absolute top-2 right-2 bg-white text-[#00ADB5] rounded-full w-6 h-6 flex items-center justify-center">
            ✓
          </div>
        )}
      </div>
    </button>
  );
};