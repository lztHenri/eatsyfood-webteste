import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export default function Notifications() {
  const { state, dispatch } = useApp();
  const { notifications } = state;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-800';
      case 'error': return 'text-red-800';
      default: return 'text-blue-800';
    }
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center p-4 rounded-lg border shadow-lg max-w-md animate-in slide-in-from-right duration-300 ${getBgColor(notification.type)}`}
        >
          <div className="flex-shrink-0">
            {getIcon(notification.type)}
          </div>
          <div className={`ml-3 flex-1 ${getTextColor(notification.type)}`}>
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className={`ml-4 flex-shrink-0 rounded-md p-1 hover:bg-opacity-20 hover:bg-gray-600 ${getTextColor(notification.type)}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}