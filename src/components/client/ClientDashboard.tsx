import React, { useState } from 'react';
import Layout from '../common/Layout';
import Menu from './Menu';
import Cart from './Cart';
import { ShoppingBag, ShoppingCart } from 'lucide-react';

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState<'menu' | 'cart'>('menu');

  const tabs = [
    { id: 'menu' as const, label: 'Cardápio', icon: ShoppingBag },
    { id: 'cart' as const, label: 'Carrinho', icon: ShoppingCart }
  ];

  return (
    <Layout title="Cardápio Online">
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm p-1 flex space-x-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white shadow-sm'
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
          {activeTab === 'menu' && <Menu />}
          {activeTab === 'cart' && <Cart />}
        </div>
      </div>
    </Layout>
  );
}