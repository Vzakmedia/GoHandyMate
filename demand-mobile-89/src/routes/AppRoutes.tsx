import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// ─── Loading fallback ─────────────────────────────────────────────────────────
const PageLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#6B7280', fontSize: 14 }}>
    Loading...
  </div>
);

// ─── Eagerly loaded (critical path only) ─────────────────────────────────────
import { OnboardingPage } from '@/pages/OnboardingPage';
import Index from '@/pages/Index';

// ─── Lazy loaded (everything else) ───────────────────────────────────────────
const BookingPage = lazy(() => import('@/pages/BookingPage').then(m => ({ default: m.BookingPage })));
const JobsPage = lazy(() => import('@/pages/JobsPage').then(m => ({ default: m.JobsPage })));
const VideoManager = lazy(() => import('@/pages/VideoManager'));
const AdminBackendPage = lazy(() => import('@/pages/AdminBackend'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('@/pages/TermsOfService').then(m => ({ default: m.TermsOfService })));
const CookiePolicy = lazy(() => import('@/pages/CookiePolicy').then(m => ({ default: m.CookiePolicy })));
const Accessibility = lazy(() => import('@/pages/Accessibility').then(m => ({ default: m.Accessibility })));
const PostJob = lazy(() => import('@/pages/PostJob').then(m => ({ default: m.PostJob })));
const CustomerReviews = lazy(() => import('@/pages/CustomerReviews').then(m => ({ default: m.CustomerReviews })));
const PaymentProtection = lazy(() => import('@/pages/PaymentProtection').then(m => ({ default: m.PaymentProtection })));
const SignUpPro = lazy(() => import('@/pages/SignUpPro').then(m => ({ default: m.SignUpPro })));
const ProResources = lazy(() => import('@/pages/ProResources'));
const SuccessStories = lazy(() => import('@/pages/SuccessStories').then(m => ({ default: m.SuccessStories })));
const ProCommunity = lazy(() => import('@/pages/ProCommunity').then(m => ({ default: m.ProCommunity })));
const Careers = lazy(() => import('@/pages/Careers').then(m => ({ default: m.Careers })));
const Press = lazy(() => import('@/pages/Press').then(m => ({ default: m.Press })));
const InvestorRelations = lazy(() => import('@/pages/InvestorRelations').then(m => ({ default: m.InvestorRelations })));
const Partnerships = lazy(() => import('@/pages/Partnerships').then(m => ({ default: m.Partnerships })));
const AboutUs = lazy(() => import('@/pages/AboutUs').then(m => ({ default: m.AboutUs })));
const HowItWorks = lazy(() => import('@/pages/HowItWorks').then(m => ({ default: m.HowItWorks })));
const HelpCenter = lazy(() => import('@/pages/HelpCenter').then(m => ({ default: m.HelpCenter })));
const Safety = lazy(() => import('@/pages/Safety').then(m => ({ default: m.Safety })));
const TrustAndSafety = lazy(() => import('@/pages/TrustAndSafety').then(m => ({ default: m.TrustAndSafety })));
const Services = lazy(() => import('@/pages/Services').then(m => ({ default: m.Services })));
const HandymanPage = lazy(() => import('@/pages/HandymanPage').then(m => ({ default: m.HandymanPage })));
const Professionals = lazy(() => import('@/pages/Professionals'));
const HandymanProfilePage = lazy(() => import('@/pages/HandymanProfilePage').then(m => ({ default: m.HandymanProfilePage })));
const QuoteRequestPage = lazy(() => import('@/pages/QuoteRequestPage').then(m => ({ default: m.QuoteRequestPage })));
const AdminChatDashboard = lazy(() => import('@/pages/admin/AdminChatDashboard').then(m => ({ default: m.AdminChatDashboard })));
const BusinessAdvertising = lazy(() => import('@/pages/BusinessAdvertising'));
const AdminAdvertising = lazy(() => import('@/pages/AdminAdvertising'));
const AdvertisingSuccess = lazy(() => import('@/pages/AdvertisingSuccess'));

// Help pages
const JobDescriptionGuide = lazy(() => import('@/pages/help/JobDescriptionGuide').then(m => ({ default: m.JobDescriptionGuide })));
const PaymentProtectionHelp = lazy(() => import('@/pages/help/PaymentProtection').then(m => ({ default: m.PaymentProtection })));
const ChoosingProfessional = lazy(() => import('@/pages/help/ChoosingProfessional').then(m => ({ default: m.ChoosingProfessional })));
const FirstBooking = lazy(() => import('@/pages/help/FirstBooking').then(m => ({ default: m.FirstBooking })));
const ProjectChanges = lazy(() => import('@/pages/help/ProjectChanges').then(m => ({ default: m.ProjectChanges })));
const DisputesRefunds = lazy(() => import('@/pages/help/DisputesRefunds').then(m => ({ default: m.DisputesRefunds })));
const SetupPropertiesHelp = lazy(() => import('@/components/help/SetupPropertiesHelp').then(m => ({ default: m.SetupPropertiesHelp })));
const ManagingUnitsHelp = lazy(() => import('@/components/help/ManagingUnitsHelp').then(m => ({ default: m.ManagingUnitsHelp })));
const RequestingServicesHelp = lazy(() => import('@/components/help/RequestingServicesHelp').then(m => ({ default: m.RequestingServicesHelp })));
const UnderstandingInvoicesHelp = lazy(() => import('@/components/help/UnderstandingInvoicesHelp').then(m => ({ default: m.UnderstandingInvoicesHelp })));
const BulkBillingHelp = lazy(() => import('@/components/help/BulkBillingHelp').then(m => ({ default: m.BulkBillingHelp })));
const PaymentMethodsHelp = lazy(() => import('@/components/help/PaymentMethodsHelp').then(m => ({ default: m.PaymentMethodsHelp })));
const EmergencyProceduresHelp = lazy(() => import('@/components/help/EmergencyProceduresHelp').then(m => ({ default: m.EmergencyProceduresHelp })));
const SchedulingRecurringServicesHelp = lazy(() => import('@/components/help/SchedulingRecurringServicesHelp').then(m => ({ default: m.SchedulingRecurringServicesHelp })));
const WorkingWithTechniciansHelp = lazy(() => import('@/components/help/WorkingWithTechniciansHelp').then(m => ({ default: m.WorkingWithTechniciansHelp })));
const CommonIssuesHelp = lazy(() => import('@/components/help/CommonIssuesHelp').then(m => ({ default: m.CommonIssuesHelp })));
const AccountProblemsHelp = lazy(() => import('@/components/help/AccountProblemsHelp').then(m => ({ default: m.AccountProblemsHelp })));
const TechnicalSupportHelp = lazy(() => import('@/components/help/TechnicalSupportHelp').then(m => ({ default: m.TechnicalSupportHelp })));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/app" element={<Index />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/book/:handymanId" element={<BookingPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/video-manager" element={<VideoManager />} />
        <Route path="/admin/backend" element={<AdminBackendPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/accessibility" element={<Accessibility />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/customer-reviews" element={<CustomerReviews />} />
        <Route path="/payment-protection" element={<PaymentProtection />} />
        <Route path="/sign-up-pro" element={<SignUpPro />} />
        <Route path="/pro-resources" element={<ProResources />} />
        <Route path="/success-stories" element={<SuccessStories />} />
        <Route path="/pro-community" element={<ProCommunity />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/press" element={<Press />} />
        <Route path="/investor-relations" element={<InvestorRelations />} />
        <Route path="/partnerships" element={<Partnerships />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/help/job-description-guide" element={<JobDescriptionGuide />} />
        <Route path="/help/payment-protection" element={<PaymentProtectionHelp />} />
        <Route path="/help/choosing-professional" element={<ChoosingProfessional />} />
        <Route path="/help/first-booking" element={<FirstBooking />} />
        <Route path="/help/project-changes" element={<ProjectChanges />} />
        <Route path="/help/disputes-refunds" element={<DisputesRefunds />} />
        <Route path="/admin/chat" element={<AdminChatDashboard />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/services" element={<Services />} />
        <Route path="/trust-safety" element={<TrustAndSafety />} />
        <Route path="/handyman" element={<HandymanPage />} />
        <Route path="/professionals" element={<Professionals />} />
        <Route path="/handyman-profile/:profileId" element={<HandymanProfilePage />} />
        <Route path="/quote-request/:professionalId" element={<QuoteRequestPage />} />
        <Route path="/help/setup-properties" element={<SetupPropertiesHelp />} />
        <Route path="/help/managing-units" element={<ManagingUnitsHelp />} />
        <Route path="/help/requesting-services" element={<RequestingServicesHelp />} />
        <Route path="/help/understanding-invoices" element={<UnderstandingInvoicesHelp />} />
        <Route path="/help/bulk-billing" element={<BulkBillingHelp />} />
        <Route path="/help/payment-methods" element={<PaymentMethodsHelp />} />
        <Route path="/help/emergency-procedures" element={<EmergencyProceduresHelp />} />
        <Route path="/help/scheduling-recurring-services" element={<SchedulingRecurringServicesHelp />} />
        <Route path="/help/working-with-technicians" element={<WorkingWithTechniciansHelp />} />
        <Route path="/help/common-issues" element={<CommonIssuesHelp />} />
        <Route path="/help/account-problems" element={<AccountProblemsHelp />} />
        <Route path="/help/technical-support" element={<TechnicalSupportHelp />} />
        <Route path="/business-advertising" element={<BusinessAdvertising />} />
        <Route path="/admin/advertising" element={<AdminAdvertising />} />
        <Route path="/advertising-success" element={<AdvertisingSuccess />} />
      </Routes>
    </Suspense>
  );
};
