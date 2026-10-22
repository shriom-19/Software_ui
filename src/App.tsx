import React, { useState } from 'react';
import { ToastProvider, useToast } from './components/common/Toast';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { GlobalAIModal } from './components/common/GlobalAIModal';
import { VoterSlipModal } from './components/common/VoterSlipModal';
import { LogoutModal } from './components/common/LogoutModal';

// Views
import { LoginView } from './views/auth/LoginView';
import { RegisterView } from './views/auth/RegisterView';
import { ForgotPasswordView } from './views/auth/ForgotPasswordView';
import { WarRoomDashboardView } from './views/dashboard/WarRoomDashboardView';
import { TotalVotersView } from './views/voters/TotalVotersView';
import { CentralVoterProfileView } from './views/voters/CentralVoterProfileView';
import { PhoneBookView } from './views/voters/PhoneBookView';
import { FiltersView } from './views/filters/FiltersView';
import { UserDashboardView } from './views/users/UserDashboardView';
import { AllUsersView } from './views/users/AllUsersView';
import { AddUserView } from './views/users/AddUserView';
import { MembersKaryakartasView } from './views/users/MembersKaryakartasView';
import { UpdateRequestsView } from './views/users/UpdateRequestsView';
import { BloInformationView } from './views/blo/BloInformationView';
import { UserActivitiesView } from './views/audit/UserActivitiesView';
import { CampaignControlView } from './views/campaigns/CampaignControlView';
import { SubscriptionPlansView } from './views/subscription/SubscriptionPlansView';
import { ReportsView } from './views/reports/ReportsView';
import { PreviousElectionView } from './views/analytics/PreviousElectionView';
import { OfficeIssuesView } from './views/office/OfficeIssuesView';
import { LiveFieldMapView } from './views/map/LiveFieldMapView';
import { ProfilePartySettingsView } from './views/settings/ProfilePartySettingsView';

import { Voter, User } from './types';
import { MOCK_VOTERS, MOCK_USERS } from './data/mockData';

const MainApp: React.FC = () => {
  const { showToast } = useToast();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot-password'>('login');

  // Portal Navigation State
  const [activeView, setActiveView] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Global AI Modal State
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isAiLocked, setIsAiLocked] = useState(false);

  // Logout Modal State
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Active Voter for 360 Profile and Slip
  const [selectedVoter, setSelectedVoter] = useState<Voter | null>(MOCK_VOTERS[0]);
  const [voterForSlipModal, setVoterForSlipModal] = useState<Voter | null>(null);

  // Selected User for details
  const [selectedUser, setSelectedUser] = useState<User | null>(MOCK_USERS[0]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setActiveView('dashboard');
  };

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    setIsAuthenticated(false);
    setAuthView('login');
    showToast('Logged out successfully. Simulated session cleared.', 'info');
  };

  const handleSelectVoter = (voter: Voter) => {
    setSelectedVoter(voter);
    setActiveView('central-profile');
  };

  const handleOpenVoterSlip = (voter: Voter) => {
    setVoterForSlipModal(voter);
  };

  // If not authenticated, render Auth Screens
  if (!isAuthenticated) {
    if (authView === 'register') {
      return (
        <RegisterView
          onNavigateToLogin={() => setAuthView('login')}
          onRegistrationComplete={() => {
            setIsAuthenticated(true);
            setActiveView('dashboard');
          }}
        />
      );
    }
    if (authView === 'forgot-password') {
      return <ForgotPasswordView onNavigateToLogin={() => setAuthView('login')} />;
    }
    return (
      <LoginView
        onLoginSuccess={handleLoginSuccess}
        onNavigateToRegister={() => setAuthView('register')}
        onNavigateToForgotPassword={() => setAuthView('forgot-password')}
      />
    );
  }

  // Render Main Application Shell
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans antialiased text-slate-800">
      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onOpenLogout={() => setIsLogoutModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Persistent Top Header */}
        <Header
          activeView={activeView}
          setActiveView={setActiveView}
          onOpenAI={() => setIsAIModalOpen(true)}
          isAiLocked={isAiLocked}
          onOpenLogout={() => setIsLogoutModalOpen(true)}
        />

        {/* View Router Body */}
        <main className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
          <div className="max-w-7xl mx-auto">
            {activeView === 'dashboard' && (
              <WarRoomDashboardView onNavigateToView={setActiveView} />
            )}

            {activeView === 'voters' && (
              <TotalVotersView
                onSelectVoter={handleSelectVoter}
                onOpenVoterSlip={handleOpenVoterSlip}
              />
            )}

            {activeView === 'central-profile' && (
              <CentralVoterProfileView
                voter={selectedVoter}
                onBack={() => setActiveView('voters')}
                onOpenVoterSlip={handleOpenVoterSlip}
              />
            )}

            {activeView === 'phonebook' && (
              <PhoneBookView
                onSelectVoter={handleSelectVoter}
                onSelectUser={(u) => {
                  setSelectedUser(u);
                  setActiveView('users-all');
                }}
              />
            )}

            {activeView === 'filters' && <FiltersView />}

            {activeView === 'users-dashboard' && (
              <UserDashboardView onNavigateToView={setActiveView} />
            )}

            {activeView === 'users-all' && (
              <AllUsersView
                onNavigateToAddUser={() => setActiveView('users-add')}
                onSelectUser={(u) => {
                  setSelectedUser(u);
                  showToast(`Selected user: ${u.name} (${u.role})`, 'info');
                }}
              />
            )}

            {activeView === 'users-add' && (
              <AddUserView
                onBack={() => setActiveView('users-all')}
                onUserAdded={() => setActiveView('users-all')}
              />
            )}

            {activeView === 'users-members' && <MembersKaryakartasView />}

            {activeView === 'users-requests' && <UpdateRequestsView />}

            {activeView === 'blo' && <BloInformationView />}

            {activeView === 'audit' && <UserActivitiesView />}

            {activeView === 'campaigns' && <CampaignControlView />}

            {activeView === 'subscription' && <SubscriptionPlansView />}

            {activeView === 'reports' && <ReportsView />}

            {activeView === 'strategy' && <PreviousElectionView />}

            {activeView === 'office' && <OfficeIssuesView />}

            {activeView === 'map' && <LiveFieldMapView />}

            {activeView === 'settings' && <ProfilePartySettingsView />}
          </div>
        </main>
      </div>

      {/* Global AI Modal Drawer */}
      <GlobalAIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        isAiLocked={isAiLocked}
        setIsAiLocked={setIsAiLocked}
        onNavigateToView={(view) => {
          setIsAIModalOpen(false);
          setActiveView(view);
        }}
      />

      {/* Voter Information Slip Modal */}
      <VoterSlipModal
        voter={voterForSlipModal}
        onClose={() => setVoterForSlipModal(null)}
      />

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
