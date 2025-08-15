import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Trash2, Plus, Minus, CreditCard, Smartphone } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

export default function Cart() {
  const { state, updateCartItem, removeFromCart, clearCart, placeOrder } = useApp();
  const { cart, isLoading } = state;
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');
  const [customerNotes, setCustomerNotes] = useState('');

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    try {
      await placeOrder({
        paymentMethod,
        notes: customerNotes
      });
      setShowCheckout(false);
      setCustomerNotes('');
    } catch (error) {
      console.error('Erro ao processar pedido:', error);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="text-gray-400 mb-4">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 rounded-full"></div>
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Seu carrinho está vazio</h3>
        <p className="text-gray-600">Adicione alguns produtos deliciosos para começar!</p>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Finalizar Pedido</h2>
          <button
            onClick={() => setShowCheckout(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Voltar
          </button>
        </div>

        {/* Order Summary */}
        <div className="border-b pb-4">
          <h3 className="font-medium mb-2">Resumo do Pedido</h3>
          {cart.map(item => (
            <div key={item.product.id} className="flex justify-between text-sm py-1">
              <span>{item.quantity}x {item.product.name}</span>
              <span>{formatPrice(item.product.price * item.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold text-lg mt-2 pt-2 border-t">
            <span>Total:</span>
            <span className="text-green-600">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h3 className="font-medium mb-3">Método de Pagamento</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`flex items-center justify-center space-x-2 p-4 border-2 rounded-lg transition-colors ${
                paymentMethod === 'card'
                  ? 'border-green-600 bg-green-50 text-green-600'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span>Cartão</span>
            </button>
            
            <button
              onClick={() => setPaymentMethod('pix')}
              className={`flex items-center justify-center space-x-2 p-4 border-2 rounded-lg transition-colors ${
                paymentMethod === 'pix'
                  ? 'border-green-600 bg-green-50 text-green-600'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Smartphone className="w-5 h-5" />
              <span>PIX</span>
            </button>
          </div>
        </div>

        {/* Customer Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Observações (opcional)
          </label>
          <textarea
            id="notes"
            value={customerNotes}
            onChange={(e) => setCustomerNotes(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Alguma observação especial sobre seu pedido?"
          />
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="small" className="mr-2" />
              Processando Pagamento...
            </>
          ) : (
            `Pagar ${formatPrice(total)}`
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Seu Carrinho</h2>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 text-sm"
        >
          Limpar Carrinho
        </button>
      </div>

      <div className="space-y-4">
        {cart.map(item => (
          <div key={item.product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-16 h-16 object-cover rounded-md"
            />
            
            <div className="flex-1">
              <h4 className="font-medium">{item.product.name}</h4>
              <p className="text-sm text-gray-600">{formatPrice(item.product.price)}</p>
              {item.notes && (
                <p className="text-xs text-orange-600 mt-1">Obs: {item.notes}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateCartItem(item.product.id, item.quantity - 1)}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              
              <button
                onClick={() => updateCartItem(item.product.id, item.quantity + 1)}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-right">
              <div className="font-semibold">
                {formatPrice(item.product.price * item.quantity)}
              </div>
              <button
                onClick={() => removeFromCart(item.product.id)}
                className="text-red-600 hover:text-red-700 mt-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center text-xl font-bold mb-4">
          <span>Total:</span>
          <span className="text-green-600">{formatPrice(total)}</span>
        </div>
        
        <button
          onClick={() => setShowCheckout(true)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          Finalizar Pedido
        </button>
      </div>
    </div>
  );
}