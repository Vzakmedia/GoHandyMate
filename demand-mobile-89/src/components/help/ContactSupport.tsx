import { MessageCircle, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LiveChatWidget } from "@/components/chat/LiveChatWidget";

export const ContactSupport = () => {
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const { toast } = useToast();

  const handleLiveChat = () => {
    setIsLiveChatOpen(true);
    toast({
      title: "Live Chat Opening",
      description: "Connecting you with our support team...",
    });
  };

  const handlePhoneSupport = () => {
    // Open phone dialer
    window.location.href = "tel:+18008426396";
  };

  const handleEmailSupport = async () => {
    try {
      const { error } = await supabase.functions.invoke('send-support-email', {
        body: {
          type: 'contact_request',
          subject: 'General Support Request',
          message: 'User requested email support from Help Center'
        }
      });

      if (error) throw error;

      toast({
        title: "Email Sent",
        description: "We've sent you our support email. Please check your inbox.",
      });
    } catch (error) {
      console.error('Error sending support email:', error);
      toast({
        title: "Email Failed",
        description: "Please try again or contact support@gohandymate.com directly.",
        variant: "destructive"
      });
    }
  };

  const contactOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat", 
      description: "Get instant answers from our support team",
      availability: "Available 24/7",
      color: "primary",
      action: handleLiveChat
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with a support specialist", 
      availability: "1-800-HANDYMAN",
      color: "blue",
      action: handlePhoneSupport
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      availability: "support@gohandymate.com", 
      color: "green",
      action: handleEmailSupport
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Get Support</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Choose the way that works best for you. Our support team is here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {contactOptions.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <div 
                key={index} 
                className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={option.action}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">{option.title}</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">{option.description}</p>
                <span className="text-sm text-primary font-medium">{option.availability}</span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Live Chat Widget */}
      {isLiveChatOpen && <LiveChatWidget />}
    </div>
  );
};