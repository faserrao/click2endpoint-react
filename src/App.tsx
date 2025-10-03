import React, { useState, useEffect } from 'react';
import { ProgressBar } from './components/ProgressBar';
import { QuestionCard } from './components/QuestionCard';
import { ResultCard } from './components/ResultCard';
import { SettingsModal } from './components/SettingsModal';
import { AIInput } from './components/AIInput';
import { loadSettings } from './utils/settings';
import { getDefaultMockServerUrl } from './services/postmanApi';
import { NLPParseResult, logAuditEntry } from './services/nlpService';
import endpointMap from './data/endpointMap';
import { Settings } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<'welcome' | 'questions' | 'result'>('welcome');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [mockServerUrl, setMockServerUrl] = useState<string>(getDefaultMockServerUrl());
  const [clientId, setClientId] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [openAIKey, setOpenAIKey] = useState<string>('');
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [aiSuggestion, setAiSuggestion] = useState<NLPParseResult | null>(null);
  const [userInput, setUserInput] = useState<string>('');

  // Load settings from localStorage on mount
  useEffect(() => {
    const settings = loadSettings();
    if (settings.clientId) setClientId(settings.clientId);
    if (settings.clientSecret) setClientSecret(settings.clientSecret);
    if (settings.mockServerUrl) setMockServerUrl(settings.mockServerUrl);
    if (settings.openAIKey) setOpenAIKey(settings.openAIKey);

    // Also check environment variable for OpenAI key
    const envOpenAIKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (envOpenAIKey && !settings.openAIKey) {
      setOpenAIKey(envOpenAIKey);
    }
  }, []);

  const getTotalSteps = () => {
    // Determine total steps based on document type
    const docType = answers.docType;
    if (docType === 'pdfSplit') {
      return 2; // docType + recipientStyle
    } else if (docType === 'single') {
      return 3; // docType + templateUsage + recipientStyle
    } else if (docType === 'multi' || docType === 'merge') {
      return 4; // docType + templateUsage + recipientStyle + personalized
    }
    return 3; // default
  };

  const getCurrentStep = () => {
    return Object.keys(answers).length;
  };

  const handleStartWizard = () => {
    setCurrentView('questions');
    setAnswers({});
    setAiSuggestion(null);
  };

  const handleAIParsed = (result: NLPParseResult, input: string) => {
    console.log('handleAIParsed called with:', result);
    setAiSuggestion(result);
    setUserInput(input);
    // If AI has high confidence and suggested answers, pre-populate them
    if (result.confidence >= 70 && result.suggestedAnswers) {
      console.log('Pre-populating answers:', result.suggestedAnswers);
      setAnswers(result.suggestedAnswers);
    } else {
      console.log('Not pre-populating - confidence too low or no answers');
      setAnswers({});
    }
    setCurrentView('questions');
  };

  const handleRestart = () => {
    setCurrentView('welcome');
    setAnswers({});
    setAiSuggestion(null);
    setUserInput('');
  };

  const handleComplete = () => {
    // Log audit entry if AI suggestion was made
    if (aiSuggestion && userInput && aiSuggestion.endpoint) {
      // For audit logging, we'll use the AI's suggested endpoint
      // In a real implementation, you'd determine the actual endpoint from the wizard answers
      logAuditEntry({
        timestamp: new Date().toISOString(),
        userInput,
        aiSuggestion,
        userSelection: {
          endpoint: aiSuggestion.endpoint, // Using AI suggestion for now
          answers
        },
        accepted: true // Mark as accepted if user completed the wizard
      });
    }
    setCurrentView('result');
  };

  const handleBack = () => {
    if (Object.keys(answers).length === 0) {
      setCurrentView('welcome');
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 flex items-center justify-center p-6">
      {/* Settings gear icon - top right corner */}
      <button
        onClick={() => setSettingsOpen(true)}
        className="fixed top-6 right-6 p-3 bg-[#1E1E1E] hover:bg-[#2A2A2A] rounded-lg border border-[#3A3A3A] hover:border-[#00ADB5] transition-all z-40"
        title="Settings"
      >
        <Settings className="w-6 h-6 text-gray-400 hover:text-[#00ADB5] transition-colors" />
      </button>

      {/* Settings Modal */}
      <SettingsModal
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
          // Reload settings after closing modal
          const settings = loadSettings();
          if (settings.clientId) setClientId(settings.clientId);
          if (settings.clientSecret) setClientSecret(settings.clientSecret);
          if (settings.mockServerUrl) setMockServerUrl(settings.mockServerUrl);
          if (settings.openAIKey) setOpenAIKey(settings.openAIKey);
        }}
      />

      <div className={`w-full ${currentView === 'result' ? 'max-w-7xl' : 'max-w-4xl'}`}>
        {currentView === 'questions' && (
          <div className="mb-6">
            <ProgressBar step={getCurrentStep()} totalSteps={getTotalSteps()} />
          </div>
        )}

        {currentView === 'welcome' && (
          <div className="space-y-8">
            {/* AI Input Component */}
            {openAIKey && (
              <AIInput
                onParsed={handleAIParsed}
                openAIKey={openAIKey}
              />
            )}

            <div className="bg-[#1E1E1E] p-12 rounded-xl text-center">
              <h1 className="text-4xl font-bold text-[#00ADB5] mb-4">Click2Endpoint</h1>
              <p className="text-gray-400 mb-8 text-lg">
                {openAIKey
                  ? 'Or use the traditional step-by-step wizard'
                  : 'Find the perfect C2M API endpoint for your document submission needs'}
              </p>
              <button
                className="px-8 py-4 bg-[#00ADB5] hover:bg-[#00BFC9] rounded-lg text-lg font-semibold transition-colors"
                onClick={handleStartWizard}
              >
                🚀 Start Wizard
              </button>
            </div>

            {/* Settings Reminder Card */}
            {(!clientId || !clientSecret || !openAIKey) && (
              <div className="bg-[#1E1E1E] p-6 rounded-xl border-2 border-[#00ADB5] border-opacity-30">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">⚙️</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#00ADB5] mb-2">
                      {!openAIKey ? 'Enable AI-Assisted Mode' : 'Configure API Credentials'}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">
                      {!openAIKey
                        ? 'Add your OpenAI API key to unlock AI-assisted endpoint selection with natural language.'
                        : 'Click the gear icon (⚙️) in the top-right corner to set your Client ID and Client Secret.'}
                    </p>
                    <button
                      onClick={() => setSettingsOpen(true)}
                      className="px-4 py-2 bg-[#00ADB5] hover:bg-[#00BFC9] rounded-lg text-sm font-semibold transition-colors inline-flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Open Settings
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {currentView === 'questions' && (
          <QuestionCard
            answers={answers}
            setAnswers={setAnswers}
            onComplete={handleComplete}
            onBack={handleBack}
            aiSuggestion={aiSuggestion}
          />
        )}
        
        {currentView === 'result' && (
          <ResultCard
            answers={answers}
            endpointMap={endpointMap}
            onRestart={handleRestart}
            mockServerUrl={mockServerUrl}
            clientId={clientId}
            clientSecret={clientSecret}
            showAIFeedback={!!aiSuggestion}
          />
        )}
      </div>
    </div>
  );
}

export default App;