
import { ChatMessage } from './MessageCard';

interface MessageContentProps {
  message: ChatMessage;
}

export const MessageContent = ({ message }: MessageContentProps) => {
  return (
    <div className="ml-13">
      {/* Message content */}
      {message.message && (
        <p className="text-gray-900 mb-3 text-sm leading-relaxed break-words">{message.message}</p>
      )}
      
      {/* Image */}
      {message.image_url && (
        <div className="mb-3">
          <img 
            src={message.image_url} 
            alt="Shared image" 
            className="max-w-full h-auto rounded-lg object-cover cursor-pointer border border-gray-200"
            onClick={() => window.open(message.image_url, '_blank')}
          />
        </div>
      )}
    </div>
  );
};
