
import { useState, useEffect } from "react";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, Trash2, Plus, Minus, User, Receipt, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { POSCart } from "@/components/pos/POSCart";
import { POSProducts } from "@/components/pos/POSProducts";
import { POSCustomerSelect } from "@/components/pos/POSCustomerSelect";
import { POSPayment } from "@/components/pos/POSPayment";
import { POSReceipt } from "@/components/pos/POSReceipt";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  barcode?: string;
  image?: string;
}

export interface CartItem extends Product {
  quantity: number;
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  customer?: Customer;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  timestamp: Date;
}

const POS = () => {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [currentView, setCurrentView] = useState<'products' | 'payment' | 'receipt'>('products');
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * item.price }
            : item
        );
      }
      
      return [...prevCart, { ...product, quantity, total: quantity * product.price }];
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} added to cart`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity, total: quantity * item.price }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
  };

  const getCartTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const processPayment = (paymentMethod: string) => {
    const { subtotal, tax, total } = getCartTotal();
    
    const transaction: Transaction = {
      id: `TXN-${Date.now()}`,
      items: [...cart],
      customer: selectedCustomer || undefined,
      subtotal,
      tax,
      total,
      paymentMethod,
      timestamp: new Date(),
    };
    
    setLastTransaction(transaction);
    setCurrentView('receipt');
    clearCart();
    
    toast({
      title: "Payment processed",
      description: `Transaction completed successfully`,
    });
  };

  const startNewSale = () => {
    setCurrentView('products');
    setLastTransaction(null);
  };

  if (currentView === 'receipt' && lastTransaction) {
    return (
      <Layout>
        <POSReceipt 
          transaction={lastTransaction} 
          onNewSale={startNewSale}
        />
      </Layout>
    );
  }

  if (currentView === 'payment') {
    return (
      <Layout>
        <POSPayment
          cart={cart}
          customer={selectedCustomer}
          onBack={() => setCurrentView('products')}
          onPayment={processPayment}
          totals={getCartTotal()}
        />
      </Layout>
    );
  }

  return (
    <Layout
      header={
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Point of Sale</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products or scan barcode..."
                className="pl-9 w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Badge variant="outline" className="text-sm">
              {cart.length} items
            </Badge>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Products Section */}
        <div className="lg:col-span-2">
          <POSProducts 
            searchTerm={searchTerm}
            onAddToCart={addToCart}
          />
        </div>

        {/* Cart Section */}
        <div className="space-y-4">
          <POSCustomerSelect
            selectedCustomer={selectedCustomer}
            onCustomerSelect={setSelectedCustomer}
          />
          
          <POSCart
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onClearCart={clearCart}
            onCheckout={() => setCurrentView('payment')}
            totals={getCartTotal()}
          />
        </div>
      </div>
    </Layout>
  );
};

export default POS;
