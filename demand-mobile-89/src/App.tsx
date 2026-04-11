
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/features/auth';
import { UserRoleProvider } from '@/contexts/UserRoleProvider';
import { AccountVerificationProvider } from '@/components/AccountVerificationProvider';
import { NotificationProvider } from '@/components/NotificationProvider';
import { AppRoutes } from '@/routes/AppRoutes';
import { AppLayout, ScrollToTop } from '@/shared/components/layout';
import { NativeAppShell } from '@/components/NativeAppShell';
import { Toaster } from 'sonner';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NativeAppShell>
        <BrowserRouter>
          <ScrollToTop />
          <AuthProvider>
            <AccountVerificationProvider>
              <UserRoleProvider>
                <NotificationProvider>
                  <AppLayout>
                    <AppRoutes />
                    <Toaster />
                  </AppLayout>
                </NotificationProvider>
              </UserRoleProvider>
            </AccountVerificationProvider>
          </AuthProvider>
        </BrowserRouter>
      </NativeAppShell>
    </QueryClientProvider>
  );
}

export default App;
