import { Book, Users, Shield, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const FAQSection = () => {
  const faqCategories = [
    {
      title: "Getting Started",
      icon: Book,
      questions: [
        {
          question: "How do I post a job?",
          answer: "To post a job, click on 'Post a Job' button on the homepage, fill out the job details including description, location, and budget, then submit. Our professionals will start sending you quotes within minutes."
        },
        {
          question: "How do I find professionals?", 
          answer: "You can browse professionals by going to our Services page, selecting your service category, and viewing available professionals in your area. You can also post a job and let professionals come to you."
        },
        {
          question: "What services are available?",
          answer: "We offer a wide range of services including plumbing, electrical work, carpentry, painting, HVAC, cleaning, and many more home improvement and maintenance services."
        },
        {
          question: "How do I create an account?",
          answer: "Click 'Sign Up' in the top right corner, choose whether you're a customer or professional, fill out your details, and verify your email. For professionals, additional verification steps may be required."
        }
      ]
    },
    {
      title: "Booking & Payments",
      icon: Users,
      questions: [
        {
          question: "How do I book a professional?",
          answer: "After receiving quotes, review the profiles and ratings, then click 'Accept Quote' on your preferred professional. You can then schedule a time that works for both of you."
        },
        {
          question: "When do I pay?",
          answer: "Payment is held in escrow when you book a service. The professional is paid only after the work is completed to your satisfaction. This protects both parties."
        },
        {
          question: "What payment methods are accepted?",
          answer: "We accept all major credit cards, debit cards, and bank transfers. All payments are processed securely through our encrypted payment system."
        },
        {
          question: "How do refunds work?",
          answer: "If you're not satisfied with the service, you can request a refund within 48 hours of completion. We'll review the case and issue a full or partial refund based on our investigation."
        }
      ]
    },
    {
      title: "Safety & Trust", 
      icon: Shield,
      questions: [
        {
          question: "Are professionals background checked?",
          answer: "Yes, all professionals undergo comprehensive background checks, identity verification, and license verification before joining our platform. We also verify insurance coverage."
        },
        {
          question: "What insurance coverage is provided?",
          answer: "All professionals carry liability insurance, and we provide additional coverage for damages up to $1M. Your property and safety are fully protected during any service."
        },
        {
          question: "How do I report an issue?",
          answer: "You can report issues through your account dashboard, contact our support team via live chat, phone, or email. We take all reports seriously and investigate promptly."
        },
        {
          question: "What is payment protection?",
          answer: "Our payment protection ensures your money is held safely in escrow until work is completed. If work isn't completed as agreed, you'll receive a full refund."
        }
      ]
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Browse by category to find quick answers to common questions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {faqCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mr-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{category.title}</h3>
                </div>
                
                <Accordion type="single" collapsible className="space-y-2">
                  {category.questions.map((faq, qIndex) => (
                    <AccordionItem key={qIndex} value={`${index}-${qIndex}`} className="border border-gray-200 rounded-lg">
                      <AccordionTrigger className="text-left text-sm font-medium text-foreground hover:text-primary px-4 py-3">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground px-4 pb-3">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};