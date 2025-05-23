
import { useState } from "react";
import Layout from "@/components/layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, MoreHorizontal, Search, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

type Invoice = {
  id: string;
  client: string;
  amount: string;
  status: "paid" | "pending" | "overdue";
  date: string;
  dueDate: string;
};

const initialInvoices: Invoice[] = [
  {
    id: "INV-001",
    client: "Tech Solutions Inc.",
    amount: "$1,250.00",
    status: "paid",
    date: "2023-05-10",
    dueDate: "2023-05-24",
  },
  {
    id: "INV-002",
    client: "Digital Marketing Co.",
    amount: "$2,500.00",
    status: "pending",
    date: "2023-05-12",
    dueDate: "2023-05-26",
  },
  {
    id: "INV-003",
    client: "Retail Innovations",
    amount: "$850.00",
    status: "overdue",
    date: "2023-04-25",
    dueDate: "2023-05-09",
  },
  {
    id: "INV-004",
    client: "Finance Partners",
    amount: "$3,200.00",
    status: "paid",
    date: "2023-05-08",
    dueDate: "2023-05-22",
  },
  {
    id: "INV-005",
    client: "Global Services Ltd.",
    amount: "$1,800.00",
    status: "pending",
    date: "2023-05-15",
    dueDate: "2023-05-29",
  },
];

const Invoices = () => {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    id: "",
    client: "",
    amount: "",
    status: "pending" as const,
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  });

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewInvoice((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setNewInvoice((prev) => ({ ...prev, [field]: value }));
  };

  const generateInvoiceId = () => {
    // Find the highest invoice number
    const highestId = invoices
      .map((invoice) => parseInt(invoice.id.replace("INV-", "")))
      .reduce((max, current) => Math.max(max, current), 0);
    
    // Format new ID with padding
    const newId = `INV-${String(highestId + 1).padStart(3, "0")}`;
    return newId;
  };

  const handleAddInvoice = () => {
    if (!newInvoice.client || !newInvoice.amount) {
      toast({
        title: "Error",
        description: "Client and amount are required",
        variant: "destructive",
      });
      return;
    }

    // Generate a new invoice ID if not provided
    const invoiceId = newInvoice.id || generateInvoiceId();

    setInvoices([...invoices, { ...newInvoice, id: invoiceId }]);
    setIsDialogOpen(false);
    setNewInvoice({
      id: "",
      client: "",
      amount: "",
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    });

    toast({
      title: "Invoice created",
      description: `Invoice ${invoiceId} has been created successfully`,
    });
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices(invoices.filter((invoice) => invoice.id !== id));
    
    toast({
      title: "Invoice deleted",
      description: `Invoice ${id} has been removed`,
    });
  };

  const handleGenerateInvoice = (id: string) => {
    toast({
      title: "Generating PDF",
      description: `Invoice ${id} is being generated as a PDF`,
    });
  };

  return (
    <Layout
      header={
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Invoices</h1>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Invoice
          </Button>
        </div>
      }
    >
      <div className="rounded-lg border bg-card">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.client}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.dueDate}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      invoice.status === "paid"
                        ? "border-green-500 bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
                        : invoice.status === "pending"
                        ? "border-amber-500 bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
                        : "border-red-500 bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
                    }
                  >
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleGenerateInvoice(invoice.id)}>
                        Generate PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteInvoice(invoice.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredInvoices.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No invoices found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
            <DialogDescription>
              Enter the invoice details below
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client" className="text-right">
                Client
              </Label>
              <Select
                value={newInvoice.client}
                onValueChange={(value) => handleSelectChange(value, "client")}
              >
                <SelectTrigger className="col-span-3" id="client">
                  <SelectValue placeholder="Select client" />
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

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                name="amount"
                value={newInvoice.amount}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="$0.00"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={newInvoice.date}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={newInvoice.dueDate}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Status</Label>
              <Select
                value={newInvoice.status}
                onValueChange={(value: "paid" | "pending" | "overdue") => handleSelectChange(value, "status")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleAddInvoice}>
              <FileText className="mr-2 h-4 w-4" /> Create Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Invoices;
