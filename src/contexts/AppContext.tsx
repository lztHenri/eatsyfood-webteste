import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { User, Product, Order, CartItem, OrderStats } from '../types';
import { mockProducts, mockOrders } from '../data/mockData';

interface AppState {
  currentUser: User | null;
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  isLoading: boolean;
  notifications: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number; notes?: string } }
  | { type: 'UPDATE_CART_ITEM'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: Order['status'] } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: { message: string; type: 'success' | 'error' | 'info' } }
  | { type: 'REMOVE_NOTIFICATION'; payload: string };

const initialState: AppState = {
  currentUser: null,
  products: mockProducts,
  orders: mockOrders,
  cart: [],
  isLoading: false,
  notifications: []
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => 
          p.id === action.payload.id ? action.payload : p
        )
      };
    
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload)
      };
    
    case 'ADD_TO_CART':
      const existingItemIndex = state.cart.findIndex(
        item => item.product.id === action.payload.product.id
      );
      
      if (existingItemIndex >= 0) {
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex].quantity += action.payload.quantity;
        return { ...state, cart: updatedCart };
      }
      
      return {
        ...state,
        cart: [...state.cart, {
          product: action.payload.product,
          quantity: action.payload.quantity,
          notes: action.payload.notes
        }]
      };
    
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.product.id !== action.payload)
      };
    
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    
    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] };
    
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status, updatedAt: new Date() }
            : order
        )
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'ADD_NOTIFICATION':
      const notificationId = Math.random().toString(36).substr(2, 9);
      return {
        ...state,
        notifications: [...state.notifications, { 
          id: notificationId, 
          ...action.payload 
        }]
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addToCart: (product: Product, quantity: number, notes?: string) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: (orderData: Partial<Order>) => Promise<string>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrderStats: () => OrderStats;
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
} | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    state.notifications.forEach(notification => {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id });
      }, 5000);
    });
  }, [state.notifications]);

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock users for demo
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Cliente Teste',
        email: 'cliente@eatsy.com',
        role: 'customer',
        createdAt: new Date()
      },
      {
        id: '2',
        name: 'Cozinha',
        email: 'cozinha@eatsy.com',
        role: 'kitchen',
        createdAt: new Date()
      },
      {
        id: '3',
        name: 'Administrador',
        email: 'admin@eatsy.com',
        role: 'admin',
        createdAt: new Date()
      }
    ];

    const user = mockUsers.find(u => u.email === email);
    
    if (user && password === '123456') {
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_LOADING', payload: false });
      showNotification(`Bem-vindo, ${user.name}!`, 'success');
      return true;
    }
    
    dispatch({ type: 'SET_LOADING', payload: false });
    showNotification('Credenciais inválidas', 'error');
    return false;
  };

  const logout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'CLEAR_CART' });
    showNotification('Logout realizado com sucesso', 'info');
  };

  const addToCart = (product: Product, quantity: number, notes?: string) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity, notes } });
    showNotification(`${product.name} adicionado ao carrinho`, 'success');
  };

  const updateCartItem = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    dispatch({ type: 'UPDATE_CART_ITEM', payload: { productId, quantity } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    showNotification('Item removido do carrinho', 'info');
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const placeOrder = async (orderData: Partial<Order>): Promise<string> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const orderId = Math.random().toString(36).substr(2, 9);
    const newOrder: Order = {
      id: orderId,
      customerId: state.currentUser?.id || 'guest',
      customerName: state.currentUser?.name || 'Cliente',
      customerEmail: state.currentUser?.email || 'guest@email.com',
      items: [...state.cart],
      total: state.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      status: 'pending',
      paymentStatus: 'completed',
      paymentMethod: orderData.paymentMethod || 'card',
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: orderData.notes,
      ...orderData
    };
    
    dispatch({ type: 'ADD_ORDER', payload: newOrder });
    dispatch({ type: 'CLEAR_CART' });
    dispatch({ type: 'SET_LOADING', payload: false });
    showNotification('Pedido realizado com sucesso!', 'success');
    
    return orderId;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } });
    showNotification(`Status do pedido atualizado para: ${status}`, 'info');
  };

  const getOrderStats = (): OrderStats => {
    const orders = state.orders;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const ordersByStatus = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<Order['status'], number>);

    // Mock revenue by day data
    const revenueByDay = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: date.toISOString().split('T')[0],
        revenue: Math.random() * 1000 + 500
      };
    }).reverse();

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      ordersByStatus,
      revenueByDay
    };
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: { message, type } });
  };

  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      login,
      logout,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      placeOrder,
      updateOrderStatus,
      getOrderStats,
      showNotification
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}