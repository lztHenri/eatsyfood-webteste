import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { LogOut, User, ShoppingCart, ChefHat, Settings } from 'lucide-react';
import Notifications from './Notifications';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const { state, logout } = useApp();
  const { currentUser, cart } = state;

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-600';
      case 'kitchen': return 'text-blue-600';
      default: return 'text-green-600';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Settings className="w-4 h-4" />;
      case 'kitchen': return <ChefHat className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <ChefHat className="w-8 h-8 text-green-600 mr-2" />
                <h1 className="text-xl font-bold text-gray-900">
                  Eatsy Code
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {currentUser?.role === 'customer' && (
                <div className="relative">
                  <ShoppingCart className="w-6 h-6 text-gray-600" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </div>
              )}

              {currentUser && (
                <>
                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center space-x-1 ${getRoleColor(currentUser.role)}`}>
                      {getRoleIcon(currentUser.role)}
                      <span className="text-sm font-medium">{currentUser.name}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        {children}
      </main>

      <Notifications />
    </div>
  );
}