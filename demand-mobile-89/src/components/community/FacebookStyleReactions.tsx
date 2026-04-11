import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Reaction {
  type: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry';
  emoji: string;
  label: string;
  color: string;
}

const reactions: Reaction[] = [
  { type: 'like', emoji: '👍', label: 'Like', color: 'text-blue-600' },
  { type: 'love', emoji: '❤️', label: 'Love', color: 'text-red-600' },
  { type: 'laugh', emoji: '😂', label: 'Haha', color: 'text-yellow-600' },
  { type: 'wow', emoji: '😮', label: 'Wow', color: 'text-orange-600' },
  { type: 'sad', emoji: '😢', label: 'Sad', color: 'text-yellow-600' },
  { type: 'angry', emoji: '😡', label: 'Angry', color: 'text-red-600' }
];

interface FacebookStyleReactionsProps {
  messageId: string;
  currentReaction?: string;
  reactionCounts: Record<string, number>;
  onReact: (messageId: string, reactionType: string) => void;
  showReactionBar?: boolean;
  onShowReactionBar?: (show: boolean) => void;
}

export const FacebookStyleReactions = ({
  messageId,
  currentReaction,
  reactionCounts,
  onReact,
  showReactionBar = false,
  onShowReactionBar
}: FacebookStyleReactionsProps) => {
  const [hovering, setHovering] = useState(false);

  const totalReactions = Object.values(reactionCounts).reduce((sum, count) => sum + count, 0);
  const topReactions = Object.entries(reactionCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .filter(([, count]) => count > 0);

  const handleReactionClick = (reactionType: string) => {
    onReact(messageId, reactionType);
    onShowReactionBar?.(false);
  };

  const currentReactionData = reactions.find(r => r.type === currentReaction);

  return (
    <div className="relative">
      {/* Reaction Bar */}
      {showReactionBar && (
        <div className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg border border-gray-200 px-2 py-1 flex items-center space-x-1 z-10">
          {reactions.map((reaction) => (
            <Button
              key={reaction.type}
              variant="ghost"
              size="sm"
              onClick={() => handleReactionClick(reaction.type)}
              className="p-1 h-auto hover:scale-110 transition-transform"
              title={reaction.label}
            >
              <span className="text-lg">{reaction.emoji}</span>
            </Button>
          ))}
        </div>
      )}

      <div className="flex items-center space-x-4">
        {/* Main Like Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (currentReaction === 'like') {
              onReact(messageId, '');
            } else {
              onReact(messageId, 'like');
            }
          }}
          onMouseEnter={() => {
            setHovering(true);
            onShowReactionBar?.(true);
          }}
          onMouseLeave={() => {
            setTimeout(() => {
              setHovering(false);
              onShowReactionBar?.(false);
            }, 500);
          }}
          className={cn(
            "flex items-center space-x-2 transition-colors",
            currentReactionData ? currentReactionData.color : "text-gray-500 hover:text-blue-600"
          )}
        >
          <span className="text-base">
            {currentReactionData ? currentReactionData.emoji : '👍'}
          </span>
          <span className="font-medium text-sm">
            {currentReactionData ? currentReactionData.label : 'Like'}
          </span>
        </Button>

        {/* Reaction Counts Display */}
        {totalReactions > 0 && (
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              {topReactions.map(([type, count]) => {
                const reaction = reactions.find(r => r.type === type);
                return reaction ? (
                  <div key={type} className="flex items-center space-x-1">
                    <span className="text-sm">{reaction.emoji}</span>
                  </div>
                ) : null;
              })}
            </div>
            <span>{totalReactions}</span>
          </div>
        )}
      </div>
    </div>
  );
};