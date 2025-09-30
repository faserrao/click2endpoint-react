import React, { useState } from 'react';
import { getEndpoint } from '../data/questions';
import { CodeGenerator } from './CodeGenerator';

interface ResultCardProps {
  answers: Record<string, string>;
  endpointMap: any;
  onRestart: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ answers, endpointMap, onRestart }) => {
  const [showCodeGenerator, setShowCodeGenerator] = useState(false);
  const endpointPath = getEndpoint(answers);
  const endpoint = endpointPath ? endpointMap[endpointPath] : null;

  if (!endpoint) {
    return (
      <div className="bg-[#1E1E1E] p-8 rounded-xl">
        <h2 className="text-2xl font-bold mb-4 text-red-500">Error</h2>
        <p className="text-gray-300 mb-6">Could not determine the appropriate endpoint based on your answers.</p>
        <button 
          onClick={onRestart} 
          className="px-6 py-3 bg-[#00ADB5] hover:bg-[#00BFC9] rounded-lg transition-colors"
        >
          🔄 Restart Wizard
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#1E1E1E] p-8 rounded-xl">
      <h2 className="text-3xl font-bold mb-2 text-[#00ADB5]">Perfect Match Found!</h2>
      <p className="text-gray-400 mb-6">Based on your requirements, here's your recommended endpoint:</p>
      
      <div className="bg-[#2A2A2A] p-6 rounded-lg mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">{endpoint.path}</h3>
        <p className="text-gray-300">{endpoint.description}</p>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-200 mb-3">Your Selections:</h4>
        <div className="space-y-2">
          {Object.entries(answers).map(([key, value]) => (
            <div key={key} className="flex justify-between bg-[#2A2A2A] p-3 rounded">
              <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
              <span className="text-white font-medium">{value === 'true' ? 'Yes' : value === 'false' ? 'No' : value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-200 mb-3">Example cURL Request:</h4>
        <pre className="bg-black p-4 rounded text-sm overflow-x-auto">
          <code className="text-green-400">{endpoint.jwtExample}</code>
        </pre>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-200 mb-3">Example Payload:</h4>
        <pre className="bg-black p-4 rounded text-sm overflow-x-auto">
          <code className="text-blue-400">{JSON.stringify(endpoint.payloadExample, null, 2)}</code>
        </pre>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={onRestart} 
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          🔄 Start Over
        </button>
        <button 
          className="px-6 py-3 bg-[#00ADB5] hover:bg-[#00BFC9] rounded-lg transition-colors flex-1"
          onClick={() => setShowCodeGenerator(true)}
        >
          Generate SDK Code →
        </button>
      </div>
    </div>
    
    {showCodeGenerator && (
      <CodeGenerator
        endpoint={endpoint}
        onClose={() => setShowCodeGenerator(false)}
      />
    )}
    </>
  );
};