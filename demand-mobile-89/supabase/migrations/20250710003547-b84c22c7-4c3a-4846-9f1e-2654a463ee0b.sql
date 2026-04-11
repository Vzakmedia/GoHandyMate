-- Create enum for chat session status
CREATE TYPE public.chat_status AS ENUM ('waiting', 'active', 'closed', 'transferred');

-- Create enum for message types
CREATE TYPE public.message_type AS ENUM ('text', 'image', 'file', 'system');

-- Create enum for user roles (extending existing functionality)
CREATE TYPE public.chat_role AS ENUM ('customer', 'agent', 'admin');

-- Create chat sessions table
CREATE TABLE public.chat_sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status chat_status NOT NULL DEFAULT 'waiting',
    subject TEXT,
    priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
    department TEXT DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    closed_at TIMESTAMP WITH TIME ZONE,
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    satisfaction_feedback TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message_type message_type NOT NULL DEFAULT 'text',
    content TEXT NOT NULL,
    attachment_url TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create agent assignments table for managing who can handle chats
CREATE TABLE public.chat_agents (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_online BOOLEAN NOT NULL DEFAULT false,
    current_chat_count INTEGER NOT NULL DEFAULT 0,
    max_concurrent_chats INTEGER NOT NULL DEFAULT 5,
    departments TEXT[] DEFAULT '{"general"}',
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_chat_sessions_customer_id ON public.chat_sessions(customer_id);
CREATE INDEX idx_chat_sessions_agent_id ON public.chat_sessions(agent_id);
CREATE INDEX idx_chat_sessions_status ON public.chat_sessions(status);
CREATE INDEX idx_chat_sessions_created_at ON public.chat_sessions(created_at);

CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX idx_chat_messages_sender_id ON public.chat_messages(sender_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at);
CREATE INDEX idx_chat_messages_is_read ON public.chat_messages(is_read);

CREATE INDEX idx_chat_agents_user_id ON public.chat_agents(user_id);
CREATE INDEX idx_chat_agents_is_online ON public.chat_agents(is_online);
CREATE INDEX idx_chat_agents_is_active ON public.chat_agents(is_active);

-- Enable Row Level Security
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_agents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for chat_sessions
CREATE POLICY "Customers can view their own chat sessions" 
ON public.chat_sessions 
FOR SELECT 
USING (auth.uid() = customer_id);

CREATE POLICY "Customers can create chat sessions" 
ON public.chat_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update their own chat sessions" 
ON public.chat_sessions 
FOR UPDATE 
USING (auth.uid() = customer_id);

CREATE POLICY "Agents can view assigned chat sessions" 
ON public.chat_sessions 
FOR SELECT 
USING (
    auth.uid() = agent_id OR 
    EXISTS (
        SELECT 1 FROM public.chat_agents 
        WHERE user_id = auth.uid() AND is_active = true
    )
);

CREATE POLICY "Agents can update assigned chat sessions" 
ON public.chat_sessions 
FOR UPDATE 
USING (
    auth.uid() = agent_id OR 
    EXISTS (
        SELECT 1 FROM public.chat_agents 
        WHERE user_id = auth.uid() AND is_active = true
    )
);

CREATE POLICY "Admins can manage all chat sessions" 
ON public.chat_sessions 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND (email = 'admin@gohandymate.com' OR email LIKE '%@admin.gohandymate.com')
    )
);

-- Create RLS policies for chat_messages
CREATE POLICY "Users can view messages in their sessions" 
ON public.chat_messages 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.chat_sessions 
        WHERE id = session_id 
        AND (customer_id = auth.uid() OR agent_id = auth.uid())
    ) OR
    EXISTS (
        SELECT 1 FROM public.chat_agents 
        WHERE user_id = auth.uid() AND is_active = true
    )
);

CREATE POLICY "Users can send messages in their sessions" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
        SELECT 1 FROM public.chat_sessions 
        WHERE id = session_id 
        AND (customer_id = auth.uid() OR agent_id = auth.uid())
    )
);

CREATE POLICY "Users can update their own messages" 
ON public.chat_messages 
FOR UPDATE 
USING (auth.uid() = sender_id);

CREATE POLICY "Admins can manage all messages" 
ON public.chat_messages 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND (email = 'admin@gohandymate.com' OR email LIKE '%@admin.gohandymate.com')
    )
);

-- Create RLS policies for chat_agents
CREATE POLICY "Agents can view their own agent profile" 
ON public.chat_agents 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Agents can update their own agent profile" 
ON public.chat_agents 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all agents" 
ON public.chat_agents 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND (email = 'admin@gohandymate.com' OR email LIKE '%@admin.gohandymate.com')
    )
);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_chat_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_chat_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_chat_agents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_chat_sessions_updated_at
BEFORE UPDATE ON public.chat_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_chat_sessions_updated_at();

CREATE TRIGGER update_chat_messages_updated_at
BEFORE UPDATE ON public.chat_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_chat_messages_updated_at();

CREATE TRIGGER update_chat_agents_updated_at
BEFORE UPDATE ON public.chat_agents
FOR EACH ROW
EXECUTE FUNCTION public.update_chat_agents_updated_at();

-- Create function to automatically update session timestamp when new message is added
CREATE OR REPLACE FUNCTION public.update_session_on_new_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.chat_sessions 
    SET updated_at = now() 
    WHERE id = NEW.session_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_session_on_new_message
AFTER INSERT ON public.chat_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_session_on_new_message();

-- Enable realtime for live chat functionality
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_agents;