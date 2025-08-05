import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  pastryId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  loading: boolean;
  error: string | null;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('pastry-shop-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (err) {
        console.error('Error parsing saved cart:', err);
        localStorage.removeItem('pastry-shop-cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('pastry-shop-cart', JSON.stringify(items));
  }, [items]);

  // Calculate item count and total
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Add an item to the cart
  const addItem = (item: Omit<CartItem, 'id'>) => {
    setItems(prevItems => {
      // Check if item already exists in cart
      const existingItem = prevItems.find(i => i.pastryId === item.pastryId);
      
      if (existingItem) {
        // Update quantity if item exists
        return prevItems.map(i =>
          i.pastryId === item.pastryId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        // Add new item with unique ID
        return [...prevItems, { ...item, id: Date.now().toString() }];
      }
    });
  };

  // Remove an item from the cart
  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Update the quantity of an item
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Clear all items from the cart
  const clearCart = () => {
    setItems([]);
  };

  const value = {
    items,
    itemCount,
    total,
    loading,
    error,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isOpen,
    setIsOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};