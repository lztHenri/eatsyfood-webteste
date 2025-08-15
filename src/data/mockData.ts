import { Product, Order } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Hambúrguer Clássico',
    description: 'Pão brioche, carne 180g, queijo, alface, tomate, cebola roxa e molho especial',
    price: 28.90,
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Hambúrgueres',
    available: true,
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'Hambúrguer BBQ',
    description: 'Pão brioche, carne 180g, bacon, queijo cheddar, cebola caramelizada e molho BBQ',
    price: 32.90,
    image: 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Hambúrgueres',
    available: true,
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'Pizza Margherita',
    description: 'Molho de tomate, mussarela, manjericão fresco e azeite extravirgem',
    price: 45.90,
    image: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Pizzas',
    available: true,
    createdAt: new Date()
  },
  {
    id: '4',
    name: 'Pizza Pepperoni',
    description: 'Molho de tomate, mussarela e fatias generosas de pepperoni',
    price: 48.90,
    image: 'https://images.pexels.com/photos/2619967/pexels-photo-2619967.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Pizzas',
    available: true,
    createdAt: new Date()
  },
  {
    id: '5',
    name: 'Salada Caesar',
    description: 'Alface romana, croutons, queijo parmesão, molho caesar e peito de frango grelhado',
    price: 24.90,
    image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Saladas',
    available: true,
    createdAt: new Date()
  },
  {
    id: '6',
    name: 'Refrigerante 350ml',
    description: 'Coca-Cola, Guaraná, Fanta ou Sprite',
    price: 5.90,
    image: 'https://images.pexels.com/photos/2775860/pexels-photo-2775860.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Bebidas',
    available: true,
    createdAt: new Date()
  },
  {
    id: '7',
    name: 'Suco Natural 400ml',
    description: 'Laranja, limão, acerola ou maracujá',
    price: 8.90,
    image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Bebidas',
    available: true,
    createdAt: new Date()
  },
  {
    id: '8',
    name: 'Brownie com Sorvete',
    description: 'Brownie de chocolate quente com sorvete de baunilha e calda de chocolate',
    price: 16.90,
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Sobremesas',
    available: true,
    createdAt: new Date()
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ord001',
    customerId: '1',
    customerName: 'João Silva',
    customerEmail: 'joao@email.com',
    items: [
      {
        product: mockProducts[0],
        quantity: 2,
        notes: 'Sem cebola, por favor'
      },
      {
        product: mockProducts[5],
        quantity: 2
      }
    ],
    total: 69.70,
    status: 'preparing',
    paymentStatus: 'completed',
    paymentMethod: 'card',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 15),
    notes: 'Entrega rápida, por favor'
  },
  {
    id: 'ord002',
    customerId: '2',
    customerName: 'Maria Santos',
    customerEmail: 'maria@email.com',
    items: [
      {
        product: mockProducts[2],
        quantity: 1
      },
      {
        product: mockProducts[6],
        quantity: 1
      }
    ],
    total: 54.80,
    status: 'ready',
    paymentStatus: 'completed',
    paymentMethod: 'pix',
    createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 10),
  },
  {
    id: 'ord003',
    customerId: '3',
    customerName: 'Pedro Oliveira',
    customerEmail: 'pedro@email.com',
    items: [
      {
        product: mockProducts[4],
        quantity: 1
      },
      {
        product: mockProducts[7],
        quantity: 1
      }
    ],
    total: 41.80,
    status: 'delivered',
    paymentStatus: 'completed',
    paymentMethod: 'card',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60),
  }
];