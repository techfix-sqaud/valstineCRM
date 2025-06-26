
import { useState } from "react";
import { Plus, Search, Filter, Users, Phone, Mail, Building, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/hooks/useLanguage";
import { BulkUpload } from "@/components/bulk-upload";
import Layout from "@/components/layout";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive' | 'lead';
}

export default function Clients() {
  const { t, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([
    { id: "1", name: "John Doe", email: "john@example.com", phone: "+1234567890", company: "Acme Corp", status: "active" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", phone: "+0987654321", company: "Tech Inc", status: "active" },
    { id: "3", name: "Bob Johnson", email: "bob@example.com", phone: "+1122334455", company: "StartupXYZ", status: "lead" },
    { id: "4", name: "Alice Brown", email: "alice@example.com", phone: "+5566778899", company: "Design Co", status: "inactive" },
  ]);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      'active': 'default',
      'inactive': 'secondary',
      'lead': 'outline'
    };
    return variants[status as keyof typeof variants] || 'default';
  };

  const totalClients = clients.length;
  const activeClients = clients.filter(client => client.status === 'active').length;
  const leads = clients.filter(client => client.status === 'lead').length;
  const inactiveClients = clients.filter(client => client.status === 'inactive').length;

  const handleBulkUploadUsers = (data: any[]) => {
    const newClients: Client[] = data.map((row, index) => ({
      id: `bulk_${Date.now()}_${index}`,
      name: row.name || `Client ${index + 1}`,
      email: row.email || `client${index + 1}@example.com`,
      phone: row.phone || '+1234567890',
      company: row.company || 'Company',
      status: row.status === 'inactive' ? 'inactive' : row.status === 'lead' ? 'lead' : 'active'
    }));
    setClients(prev => [...prev, ...newClients]);
  };

  const exportToExcel = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Company', 'Status'].join(','),
      ...filteredClients.map(client => 
        [client.name, client.email, client.phone, client.company, client.status].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clients_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div>
            <h1 className="text-3xl font-bold">{t('clients') || 'Clients'}</h1>
            <p className="text-muted-foreground">Manage your client relationships and contacts</p>
          </div>
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <BulkUpload type="users" onUpload={handleBulkUploadUsers} />
            <Button onClick={exportToExcel} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClients}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeClients}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leads</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{leads}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive</CardTitle>
              <Users className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{inactiveClients}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <div className={`flex flex-col sm:flex-row gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <div className="relative flex-1">
                <Search className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                <Input
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={isRTL ? 'pr-10' : 'pl-10'}
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className={isRTL ? 'text-left' : 'text-right'}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>{client.company}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(client.status) as any}>
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell className={isRTL ? 'text-left' : 'text-right'}>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
