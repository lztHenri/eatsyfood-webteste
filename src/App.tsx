import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import LoginForm from './components/auth/LoginForm';
import ClientDashboard from './components/client/ClientDashboard';
import KitchenDashboard from './components/kitchen/KitchenDashboard';
import AdminDashboard from './components/admin/AdminDashboard';

function AppContent() {
  const { state } = useApp();
  const { currentUser } = state;

  // Show login form if no user is logged in
  if (!currentUser) {
    return <LoginForm />;
  }

  // Route based on user role
  switch (currentUser.role) {
    case 'customer':
      return <ClientDashboard />;
    case 'kitchen':
      return <KitchenDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <ClientDashboard />;
  }
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;