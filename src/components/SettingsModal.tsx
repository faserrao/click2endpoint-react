import React, { useState, useEffect } from 'react';
import { Settings, X } from 'lucide-react';
import { saveSettings, loadSettings } from '../utils/settings';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [mockServerUrl, setMockServerUrl] = useState('');

  useEffect(() => {
    if (open) {
      const settings = loadSettings();
      setClientId(settings.clientId || '');
      setMockServerUrl(settings.mockServerUrl || '');
      // Never pre-fill secret (security best practice)
      setClientSecret('');
    }
  }, [open]);

  const handleSave = () => {
    saveSettings({
      clientId,
      clientSecret,
      mockServerUrl
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className="bg-[#1E1E1E] rounded-xl max-w-2xl w-full border border-[#3A3A3A]">
        {/* Header */}
        <div className="border-b border-[#3A3A3A] p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-[#00ADB5]" />
            <h2 className="text-2xl font-bold text-white">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Mock Server URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Mock Server URL
            </label>
            <input
              type="text"
              value={mockServerUrl}
              onChange={(e) => setMockServerUrl(e.target.value)}
              placeholder="https://xxxxx.mock.pstmn.io"
              className="w-full bg-[#121212] border border-[#3A3A3A] rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:border-[#00ADB5] focus:outline-none"
            />
          </div>

          {/* Client ID */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Client ID
            </label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="your-client-id"
              className="w-full bg-[#121212] border border-[#3A3A3A] rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:border-[#00ADB5] focus:outline-none"
            />
          </div>

          {/* Client Secret */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Client Secret
            </label>
            <input
              type="password"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              placeholder="Enter client secret"
              className="w-full bg-[#121212] border border-[#3A3A3A] rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:border-[#00ADB5] focus:outline-none"
              data-1p-ignore
              data-lpignore="true"
            />
            <p className="text-xs text-gray-500 mt-1">Secret is never stored for security</p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#3A3A3A] p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#2A2A2A] hover:bg-[#3A3A3A] rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-[#00ADB5] hover:bg-[#00BFC9] rounded-lg font-semibold transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
