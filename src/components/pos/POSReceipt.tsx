
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Receipt, Printer, Mail, Plus } from "lucide-react";
import { Transaction } from "@/pages/POS";
import { useToast } from "@/hooks/use-toast";

interface POSReceiptProps {
  transaction: Transaction;
  onNewSale: () => void;
}

export const POSReceipt = ({ transaction, onNewSale }: POSReceiptProps) => {
  const { toast } = useToast();

  const handlePrint = () => {
    window.print();
    toast({
      title: "Receipt printed",
      description: "Receipt has been sent to printer",
    });
  };

  const handleEmail = () => {
    toast({
      title: "Receipt emailed",
      description: "Receipt has been sent to customer's email",
    });
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <Receipt className="h-12 w-12 mx-auto mb-4 text-green-600" />
        <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
        <p className="text-muted-foreground">Transaction completed</p>
      </div>

      <Card className="print:shadow-none">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-lg">RECEIPT</CardTitle>
          <div className="text-sm text-muted-foreground">
            <p>Transaction ID: {transaction.id}</p>
            <p>{transaction.timestamp.toLocaleString()}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {transaction.customer && (
            <div className="text-sm">
              <p className="font-medium">Customer:</p>
              <p>{transaction.customer.name}</p>
              <p>{transaction.customer.email}</p>
            </div>
          )}

          <Separator />

          <div className="space-y-2">
            {transaction.items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-muted-foreground">
                    ${item.price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <p className="font-medium">${item.total.toFixed(2)}</p>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${transaction.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>${transaction.tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-base">
              <span>Total:</span>
              <span>${transaction.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Payment Method:</span>
              <span className="capitalize">{transaction.paymentMethod}</span>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground pt-4">
            <p>Thank you for your business!</p>
            <p>Have a great day!</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 print:hidden">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handlePrint}
        >
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        {transaction.customer && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleEmail}
          >
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
        )}
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={onNewSale}
      >
        <Plus className="h-4 w-4 mr-2" />
        New Sale
      </Button>
    </div>
  );
};
