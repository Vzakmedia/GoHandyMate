
import React from "react";
import { OptimizedHandymanDataProvider } from "@/contexts/OptimizedHandymanDataContext";
import { OptimizedHandymanOverviewContent } from "@/components/handyman/overview/OptimizedHandymanOverviewContent";

export const OptimizedHandymanOverview = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <OptimizedHandymanDataProvider>
        <OptimizedHandymanOverviewContent />
      </OptimizedHandymanDataProvider>
    </div>
  );
};
