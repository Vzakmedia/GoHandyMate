
interface ReplyIndicatorProps {
  replyToUser?: string | null;
  replyToMessage?: string | null;
}

export const ReplyIndicator = ({ replyToUser, replyToMessage }: ReplyIndicatorProps) => {
  if (!replyToUser || !replyToMessage) return null;

  return (
    <div className="mb-2 p-2 bg-gray-50 rounded border-l-2 border-blue-400">
      <p className="text-xs text-gray-500">Replying to {replyToUser}</p>
      <p className="text-sm text-gray-600 truncate">{replyToMessage}</p>
    </div>
  );
};
