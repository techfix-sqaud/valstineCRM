
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Printer, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
};

type InvoiceDetails = {
  id: string;
  client: string;
  clientAddress: string;
  amount: string;
  status: "paid" | "pending" | "overdue";
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  notes?: string;
  subtotal: number;
  tax: number;
  total: number;
};

interface InvoiceViewProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceDetails | null;
}

export const InvoiceView = ({ isOpen, onClose, invoice }: InvoiceViewProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  if (!invoice) return null;

  const handlePrintInvoice = () => {
    const printContent = document.getElementById('invoice-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Invoice ${invoice.id}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .invoice-header { text-align: center; margin-bottom: 30px; }
                .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
                .invoice-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                .invoice-table th, .invoice-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .invoice-table th { background-color: #f2f2f2; }
                .totals { text-align: right; }
                .status { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
                .paid { background-color: #d4edda; color: #155724; }
                .pending { background-color: #fff3cd; color: #856404; }
                .overdue { background-color: #f8d7da; color: #721c24; }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    
    // Simulate PDF generation
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "PDF Generated",
        description: `Invoice ${invoice.id} has been generated as PDF`,
      });
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Invoice Details - {invoice.id}</span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrintInvoice}
              >
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleGeneratePDF}
                disabled={isGenerating}
              >
                <Download className="h-4 w-4 mr-1" />
                {isGenerating ? "Generating..." : "Download PDF"}
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div id="invoice-content" className="space-y-6">
          {/* Invoice Header */}
          <div className="text-center border-b pb-6">
            <h1 className="text-3xl font-bold text-primary">INVOICE</h1>
            <p className="text-muted-foreground mt-2">Your Company Name</p>
            <p className="text-sm text-muted-foreground">
              123 Business Street, City, State 12345<br />
              Phone: (555) 123-4567 | Email: contact@company.com
            </p>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Bill To:</h3>
              <div className="text-sm">
                <p className="font-medium">{invoice.client}</p>
                <p className="text-muted-foreground">{invoice.clientAddress}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Invoice #:</span>
                <span>{invoice.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>{invoice.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Due Date:</span>
                <span>{invoice.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <Badge
                  variant="outline"
                  className={
                    invoice.status === "paid"
                      ? "border-green-500 bg-green-50 text-green-600"
                      : invoice.status === "pending"
                      ? "border-amber-500 bg-amber-50 text-amber-600"
                      : "border-red-500 bg-red-50 text-red-600"
                  }
                >
                  {invoice.status}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Invoice Items */}
          <div>
            <h3 className="font-semibold mb-4">Items & Services</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-medium">Description</th>
                    <th className="text-center p-3 font-medium">Qty</th>
                    <th className="text-right p-3 font-medium">Rate</th>
                    <th className="text-right p-3 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-3">{item.description}</td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-right">${item.rate.toFixed(2)}</td>
                      <td className="p-3 text-right">${item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%):</span>
                <span>${invoice.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div>
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                {invoice.notes}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground border-t pt-4">
            <p>Thank you for your business!</p>
            <p>Payment is due within 30 days of invoice date.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
