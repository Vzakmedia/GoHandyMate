import { LandingHero } from "@/components/shared/LandingHero";
import { useNavigate } from "react-router-dom";

export const AboutHero = () => {
  const navigate = useNavigate();

  return (
    <LandingHero
      topic="Why GoHandyMate?"
      title="About GoHandyMate"
      description="We're revolutionizing home services by connecting skilled professionals with customers who need reliable, affordable solutions. Join our platform and discover the future of home service management."
      buttonText="Learn More"
      onButtonClick={() => navigate('/services')}
      backgroundImageUrl="https://images.unsplash.com/photo-1542626991-cbc4e32524cc?q=80&w=2938&auto=format&fit=crop"
    />
  );
};