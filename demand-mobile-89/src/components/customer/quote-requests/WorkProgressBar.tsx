
import { WorkProgress } from './types';

interface WorkProgressBarProps {
  progress: WorkProgress;
}

export const WorkProgressBar = ({ progress }: WorkProgressBarProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Work Progress</span>
        <span className="text-sm text-gray-600">{progress.progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
          style={{ width: `${progress.progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600">{progress.text}</p>
    </div>
  );
};
