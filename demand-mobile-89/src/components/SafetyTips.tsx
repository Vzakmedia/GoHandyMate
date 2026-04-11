
import { AlertTriangle } from 'lucide-react';

export const SafetyTips = () => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-start space-x-2">
        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
        <div>
          <h4 className="font-medium text-yellow-800">Safety Tips</h4>
          <ul className="text-sm text-yellow-700 mt-2 space-y-1">
            <li>• Always verify the identity of service providers</li>
            <li>• Get quotes from multiple providers before deciding</li>
            <li>• Keep communication within the platform when possible</li>
            <li>• Report any suspicious behavior to our support team</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
