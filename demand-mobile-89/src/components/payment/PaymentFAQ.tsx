export const PaymentFAQ = () => {
  const faqs = [
    {
      question: "When is my payment charged?",
      answer: "Your payment is authorized when you book a service, but not charged until the work begins. The funds are held securely in escrow."
    },
    {
      question: "What if I'm not satisfied with the work?",
      answer: "If you're not satisfied, don't approve the work completion. Contact our support team and we'll help resolve the issue or provide a full refund."
    },
    {
      question: "How long are payments held in escrow?",
      answer: "Payments are typically held for 24-48 hours after work completion to give you time to inspect and approve the work."
    },
    {
      question: "Are there any additional fees?",
      answer: "Our platform fee is included in the quoted price. There are no hidden fees or additional charges for payment protection."
    },
    {
      question: "What if the professional doesn't show up?",
      answer: "If a professional fails to show up or cancels last minute, your payment is immediately refunded and we'll help you find an alternative."
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about payment protection
          </p>
        </div>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-card p-8 rounded-xl border border-border hover:shadow-lg transition-all duration-200">
              <h3 className="text-xl font-semibold text-foreground mb-4">{faq.question}</h3>
              <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};