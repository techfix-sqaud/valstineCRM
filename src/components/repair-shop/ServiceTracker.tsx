import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Eye, Edit, Package, Wrench, FileCheck, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ServiceTracker = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  const [services, setServices] = useState([
    {
      id: 'SRV-001',
      customerName: 'John Doe',
      device: 'iPhone 12 Pro',
      issue: 'Cracked screen replacement',
      priority: 'High',
      status: 'processing',
      technician: 'Mike Johnson',
      estimatedCompletion: '2024-01-15',
      createdAt: '2024-01-10',
    },
    {
      id: 'SRV-002',
      customerName: 'Jane Smith',
      device: 'Samsung Galaxy S21',
      issue: 'Battery replacement',
      priority: 'Medium',
      status: 'working',
      technician: 'Sarah Williams',
      estimatedCompletion: '2024-01-16',
      createdAt: '2024-01-11',
    },
    {
      id: 'SRV-003',
      customerName: 'Bob Wilson',
      device: 'iPad Air',
      issue: 'Water damage repair',
      priority: 'High',
      status: 'ready-for-pickup',
      technician: 'Mike Johnson',
      estimatedCompletion: '2024-01-14',
      createdAt: '2024-01-09',
    },
    {
      id: 'SRV-004',
      customerName: 'Alice Brown',
      device: 'MacBook Pro',
      issue: 'Keyboard replacement',
      priority: 'Low',
      status: 'picked-up',
      technician: 'David Lee',
      estimatedCompletion: '2024-01-12',
      createdAt: '2024-01-08',
    },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Package className="h-4 w-4 text-orange-500" />;
      case 'working':
        return <Wrench className="h-4 w-4 text-blue-500" />;
      case 'ready-for-pickup':
        return <FileCheck className="h-4 w-4 text-green-500" />;
      case 'picked-up':
        return <UserCheck className="h-4 w-4 text-gray-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'working':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready-for-pickup':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'picked-up':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'processing':
        return 'Processing';
      case 'working':
        return 'Working';
      case 'ready-for-pickup':
        return 'Ready for Pickup';
      case 'picked-up':
        return 'Picked Up';
      default:
        return status;
    }
  };

  const updateServiceStatus = (serviceId: string, newStatus: string) => {
    setServices(prev => 
      prev.map(service => 
        service.id === serviceId 
          ? { ...service, status: newStatus }
          : service
      )
    );
    
    toast({
      title: "Status Updated",
      description: `Service ${serviceId} status changed to ${getStatusLabel(newStatus)}`,
    });
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.issue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Service Tracker</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="working">Working</SelectItem>
                  <SelectItem value="ready-for-pickup">Ready for Pickup</SelectItem>
                  <SelectItem value="picked-up">Picked Up</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Est. Completion</TableHead>
                  <TableHead>Update Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.id}</TableCell>
                    <TableCell>{service.customerName}</TableCell>
                    <TableCell>{service.device}</TableCell>
                    <TableCell>{service.issue}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getPriorityBadge(service.priority)}>
                        {service.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(service.status)}
                        <Badge variant="outline" className={getStatusBadge(service.status)}>
                          {getStatusLabel(service.status)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{service.technician}</TableCell>
                    <TableCell>{service.estimatedCompletion}</TableCell>
                    <TableCell>
                      <Select 
                        value={service.status} 
                        onValueChange={(value) => updateServiceStatus(service.id, value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="working">Working</SelectItem>
                          <SelectItem value="ready-for-pickup">Ready for Pickup</SelectItem>
                          <SelectItem value="picked-up">Picked Up</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};