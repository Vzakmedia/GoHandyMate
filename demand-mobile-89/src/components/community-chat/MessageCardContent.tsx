
import { MessageContent } from './MessageContent';
import { MessageEditor } from './MessageEditor';
import { ChatMessage } from './MessageCard';

interface MessageCardContentProps {
  message: ChatMessage;
  isEditing: boolean;
  editedMessage: string;
  setEditedMessage: (message: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}

export const MessageCardContent = ({
  message,
  isEditing,
  editedMessage,
  setEditedMessage,
  onSaveEdit,
  onCancelEdit
}: MessageCardContentProps) => {
  return (
    <>
      {isEditing ? (
        <div className="ml-13">
          <MessageEditor
            editedMessage={editedMessage}
            setEditedMessage={setEditedMessage}
            onSave={onSaveEdit}
            onCancel={onCancelEdit}
          />
        </div>
      ) : (
        <MessageContent message={message} />
      )}
    </>
  );
};
