
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Plus, Search } from "lucide-react";
import { Customer } from "@/pages/POS";

interface POSCustomerSelectProps {
  selectedCustomer: Customer | null;
  onCustomerSelect: (customer: Customer | null) => void;
}

const sampleCustomers: Customer[] = [
  { id: "1", name: "John Doe", email: "john@example.com", phone: "+1234567890" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", phone: "+1234567891" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", phone: "+1234567892" },
];

export const POSCustomerSelect = ({ selectedCustomer, onCustomerSelect }: POSCustomerSelectProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "" });

  const filteredCustomers = sampleCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.email) {
      const customer: Customer = {
        id: `cust_${Date.now()}`,
        ...newCustomer
      };
      onCustomerSelect(customer);
      setNewCustomer({ name: "", email: "", phone: "" });
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Customer</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(true)}
              >
                <Search className="h-3 w-3 mr-1" />
                Select
              </Button>
              {selectedCustomer && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCustomerSelect(null)}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
          
          {selectedCustomer ? (
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <User className="h-4 w-4" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{selectedCustomer.name}</p>
                <p className="text-xs text-muted-foreground truncate">{selectedCustomer.email}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm text-muted-foreground">Walk-in customer</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Customer</DialogTitle>
            <DialogDescription>
              Choose an existing customer or add a new one
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="max-h-40 overflow-y-auto space-y-2">
              {filteredCustomers.map(customer => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between p-2 border rounded-md hover:bg-muted cursor-pointer"
                  onClick={() => {
                    onCustomerSelect(customer);
                    setIsDialogOpen(false);
                  }}
                >
                  <div>
                    <p className="font-medium text-sm">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">{customer.email}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <Label className="text-sm font-medium mb-2 block">Add New Customer</Label>
              <div className="space-y-2">
                <Input
                  placeholder="Name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                />
                <Input
                  placeholder="Phone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                />
                <Button
                  className="w-full"
                  onClick={handleAddCustomer}
                  disabled={!newCustomer.name || !newCustomer.email}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
