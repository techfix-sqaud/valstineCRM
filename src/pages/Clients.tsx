
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, MoreHorizontal, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Client = {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "lead";
};

const initialClients: Client[] = [
  {
    id: 1,
    name: "Alice Johnson",
    company: "Tech Solutions Inc.",
    email: "alice@techsolutions.com",
    phone: "(555) 123-4567",
    status: "active",
  },
  {
    id: 2,
    name: "Bob Smith",
    company: "Digital Marketing Co.",
    email: "bob@digitalmarketing.com",
    phone: "(555) 234-5678",
    status: "active",
  },
  {
    id: 3,
    name: "Carol Williams",
    company: "Retail Innovations",
    email: "carol@retailinnovations.com",
    phone: "(555) 345-6789",
    status: "inactive",
  },
  {
    id: 4,
    name: "David Brown",
    company: "Finance Partners",
    email: "david@financepartners.com",
    phone: "(555) 456-7890",
    status: "lead",
  },
  {
    id: 5,
    name: "Eve Taylor",
    company: "Global Services Ltd.",
    email: "eve@globalservices.com",
    phone: "(555) 567-8901",
    status: "active",
  },
  {
    id: 6,
    name: "Frank Miller",
    company: "Construction Experts",
    email: "frank@constructionexperts.com",
    phone: "(555) 678-9012",
    status: "inactive",
  },
];

const Clients = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState<{
    name: string;
    company: string;
    email: string;
    phone: string;
    status: "active" | "inactive" | "lead";
  }>({
    name: "",
    company: "",
    email: "",
    phone: "",
    status: "lead",
  });

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (status: "active" | "inactive" | "lead") => {
    setNewClient((prev) => ({ ...prev, status }));
  };

  const handleAddClient = () => {
    if (!newClient.name || !newClient.email) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.max(...clients.map((c) => c.id)) + 1;
    setClients([...clients, { ...newClient, id: newId }]);
    setIsDialogOpen(false);
    setNewClient({
      name: "",
      company: "",
      email: "",
      phone: "",
      status: "lead",
    });

    toast({
      title: "Client added",
      description: `${newClient.name} has been added successfully`,
    });
  };

  const handleDeleteClient = (id: number) => {
    const clientToDelete = clients.find((c) => c.id === id);
    setClients(clients.filter((client) => client.id !== id));
    
    toast({
      title: "Client deleted",
      description: `${clientToDelete?.name} has been removed`,
    });
  };

  return (
    <Layout
      header={
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Clients</h1>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Client
          </Button>
        </div>
      }
    >
      <div className="rounded-lg border bg-card">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.company}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      client.status === "active"
                        ? "border-green-500 bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
                        : client.status === "inactive"
                        ? "border-red-500 bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
                        : "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                    }
                  >
                    {client.status === "active"
                      ? "Active"
                      : client.status === "inactive"
                      ? "Inactive"
                      : "Lead"}
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
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClient(client.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredClients.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No clients found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Enter the details of the new client below
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={newClient.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Company
              </Label>
              <Input
                id="company"
                name="company"
                value={newClient.company}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={newClient.email}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                value={newClient.phone}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Status</Label>
              <div className="col-span-3 flex gap-2">
                <Button
                  type="button"
                  variant={newClient.status === "lead" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange("lead")}
                >
                  Lead
                </Button>
                <Button
                  type="button"
                  variant={newClient.status === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange("active")}
                >
                  Active
                </Button>
                <Button
                  type="button"
                  variant={newClient.status === "inactive" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange("inactive")}
                >
                  Inactive
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleAddClient}>Add Client</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Clients;
