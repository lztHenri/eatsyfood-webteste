import React, { useState } from 'react';
import Layout from '../common/Layout';
import { useApp } from '../../contexts/AppContext';
import { Clock, CheckCircle, Package, Truck } from 'lucide-react';
import { Order } from '../../types';

export default function KitchenDashboard() {
  const { state, updateOrderStatus } = useApp();
  const { orders } = state;
  const [selectedStatus, setSelectedStatus] = useState<Order['status'] | 'all'>('all');

  const statusConfig = {
    pending: { label: 'Pendente', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    preparing: { label: 'Em Preparo', icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    ready: { label: 'Pronto', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    delivered: { label: 'Entregue', icon: Truck, color: 'text-gray-600', bg: 'bg-gray-100' }
  };

  // Filter orders by status
  const filteredOrders = selectedStatus === 'all' 
    ? orders.filter(o => o.status !== 'cancelled')
    : orders.filter(o => o.status === selectedStatus);

  // Sort orders by creation date (newest first)
  const sortedOrders = filteredOrders.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    const statusFlow = {
      pending: 'preparing' as const,
      preparing: 'ready' as const,
      ready: 'delivered' as const,
      delivered: null
    };
    return statusFlow[currentStatus] || null;
  };

  const getNextStatusLabel = (currentStatus: Order['status']): string => {
    const nextStatus = getNextStatus(currentStatus);
    if (!nextStatus) return '';
    return statusConfig[nextStatus]?.label || '';
  };

  return (
    <Layout title="Painel da Cozinha">
      <div className="space-y-6">
        {/* Status Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Todos ({orders.filter(o => o.status !== 'cancelled').length})
            </button>
            
            {Object.entries(statusConfig).map(([status, config]) => {
              const Icon = config.icon;
              const count = orders.filter(o => o.status === status).length;
              
              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status as Order['status'])}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedStatus === status
                      ? `${config.bg} ${config.color}`
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{config.label} ({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedOrders.map(order => {
            const config = statusConfig[order.status];
            const Icon = config.icon;
            const nextStatus = getNextStatus(order.status);
            const nextStatusLabel = getNextStatusLabel(order.status);

            return (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md border-l-4 border-l-green-500 p-6 space-y-4"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">#{order.id.slice(-6)}</h3>
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                  </div>
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.color}`}>
                    <Icon className="w-4 h-4" />
                    <span>{config.label}</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-1">
                      <span className="text-sm">
                        {item.quantity}x {item.product.name}
                      </span>
                      <span className="text-sm font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Notes */}
                {order.notes && (
                  <div className="bg-yellow-50 p-3 rounded-md">
                    <p className="text-sm text-yellow-800">
                      <strong>Obs:</strong> {order.notes}
                    </p>
                  </div>
                )}

                {/* Item Notes */}
                {order.items.some(item => item.notes) && (
                  <div className="bg-orange-50 p-3 rounded-md space-y-1">
                    {order.items
                      .filter(item => item.notes)
                      .map((item, index) => (
                        <p key={index} className="text-sm text-orange-800">
                          <strong>{item.product.name}:</strong> {item.notes}
                        </p>
                      ))}
                  </div>
                )}

                {/* Order Footer */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div>
                    <p className="text-sm text-gray-600">
                      Pedido às {formatTime(order.createdAt)}
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      Total: {formatPrice(order.total)}
                    </p>
                  </div>

                  {nextStatus && (
                    <button
                      onClick={() => updateOrderStatus(order.id, nextStatus)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      {nextStatusLabel}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {sortedOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
            <p className="text-gray-600">
              {selectedStatus === 'all' 
                ? 'Não há pedidos no momento.'
                : `Não há pedidos com status "${statusConfig[selectedStatus as keyof typeof statusConfig]?.label}".`
              }
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}