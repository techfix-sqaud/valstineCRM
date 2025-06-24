
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
};

type Invoice = {
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

interface InvoiceEditProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onSave: (invoice: Invoice) => void;
}

export const InvoiceEdit = ({ isOpen, onClose, invoice, onSave }: InvoiceEditProps) => {
  const { toast } = useToast();
  const [editedInvoice, setEditedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (invoice) {
      setEditedInvoice({ ...invoice });
    }
  }, [invoice]);

  if (!editedInvoice) return null;

  const handleInputChange = (field: keyof Invoice, value: any) => {
    setEditedInvoice(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    if (!editedInvoice) return;
    
    const updatedItems = [...editedInvoice.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Recalculate amount for the item
    if (field === 'quantity' || field === 'rate') {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate;
    }
    
    // Recalculate totals
    const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    setEditedInvoice({
      ...editedInvoice,
      items: updatedItems,
      subtotal,
      tax,
      total,
      amount: `$${total.toFixed(2)}`
    });
  };

  const addNewItem = () => {
    if (!editedInvoice) return;
    
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0
    };
    
    setEditedInvoice({
      ...editedInvoice,
      items: [...editedInvoice.items, newItem]
    });
  };

  const removeItem = (index: number) => {
    if (!editedInvoice) return;
    
    const updatedItems = editedInvoice.items.filter((_, i) => i !== index);
    const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    setEditedInvoice({
      ...editedInvoice,
      items: updatedItems,
      subtotal,
      tax,
      total,
      amount: `$${total.toFixed(2)}`
    });
  };

  const handleSave = () => {
    if (!editedInvoice) return;
    
    if (!editedInvoice.client || editedInvoice.items.length === 0) {
      toast({
        title: "Error",
        description: "Client and at least one item are required",
        variant: "destructive",
      });
      return;
    }

    onSave(editedInvoice);
    onClose();
    
    toast({
      title: "Invoice updated",
      description: `Invoice ${editedInvoice.id} has been updated successfully`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Invoice - {editedInvoice.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client">Client</Label>
              <Select
                value={editedInvoice.client}
                onValueChange={(value) => handleInputChange('client', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tech Solutions Inc.">Tech Solutions Inc.</SelectItem>
                  <SelectItem value="Digital Marketing Co.">Digital Marketing Co.</SelectItem>
                  <SelectItem value="Retail Innovations">Retail Innovations</SelectItem>
                  <SelectItem value="Finance Partners">Finance Partners</SelectItem>
                  <SelectItem value="Global Services Ltd.">Global Services Ltd.</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={editedInvoice.status}
                onValueChange={(value: "paid" | "pending" | "overdue") => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                type="date"
                value={editedInvoice.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                type="date"
                value={editedInvoice.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="clientAddress">Client Address</Label>
            <Textarea
              value={editedInvoice.clientAddress}
              onChange={(e) => handleInputChange('clientAddress', e.target.value)}
              placeholder="Enter client address"
            />
          </div>

          {/* Items */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Items & Services</h3>
              <Button onClick={addNewItem} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>
            
            <div className="space-y-3">
              {editedInvoice.items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    <Label>Description</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      placeholder="Item description"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                      min="1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Rate</Label>
                    <Input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, 'rate', Number(e.target.value))}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Amount</Label>
                    <Input
                      value={`$${item.amount.toFixed(2)}`}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={editedInvoice.items.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2 bg-muted p-4 rounded">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${editedInvoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%):</span>
                <span>${editedInvoice.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>${editedInvoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              value={editedInvoice.notes || ""}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
