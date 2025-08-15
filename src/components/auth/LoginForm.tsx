import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Mail, Lock, ChefHat } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

export default function LoginForm() {
  const { login, state } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  const quickLogin = (userType: 'customer' | 'kitchen' | 'admin') => {
    const credentials = {
      customer: { email: 'cliente@eatsy.com', password: '123456' },
      kitchen: { email: 'cozinha@eatsy.com', password: '123456' },
      admin: { email: 'admin@eatsy.com', password: '123456' }
    };
    
    const cred = credentials[userType];
    setEmail(cred.email);
    setPassword(cred.password);
    login(cred.email, cred.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-600 p-3 rounded-full">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Eatsy Code</h2>
          <p className="mt-2 text-gray-600">Sistema de Pedidos Online</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="seu@email.com"
                />
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="••••••••"
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={state.isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {state.isLoading ? <LoadingSpinner size="small" /> : 'Entrar'}
            </button>
          </form>

          <div className="space-y-3">
            <div className="text-center">
              <button
                onClick={() => setShowCredentials(!showCredentials)}
                className="text-sm text-green-600 hover:text-green-500"
              >
                {showCredentials ? 'Ocultar' : 'Ver'} credenciais de teste
              </button>
            </div>

            {showCredentials && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <p className="text-sm text-gray-600 text-center">Clique para fazer login automático:</p>
                
                <div className="grid gap-2">
                  <button
                    onClick={() => quickLogin('customer')}
                    className="w-full px-3 py-2 text-sm bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
                  >
                    Cliente (cliente@eatsy.com)
                  </button>
                  
                  <button
                    onClick={() => quickLogin('kitchen')}
                    className="w-full px-3 py-2 text-sm bg-orange-100 text-orange-800 rounded-md hover:bg-orange-200 transition-colors"
                  >
                    Cozinha (cozinha@eatsy.com)
                  </button>
                  
                  <button
                    onClick={() => quickLogin('admin')}
                    className="w-full px-3 py-2 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
                  >
                    Admin (admin@eatsy.com)
                  </button>
                </div>
                
                <p className="text-xs text-gray-500 text-center">Senha para todos: 123456</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}