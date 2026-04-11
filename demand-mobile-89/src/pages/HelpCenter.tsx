import { HelpHero } from "../components/help/HelpHero";
import { ContactSupport } from "../components/help/ContactSupport";
import { FAQSection } from "../components/help/FAQSection";
import { PopularArticles } from "../components/help/PopularArticles";
import { EmergencyContact } from "../components/help/EmergencyContact";

export const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-background">
      <HelpHero />
      <ContactSupport />
      <FAQSection />
      <PopularArticles />
      <EmergencyContact />
    </div>
  );
};
