import { SafetyHero } from "../components/safety/SafetyHero";
import { SafetyFeatures } from "../components/safety/SafetyFeatures";
import { SafetyVerification } from "../components/safety/SafetyVerification";
import { SafetyTips } from "../components/safety/SafetyTips";
import { SafetyEmergency } from "../components/safety/SafetyEmergency";

export const Safety = () => {
  return (
    <div className="min-h-screen bg-background">
      <SafetyHero />
      <SafetyFeatures />
      <SafetyVerification />
      <SafetyTips />
      <SafetyEmergency />
    </div>
  );
};
