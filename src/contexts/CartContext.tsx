import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  pastryId: string;
  businessId: string; // Added for marketplace functionality
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
  updateNotes: (id: string, notes: string) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  getBusinessIds: () => string[]; // Get unique business IDs in cart
  getItemsByBusiness: (businessId: string) => CartItem[]; // Get items from specific business
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
    const savedCart = localStorage.getItem('xuxu-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Validate cart items have required fields
        const validItems = parsedCart.filter((item: any) => 
          item.id && item.pastryId && item.businessId && item.name && item.price
        );
        setItems(validItems);
      } catch (err) {
        console.error('Error parsing saved cart:', err);
        localStorage.removeItem('xuxu-cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('xuxu-cart', JSON.stringify(items));
    
    // Also save timestamp for abandoned cart notifications
    localStorage.setItem('xuxu-cart-timestamp', new Date().toISOString());
  }, [items]);

  // Calculate item count and total
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Add an item to the cart
  const addItem = (item: Omit<CartItem, 'id'>) => {
    setError(null);
    
    setItems(prevItems => {
      // Check if item already exists in cart
      const existingItem = prevItems.find(i => 
        i.pastryId === item.pastryId && i.businessId === item.businessId
      );
      
      if (existingItem) {
        // Update quantity if item exists
        return prevItems.map(i =>
          i.pastryId === item.pastryId && i.businessId === item.businessId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        // Add new item with unique ID
        const newItem: CartItem = {
          ...item,
          id: `${item.pastryId}-${Date.now()}`
        };
        return [...prevItems, newItem];
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

  // Update notes for an item
  const updateNotes = (id: string, notes: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, notes } : item
      )
    );
  };

  // Clear all items from the cart
  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('xuxu-cart');
    localStorage.removeItem('xuxu-cart-timestamp');
  };

  // Get unique business IDs in cart (for marketplace functionality)
  const getBusinessIds = (): string[] => {
    const businessIds = items.map(item => item.businessId);
    return [...new Set(businessIds)];
  };

  // Get items from specific business
  const getItemsByBusiness = (businessId: string): CartItem[] => {
    return items.filter(item => item.businessId === businessId);
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
    updateNotes,
    clearCart,
    isOpen,
    setIsOpen,
    getBusinessIds,
    getItemsByBusiness,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};