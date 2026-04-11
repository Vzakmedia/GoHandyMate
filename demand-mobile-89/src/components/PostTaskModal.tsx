
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePostTaskForm } from '@/hooks/usePostTaskForm';
import { TaskFormFields } from '@/components/TaskFormFields';
import { SafetyTips } from '@/components/SafetyTips';

interface PostTaskModalProps {
  onClose: () => void;
  onSubmit: (taskData: any) => void;
}

export const PostTaskModal = ({ onClose, onSubmit }: PostTaskModalProps) => {
  const {
    formData,
    validationErrors,
    isSubmitting,
    handleInputChange,
    handleSubmit
  } = usePostTaskForm(onSubmit, onClose);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Post a New Task</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <TaskFormFields
            formData={formData}
            validationErrors={validationErrors}
            onInputChange={handleInputChange}
          />

          <SafetyTips />

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
