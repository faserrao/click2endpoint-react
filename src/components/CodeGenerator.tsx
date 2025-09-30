import React, { useState } from 'react';
import { generatePythonCode, generateJavaScriptCode, generateCurlCode } from '../utils/codeGenerators';
import { Copy, Download, Check } from 'lucide-react';

interface CodeGeneratorProps {
  endpoint: any;
  onClose: () => void;
}

type Language = 'python' | 'javascript' | 'curl';

export const CodeGenerator: React.FC<CodeGeneratorProps> = ({ endpoint, onClose }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('python');
  const [includeAuth, setIncludeAuth] = useState(true);
  const [copied, setCopied] = useState(false);

  const getCode = () => {
    const options = { endpoint, includeAuth };
    switch (selectedLanguage) {
      case 'python':
        return generatePythonCode(options);
      case 'javascript':
        return generateJavaScriptCode(options);
      case 'curl':
        return generateCurlCode(options);
      default:
        return '';
    }
  };

  const code = getCode();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extension = selectedLanguage === 'javascript' ? 'js' : selectedLanguage === 'curl' ? 'sh' : 'py';
    const filename = `c2m-api-${endpoint.path.replace(/\//g, '-')}.${extension}`;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
      <div className="bg-[#1E1E1E] rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">Generate SDK Code</h2>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex gap-2">
              {(['python', 'javascript', 'curl'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedLanguage === lang
                      ? 'bg-[#00ADB5] text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </button>
              ))}
            </div>
            
            <label className="flex items-center gap-2 text-gray-300 ml-auto">
              <input
                type="checkbox"
                checked={includeAuth}
                onChange={(e) => setIncludeAuth(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-[#00ADB5] focus:ring-[#00ADB5] focus:ring-offset-0"
              />
              Include authentication flow
            </label>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="relative">
            <pre className="bg-black rounded-lg p-6 overflow-x-auto">
              <code className={`text-sm ${
                selectedLanguage === 'python' ? 'text-green-400' :
                selectedLanguage === 'javascript' ? 'text-yellow-400' :
                'text-blue-400'
              }`}>
                {code}
              </code>
            </pre>
            
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={handleCopy}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-400" />
                )}
              </button>
              <button
                onClick={handleDownload}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                title="Download file"
              >
                <Download className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-700 flex justify-between">
          <div className="text-sm text-gray-400">
            <p>Endpoint: <span className="text-white font-medium">{endpoint.path}</span></p>
            <p>Method: <span className="text-white font-medium">{endpoint.method}</span></p>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};