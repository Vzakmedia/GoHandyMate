
import { useState, useEffect, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, User, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { JobMessagingModal } from '@/components/messaging/JobMessagingModal';
import { formatDistanceToNow } from 'date-fns';

interface MessageThread {
  job_id: string;
  job_title: string;
  job_status: string;
  customer_id: string;
  customer_name: string;
  last_message: {
    message_text: string;
    created_at: string;
    sender_id: string;
  };
  unread_count: number;
}

export const HandymanMessagingHub = () => {
  const { user } = useAuth();
  const [messageThreads, setMessageThreads] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchMessageThreads = useCallback(async () => {
    if (!user) return;

    try {
      const { data: jobsWithMessages, error } = await supabase
        .from('job_requests')
        .select(`
          id,
          title,
          status,
          customer_id,
          job_messages!inner (
            message_text,
            created_at,
            sender_id,
            is_read
          )
        `)
        .eq('assigned_to_user_id', user.id)
        .in('status', ['assigned', 'in_progress', 'completed']);

      if (error) throw error;

      const customerIds = [
        ...new Set(
          (jobsWithMessages ?? [])
            .map((job) => job.customer_id)
            .filter(Boolean)
        ),
      ];

      const { data: customerProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', customerIds);

      if (profilesError) throw profilesError;

      const threads: MessageThread[] = [];

      for (const job of jobsWithMessages ?? []) {
        if (!job.job_messages || job.job_messages.length === 0) continue;

        const customer = customerProfiles?.find((p) => p.id === job.customer_id);
        if (!customer) continue;

        const sorted = [...job.job_messages].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        const lastMessage = sorted[0];
        const unreadCount = job.job_messages.filter(
          (msg) => msg.sender_id !== user.id && !msg.is_read
        ).length;

        threads.push({
          job_id: job.id,
          job_title: job.title,
          job_status: job.status,
          customer_id: job.customer_id as string,
          customer_name: customer.full_name ?? 'Customer',
          last_message: {
            message_text: lastMessage.message_text,
            created_at: lastMessage.created_at,
            sender_id: lastMessage.sender_id,
          },
          unread_count: unreadCount,
        });
      }

      threads.sort(
        (a, b) =>
          new Date(b.last_message.created_at).getTime() -
          new Date(a.last_message.created_at).getTime()
      );

      setMessageThreads(threads);
    } catch (err) {
      console.error('Error fetching handyman message threads:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMessageThreads();
  }, [fetchMessageThreads]);

  const handleOpen = (thread: MessageThread) => {
    setSelectedThread(thread);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedThread(null);
    fetchMessageThreads();
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'completed':    return 'bg-green-100 text-green-800';
      case 'in_progress':  return 'bg-blue-100 text-blue-800';
      case 'assigned':     return 'bg-purple-100 text-purple-800';
      default:             return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Messages</h2>
          <p className="text-slate-500 text-sm mt-1">Conversations with your clients</p>
        </div>
        <Badge className="bg-[#166534]/10 text-[#166534] rounded-full px-3 py-1 font-black uppercase text-[10px] tracking-widest border-none">
          {messageThreads.length} {messageThreads.length === 1 ? 'Thread' : 'Threads'}
        </Badge>
      </div>

      <div className="flex items-center gap-2 p-1.5 bg-white/50 backdrop-blur-sm border border-black/5 rounded-[2rem] w-fit">
        <Button
          variant="default"
          size="sm"
          className="rounded-full px-6 bg-[#166534] text-white"
        >
          <MessageCircle className="w-3.5 h-3.5 mr-2" />
          <span className="text-[10px] font-black uppercase tracking-widest">All Messages</span>
        </Button>
      </div>

      <div className="bg-white rounded-[3rem] border border-black/5 overflow-hidden min-h-[400px]">
        <div className="p-8">
          {messageThreads.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No messages yet</h3>
              <p className="text-slate-500 text-sm max-w-[240px] mx-auto">
                Messages from your clients will appear here once you've been assigned to a job.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messageThreads.map((thread) => (
                <div
                  key={thread.job_id}
                  className="group relative border border-black/5 rounded-[2rem] p-6 hover:bg-slate-50 cursor-pointer transition-all duration-300"
                  onClick={() => handleOpen(thread)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-black/5">
                          <User className="w-5 h-5 text-slate-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 leading-tight">
                            {thread.customer_name}
                          </h4>
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#166534]">
                            {thread.job_title}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                        {thread.last_message.sender_id === user?.id && (
                          <span className="font-bold text-[#166534]">You: </span>
                        )}
                        {thread.last_message.message_text}
                      </p>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            {formatDistanceToNow(new Date(thread.last_message.created_at), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <Badge
                          className={`rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest border-none ${statusColor(thread.job_status)}`}
                        >
                          {thread.job_status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between self-stretch">
                      {thread.unread_count > 0 ? (
                        <div className="w-6 h-6 bg-[#166534] text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                          {thread.unread_count}
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full border border-black/5 flex items-center justify-center group-hover:bg-[#166534] group-hover:text-white transition-colors duration-300">
                          <MessageCircle className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedThread && (
        <JobMessagingModal
          isOpen={showModal}
          onClose={handleClose}
          jobId={selectedThread.job_id}
          jobTitle={selectedThread.job_title}
          jobStatus={selectedThread.job_status}
          otherParticipantId={selectedThread.customer_id}
          otherParticipantName={selectedThread.customer_name}
        />
      )}
    </div>
  );
};
