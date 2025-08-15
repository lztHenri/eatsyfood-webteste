import React, { useState } from 'react';
import Layout from '../common/Layout';
import ProductManagement from './ProductManagement';
import OrderAnalytics from './OrderAnalytics';
import { BarChart3, Package, Users, Settings } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'users' | 'settings'>('analytics');

  const tabs = [
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
    { id: 'products' as const, label: 'Produtos', icon: Package },
    { id: 'users' as const, label: 'Usuários', icon: Users },
    { id: 'settings' as const, label: 'Configurações', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <OrderAnalytics />;
      case 'products':
        return <ProductManagement />;
      case 'users':
        return <UserManagement />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <OrderAnalytics />;
    }
  };

  return (
    <Layout title="Painel Administrativo">
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm p-1 flex space-x-1 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-3 px-4 rounded-md font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="min-h-96">
          {renderTabContent()}
        </div>
      </div>
    </Layout>
  );
}

// User Management Component
function UserManagement() {
  const mockUsers = [
    { id: '1', name: 'João Silva', email: 'joao@email.com', role: 'customer', lastLogin: new Date() },
    { id: '2', name: 'Maria Santos', email: 'maria@email.com', role: 'customer', lastLogin: new Date() },
    { id: '3', name: 'Chef Carlos', email: 'carlos@eatsy.com', role: 'kitchen', lastLogin: new Date() }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Usuários do Sistema</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Função
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Login
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockUsers.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-800'
                        : user.role === 'kitchen'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role === 'admin' ? 'Administrador' : user.role === 'kitchen' ? 'Cozinha' : 'Cliente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {user.lastLogin.toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// System Settings Component
function SystemSettings() {
  const [settings, setSettings] = useState({
    restaurantName: 'Eatsy Code',
    deliveryFee: 5.90,
    minOrderValue: 20.00,
    workingHours: {
      open: '18:00',
      close: '23:00'
    }
  });

  const handleSave = () => {
    // In a real app, this would save to the backend
    alert('Configurações salvas com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Configurações do Restaurante</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Restaurante
            </label>
            <input
              type="text"
              value={settings.restaurantName}
              onChange={(e) => setSettings({...settings, restaurantName: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Taxa de Entrega (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.deliveryFee}
              onChange={(e) => setSettings({...settings, deliveryFee: parseFloat(e.target.value)})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pedido Mínimo (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.minOrderValue}
              onChange={(e) => setSettings({...settings, minOrderValue: parseFloat(e.target.value)})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horário de Funcionamento
            </label>
            <div className="flex space-x-2">
              <input
                type="time"
                value={settings.workingHours.open}
                onChange={(e) => setSettings({
                  ...settings, 
                  workingHours: {...settings.workingHours, open: e.target.value}
                })}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <span className="self-center">às</span>
              <input
                type="time"
                value={settings.workingHours.close}
                onChange={(e) => setSettings({
                  ...settings, 
                  workingHours: {...settings.workingHours, close: e.target.value}
                })}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSave}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
}