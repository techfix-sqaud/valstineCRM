
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, Banknote, Smartphone } from "lucide-react";
import { CartItem, Customer } from "@/pages/POS";

interface POSPaymentProps {
  cart: CartItem[];
  customer: Customer | null;
  onBack: () => void;
  onPayment: (paymentMethod: string) => void;
  totals: {
    subtotal: number;
    tax: number;
    total: number;
  };
}

export const POSPayment = ({ cart, customer, onBack, onPayment, totals }: POSPaymentProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string>("card");
  const [cashReceived, setCashReceived] = useState<string>("");
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      onPayment(selectedMethod);
      setProcessing(false);
    }, 2000);
  };

  const cashReceivedAmount = parseFloat(cashReceived) || 0;
  const change = cashReceivedAmount - totals.total;

  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: CreditCard },
    { id: "cash", name: "Cash", icon: Banknote },
    { id: "mobile", name: "Mobile Payment", icon: Smartphone },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>
        <h1 className="text-2xl font-bold">Payment</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {customer && (
              <div className="p-3 bg-muted rounded-md">
                <p className="font-medium text-sm">Customer: {customer.name}</p>
                <p className="text-xs text-muted-foreground">{customer.email}</p>
              </div>
            )}

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${item.total.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <Separator />
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax:</span>
                <span>${totals.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${totals.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {paymentMethods.map(method => {
                const Icon = method.icon;
                return (
                  <div
                    key={method.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{method.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedMethod === "cash" && (
              <div className="space-y-3 pt-4 border-t">
                <div>
                  <Label htmlFor="cashReceived">Cash Received</Label>
                  <Input
                    id="cashReceived"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                  />
                </div>
                {cashReceivedAmount > 0 && (
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span>Total Due:</span>
                      <span>${totals.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cash Received:</span>
                      <span>${cashReceivedAmount.toFixed(2)}</span>
                    </div>
                    <div className={`flex justify-between font-bold ${
                      change >= 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      <span>Change:</span>
                      <span>${Math.max(0, change).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button
              className="w-full"
              size="lg"
              onClick={handlePayment}
              disabled={
                processing ||
                (selectedMethod === "cash" && (cashReceivedAmount < totals.total))
              }
            >
              {processing ? "Processing..." : "Complete Payment"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
