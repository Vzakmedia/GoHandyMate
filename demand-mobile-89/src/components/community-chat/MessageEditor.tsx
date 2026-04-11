
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MessageEditorProps {
  editedMessage: string;
  setEditedMessage: (message: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const MessageEditor = ({ editedMessage, setEditedMessage, onSave, onCancel }: MessageEditorProps) => {
  return (
    <div className="space-y-2 mb-2">
      <Input
        value={editedMessage}
        onChange={(e) => setEditedMessage(e.target.value)}
        className="w-full"
      />
      <div className="flex space-x-2">
        <Button size="sm" onClick={onSave}>
          Save
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
