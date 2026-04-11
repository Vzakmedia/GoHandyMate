import { LandingHero } from "@/components/shared/LandingHero";

interface ProHeroProps {
  onSignUp: () => void;
}

export const ProHero = ({ onSignUp }: ProHeroProps) => {
  return (
    <LandingHero
      topic="Grow Your Business"
      title="Join Our Professional Network"
      description="Connect with customers in your area and grow your business. Join thousands of professionals already earning on GoHandyMate."
      buttonText="Sign Up Now"
      onButtonClick={onSignUp}
      backgroundImageUrl="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2938&auto=format&fit=crop"
    />
  );
};