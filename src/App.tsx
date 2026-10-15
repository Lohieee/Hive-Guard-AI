import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { HardwareSimulationModal } from './components/common/HardwareSimulationModal';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { OnboardingWizard } from './pages/OnboardingWizard';
import { DashboardPage } from './pages/DashboardPage';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { ApiariesAndHivesPage } from './pages/ApiariesAndHivesPage';
import { HiveDetailPage } from './pages/HiveDetailPage';
import { AiRiskAnalysisPage } from './pages/AiRiskAnalysisPage';
import { ParasiteMonitoringPage } from './pages/ParasiteMonitoringPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ReportsAnalyticsPage } from './pages/ReportsAnalyticsPage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { BillingHistoryPage } from './pages/BillingHistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpDocsPage } from './pages/HelpDocsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { authService, AuthSession } from './services/supabaseClient';
import { sensorEngine } from './services/sensorEngine';
import { db } from './services/mockDb';

export function App() {
  const [activeRoute, setActiveRoute] = useState<string>('landing');
  const [selectedHiveId, setSelectedHiveId] = useState<string>('hive_01');
  const [selectedApiaryId, setSelectedApiaryId] = useState<string>('all');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [simulatorOpen, setSimulatorOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [authSession, setAuthSession] = useState<AuthSession>({
    user: db.getUser(),
    isAuthenticated: true,
    isMock: true
  });

  // Check auth session on startup
  useEffect(() => {
    authService.getSession().then((session) => {
      setAuthSession(session);
    });

    // Start background IoT sensor heartbeat (emits natural biological fluctuations)
    sensorEngine.startSimulationHeartbeat(15000);

    // Listen for incoming sensor readings and alert engine triggers
    const unsubscribe = sensorEngine.subscribe(({ reading, alertResult }) => {
      if (alertResult && alertResult.triggered && alertResult.alert) {
        addToast({
          id: `toast_${Date.now()}`,
          type: alertResult.smsSent ? 'sms' : alertResult.alert.severity === 'critical' ? 'critical' : 'warning',
          title: alertResult.smsSent ? 'SMS ALERT TRANSMITTED' : 'HIVEGUARD AI WARNING',
          message: alertResult.alert.message,
        });
      }
    });

    return () => {
      unsubscribe();
      sensorEngine.stopSimulationHeartbeat();
    };
  }, []);

  const addToast = (toast: ToastMessage) => {
    setToasts((prev) => [...prev, toast]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleNavigate = (route: string, hiveId?: string) => {
    setActiveRoute(route);
    if (hiveId) setSelectedHiveId(hiveId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await authService.signOut();
    setAuthSession({ user: null, isAuthenticated: false, isMock: true });
    setActiveRoute('login');
  };

  const unreadAlertsCount = db.getAlerts().filter((a) => a.status === 'active').length;

  // Standalone full-page views that don't need the dashboard layout
  const isStandalonePage =
    activeRoute === 'landing' ||
    activeRoute === 'login' ||
    activeRoute === 'register' ||
    activeRoute === 'forgot-password' ||
    activeRoute === 'onboarding' ||
    activeRoute === 'privacy' ||
    activeRoute === 'terms';

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 flex flex-col font-sans">
      {/* Standalone Pages */}
      {activeRoute === 'landing' && (
        <LandingPage
          onNavigate={handleNavigate}
          onOpenSimulator={() => setSimulatorOpen(true)}
        />
      )}

      {activeRoute === 'login' && (
        <LoginPage
          onNavigate={handleNavigate}
          onLoginSuccess={() => {
            setAuthSession({ user: db.getUser(), isAuthenticated: true, isMock: true });
            handleNavigate('dashboard');
          }}
        />
      )}

      {activeRoute === 'register' && (
        <RegisterPage
          onNavigate={handleNavigate}
          onRegisterSuccess={() => {
            setAuthSession({ user: db.getUser(), isAuthenticated: true, isMock: true });
            handleNavigate('onboarding');
          }}
        />
      )}

      {activeRoute === 'forgot-password' && (
        <ForgotPasswordPage onNavigate={handleNavigate} />
      )}

      {activeRoute === 'onboarding' && (
        <OnboardingWizard
          onComplete={() => handleNavigate('dashboard')}
          onNavigate={handleNavigate}
        />
      )}

      {activeRoute === 'privacy' && (
        <PrivacyPolicyPage onNavigate={handleNavigate} />
      )}

      {activeRoute === 'terms' && (
        <TermsPage onNavigate={handleNavigate} />
      )}

      {/* Main Console & Dashboard Layout (With Header & Sidebar) */}
      {!isStandalonePage && (
        <div className="flex-1 flex flex-col lg:pl-64">
          <Sidebar
            activeRoute={activeRoute}
            onNavigate={handleNavigate}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            unreadAlertsCount={unreadAlertsCount}
          />

          <Header
            onMenuClick={() => setSidebarOpen(true)}
            onOpenSimulator={() => setSimulatorOpen(true)}
            onNavigate={handleNavigate}
            activeRoute={activeRoute}
            selectedApiaryId={selectedApiaryId}
            onSelectApiary={setSelectedApiaryId}
            unreadAlertsCount={unreadAlertsCount}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {activeRoute === 'dashboard' && (
              <DashboardPage
                onNavigate={handleNavigate}
                onOpenSimulator={() => setSimulatorOpen(true)}
                selectedApiaryId={selectedApiaryId}
              />
            )}

            {activeRoute === 'live-monitoring' && (
              <LiveMonitoringPage
                onNavigate={handleNavigate}
                onOpenSimulator={() => setSimulatorOpen(true)}
                selectedApiaryId={selectedApiaryId}
              />
            )}

            {activeRoute === 'hives' && (
              <ApiariesAndHivesPage
                onNavigate={handleNavigate}
                selectedApiaryId={selectedApiaryId}
              />
            )}

            {activeRoute === 'hive-detail' && (
              <HiveDetailPage
                hiveId={selectedHiveId}
                onNavigate={handleNavigate}
                onOpenSimulator={() => setSimulatorOpen(true)}
              />
            )}

            {activeRoute === 'ai-risk' && (
              <AiRiskAnalysisPage
                onNavigate={handleNavigate}
                selectedApiaryId={selectedApiaryId}
              />
            )}

            {activeRoute === 'parasite-inspection' && (
              <ParasiteMonitoringPage
                onNavigate={handleNavigate}
                selectedApiaryId={selectedApiaryId}
              />
            )}

            {activeRoute === 'notifications' && (
              <NotificationsPage onNavigate={handleNavigate} />
            )}

            {activeRoute === 'reports' && (
              <ReportsAnalyticsPage
                onNavigate={handleNavigate}
                selectedApiaryId={selectedApiaryId}
              />
            )}

            {activeRoute === 'subscription' && (
              <SubscriptionPage
                onNavigate={handleNavigate}
                onPlanChanged={() => {
                  addToast({
                    id: `toast_${Date.now()}`,
                    type: 'success',
                    title: 'Subscription Activated',
                    message: 'Your apiary plan has been updated successfully.'
                  });
                }}
              />
            )}

            {activeRoute === 'billing' && (
              <BillingHistoryPage onNavigate={handleNavigate} />
            )}

            {activeRoute === 'settings' && (
              <SettingsPage
                onNavigate={handleNavigate}
                onLogout={handleLogout}
              />
            )}

            {activeRoute === 'help-docs' && (
              <HelpDocsPage
                onNavigate={handleNavigate}
                onOpenSimulator={() => setSimulatorOpen(true)}
              />
            )}
          </main>
        </div>
      )}

      {/* Interactive IoT Hardware Simulation Modal */}
      <HardwareSimulationModal
        isOpen={simulatorOpen}
        onClose={() => setSimulatorOpen(false)}
        onNotificationTriggered={(msg, isSMS) => {
          addToast({
            id: `toast_${Date.now()}`,
            type: isSMS ? 'sms' : 'warning',
            title: isSMS ? 'SMS ALERT DISPATCHED' : 'SIMULATION ALERT',
            message: msg
          });
        }}
      />

      {/* Floating Realtime Toast Notification Stack */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}

export default App;
