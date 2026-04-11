import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Auth
import SplashScreen from '../screens/auth/SplashScreen';
import RoleSelectionScreen from '../screens/auth/RoleSelectionScreen';
import ClientOnboardingScreen from '../screens/auth/ClientOnboardingScreen';
import ProOnboardingScreen from '../screens/auth/ProOnboardingScreen';
import LoginSignupScreen from '../screens/auth/LoginSignupScreen';

// Client navigators & screens
import ClientTabNavigator from './ClientTabNavigator';
import PersonalInfoScreen from '../screens/client/PersonalInfoScreen';
import SavedAddressesScreen from '../screens/client/SavedAddressesScreen';
import AddNewAddressScreen from '../screens/client/AddNewAddressScreen';
import PaymentMethodsScreen from '../screens/client/PaymentMethodsScreen';
import AddNewCardScreen from '../screens/client/AddNewCardScreen';
import NotificationsScreen from '../screens/client/NotificationsScreen';
import BecomeAProScreen from '../screens/client/BecomeAProScreen';
import ServicesListScreen from '../screens/client/ServicesListScreen';
import OfferDetailsScreen from '../screens/client/OfferDetailsScreen';
import ProviderDetailsScreen from '../screens/client/ProviderDetailsScreen';
import BookServiceScreen from '../screens/client/BookServiceScreen';
import ChatScreen from '../screens/client/ChatScreen';
import ProvidersListScreen from '../screens/client/ProvidersListScreen';
import ReviewBookingScreen from '../screens/client/ReviewBookingScreen';
import BookingConfirmedScreen from '../screens/client/BookingConfirmedScreen';
import BookingDetailsScreen from '../screens/client/BookingDetailsScreen';
import CommunityGroupChatScreen from '../screens/client/CommunityGroupChatScreen';

// Pro Application
import BasicInfoScreen from '../screens/pro-application/BasicInfoScreen';
import ProfessionalDetailsScreen from '../screens/pro-application/ProfessionalDetailsScreen';
import TrustSafetyScreen from '../screens/pro-application/TrustSafetyScreen';

// Pro screens
import ProTabNavigator from './ProTabNavigator';
import JobDetailsScreen from '../screens/pro/JobDetailsScreen';
import CreateInvoiceScreen from '../screens/pro/CreateInvoiceScreen';
import InvoiceDetailsScreen from '../screens/pro/InvoiceDetailsScreen';
import AllInvoicesScreen from '../screens/pro/AllInvoicesScreen';
import InvoiceSentScreen from '../screens/pro/InvoiceSentScreen';
import EarningsSummaryScreen from '../screens/pro/EarningsSummaryScreen';
import ServiceAreaScreen from '../screens/pro/ServiceAreaScreen';
import WorkingHoursScreen from '../screens/pro/WorkingHoursScreen';
import VerificationProgressScreen from '../screens/pro/VerificationProgressScreen';
import ProChatScreen from '../screens/pro/ProChatScreen';
import AdvertiseScreen from '../screens/pro/AdvertiseScreen';

const Stack = createStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
      {/* Auth */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="ClientOnboarding" component={ClientOnboardingScreen} />
      <Stack.Screen name="ProOnboarding" component={ProOnboardingScreen} />
      <Stack.Screen name="Login" component={LoginSignupScreen} />

      {/* Client */}
      <Stack.Screen name="ClientApp" component={ClientTabNavigator} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      <Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} />
      <Stack.Screen name="AddNewAddress" component={AddNewAddressScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="AddNewCard" component={AddNewCardScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="BecomeAPro" component={BecomeAProScreen} />
      <Stack.Screen name="ServicesList" component={ServicesListScreen} />
      <Stack.Screen name="OfferDetails" component={OfferDetailsScreen} />
      <Stack.Screen name="ProviderDetails" component={ProviderDetailsScreen} />
      <Stack.Screen name="BookService" component={BookServiceScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="ProvidersList" component={ProvidersListScreen} />
      <Stack.Screen name="ReviewBooking" component={ReviewBookingScreen} />
      <Stack.Screen name="BookingConfirmed" component={BookingConfirmedScreen} />
      <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
      <Stack.Screen name="CommunityGroupChat" component={CommunityGroupChatScreen} />

      {/* Pro Application */}
      <Stack.Screen name="ProAppStep1" component={BasicInfoScreen} />
      <Stack.Screen name="ProAppStep2" component={ProfessionalDetailsScreen} />
      <Stack.Screen name="ProAppStep3" component={TrustSafetyScreen} />

      {/* Pro Dashboard */}
      <Stack.Screen name="ProApp" component={ProTabNavigator} />
      <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
      <Stack.Screen name="CreateInvoice" component={CreateInvoiceScreen} />
      <Stack.Screen name="InvoiceDetails" component={InvoiceDetailsScreen} />
      <Stack.Screen name="AllInvoices" component={AllInvoicesScreen} />
      <Stack.Screen name="InvoiceSent" component={InvoiceSentScreen} />
      <Stack.Screen name="EarningsSummary" component={EarningsSummaryScreen} />
      <Stack.Screen name="ServiceArea" component={ServiceAreaScreen} />
      <Stack.Screen name="WorkingHours" component={WorkingHoursScreen} />
      <Stack.Screen name="VerificationProgress" component={VerificationProgressScreen} />
      <Stack.Screen name="ProChat" component={ProChatScreen} />
      <Stack.Screen name="Advertise" component={AdvertiseScreen} />
    </Stack.Navigator>
  );
}
