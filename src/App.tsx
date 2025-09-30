import React, { useState } from 'react';
import { ProgressBar } from './components/ProgressBar';
import { QuestionCard } from './components/QuestionCard';
import { ResultCard } from './components/ResultCard';
import { MockServerSelector } from './components/MockServerSelector';
import { AuthCredentials } from './components/AuthCredentials';
import endpointMap from './data/endpointMap';
import { getNextQuestion } from './data/questions';

function App() {
  const [currentView, setCurrentView] = useState<'welcome' | 'questions' | 'result'>('welcome');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [mockServerUrl, setMockServerUrl] = useState<string>('');
  const [clientId, setClientId] = useState<string>('test-client-123');
  const [clientSecret, setClientSecret] = useState<string>('super-secret-password-123');

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
  };

  const handleRestart = () => {
    setCurrentView('welcome');
    setAnswers({});
  };

  const handleComplete = () => {
    setCurrentView('result');
  };

  const handleBack = () => {
    if (Object.keys(answers).length === 0) {
      setCurrentView('welcome');
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 flex items-center justify-center p-6">
      <div className={`w-full ${currentView === 'result' ? 'max-w-7xl' : 'max-w-4xl'}`}>
        {currentView === 'questions' && (
          <div className="mb-6">
            <ProgressBar step={getCurrentStep()} totalSteps={getTotalSteps()} />
          </div>
        )}
        
        {currentView === 'welcome' && (
          <div className="space-y-8">
            <div className="bg-[#1E1E1E] p-12 rounded-xl text-center">
              <h1 className="text-4xl font-bold text-[#00ADB5] mb-4">Click2Endpoint</h1>
              <p className="text-gray-400 mb-8 text-lg">
                Find the perfect C2M API endpoint for your document submission needs
              </p>
              <button 
                className="px-8 py-4 bg-[#00ADB5] hover:bg-[#00BFC9] rounded-lg text-lg font-semibold transition-colors" 
                onClick={handleStartWizard}
              >
                🚀 Start Wizard
              </button>
            </div>
            
            {/* Mock Server Configuration */}
            <MockServerSelector 
              onServerSelect={setMockServerUrl}
              initialWorkspace="personal"
            />
            
            {/* Authentication Credentials */}
            <AuthCredentials
              onCredentialsChange={(id, secret) => {
                setClientId(id);
                setClientSecret(secret);
              }}
              defaultClientId={clientId}
              defaultClientSecret={clientSecret}
            />
          </div>
        )}
        
        {currentView === 'questions' && (
          <QuestionCard 
            answers={answers} 
            setAnswers={setAnswers} 
            onComplete={handleComplete}
            onBack={handleBack}
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
          />
        )}
      </div>
    </div>
  );
}

export default App;