import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RepairService {
  id: string;
  customerName: string;
  customerPhone: string;
  deviceType: string;
  deviceModel: string;
  issue: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'waiting-parts' | 'completed' | 'cancelled';
  assignedTechnician?: string;
  estimatedCost: number;
  actualCost?: number;
  createdAt: Date;
  estimatedCompletion?: Date;
  completedAt?: Date;
  notes: string;
}

const mockTechnicians = [
  { id: '1', name: 'John Smith', specialization: 'Mobile Devices' },
  { id: '2', name: 'Sarah Wilson', specialization: 'Laptops & Computers' },
  { id: '3', name: 'Mike Johnson', specialization: 'Gaming Consoles' },
  { id: '4', name: 'Lisa Chen', specialization: 'Tablets & iPads' },
];

const mockServices: RepairService[] = [
  {
    id: '1',
    customerName: 'Alice Johnson',
    customerPhone: '+1-555-0123',
    deviceType: 'iPhone',
    deviceModel: 'iPhone 14 Pro',
    issue: 'Cracked screen replacement',
    priority: 'medium',
    status: 'in-progress',
    assignedTechnician: 'John Smith',
    estimatedCost: 199,
    createdAt: new Date('2024-01-15'),
    estimatedCompletion: new Date('2024-01-17'),
    notes: 'Customer dropped device, screen completely shattered but touch still works'
  },
  {
    id: '2',
    customerName: 'Bob Martinez',
    customerPhone: '+1-555-0124',
    deviceType: 'MacBook',
    deviceModel: 'MacBook Air M2',
    issue: 'Keyboard not working',
    priority: 'high',
    status: 'waiting-parts',
    assignedTechnician: 'Sarah Wilson',
    estimatedCost: 150,
    createdAt: new Date('2024-01-14'),
    estimatedCompletion: new Date('2024-01-20'),
    notes: 'Liquid damage detected, needs keyboard replacement'
  }
];

export const ServiceManager = () => {
  const [services, setServices] = useState<RepairService[]>(mockServices);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<RepairService | null>(null);
  const [newService, setNewService] = useState<Partial<RepairService>>({
    priority: 'medium',
    status: 'pending',
    estimatedCost: 0
  });
  const { toast } = useToast();

  const handleSaveService = () => {
    if (!newService.customerName || !newService.deviceType || !newService.issue) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const serviceData: RepairService = {
      id: editingService?.id || Date.now().toString(),
      customerName: newService.customerName!,
      customerPhone: newService.customerPhone || '',
      deviceType: newService.deviceType!,
      deviceModel: newService.deviceModel || '',
      issue: newService.issue!,
      priority: newService.priority as any || 'medium',
      status: newService.status as any || 'pending',
      assignedTechnician: newService.assignedTechnician,
      estimatedCost: newService.estimatedCost || 0,
      actualCost: newService.actualCost,
      createdAt: editingService?.createdAt || new Date(),
      estimatedCompletion: newService.estimatedCompletion,
      completedAt: newService.completedAt,
      notes: newService.notes || ''
    };

    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? serviceData : s));
      toast({ title: "Service updated successfully" });
    } else {
      setServices([...services, serviceData]);
      toast({ title: "Service created successfully" });
    }

    setIsDialogOpen(false);
    setEditingService(null);
    setNewService({ priority: 'medium', status: 'pending', estimatedCost: 0 });
  };

  const handleEditService = (service: RepairService) => {
    setEditingService(service);
    setNewService(service);
    setIsDialogOpen(true);
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(services.filter(s => s.id !== serviceId));
    toast({ title: "Service deleted successfully" });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in-progress':
        return <AlertCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'waiting-parts':
        return 'outline';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'high':
        return 'outline';
      case 'urgent':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Service Management</CardTitle>
            <CardDescription>
              Create and manage repair services for your customers
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingService(null);
                setNewService({ priority: 'medium', status: 'pending', estimatedCost: 0 });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                New Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingService ? 'Edit Service' : 'Create New Service'}
                </DialogTitle>
                <DialogDescription>
                  Fill in the service details for the customer's repair request
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={newService.customerName || ''}
                    onChange={(e) => setNewService({...newService, customerName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Customer Phone</Label>
                  <Input
                    id="customerPhone"
                    value={newService.customerPhone || ''}
                    onChange={(e) => setNewService({...newService, customerPhone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deviceType">Device Type *</Label>
                  <Input
                    id="deviceType"
                    placeholder="e.g., iPhone, MacBook, Samsung Galaxy"
                    value={newService.deviceType || ''}
                    onChange={(e) => setNewService({...newService, deviceType: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deviceModel">Device Model</Label>
                  <Input
                    id="deviceModel"
                    placeholder="e.g., iPhone 14 Pro, MacBook Air M2"
                    value={newService.deviceModel || ''}
                    onChange={(e) => setNewService({...newService, deviceModel: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newService.priority} onValueChange={(value) => setNewService({...newService, priority: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={newService.status} onValueChange={(value) => setNewService({...newService, status: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="waiting-parts">Waiting for Parts</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignedTechnician">Assigned Technician</Label>
                  <Select value={newService.assignedTechnician} onValueChange={(value) => setNewService({...newService, assignedTechnician: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select technician" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTechnicians.map((tech) => (
                        <SelectItem key={tech.id} value={tech.name}>
                          {tech.name} - {tech.specialization}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedCost">Estimated Cost ($)</Label>
                  <Input
                    id="estimatedCost"
                    type="number"
                    value={newService.estimatedCost || ''}
                    onChange={(e) => setNewService({...newService, estimatedCost: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="issue">Issue Description *</Label>
                  <Textarea
                    id="issue"
                    placeholder="Describe the issue with the device"
                    value={newService.issue || ''}
                    onChange={(e) => setNewService({...newService, issue: e.target.value})}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional notes or observations"
                    value={newService.notes || ''}
                    onChange={(e) => setNewService({...newService, notes: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveService}>
                  {editingService ? 'Update Service' : 'Create Service'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Issue</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{service.customerName}</div>
                    <div className="text-sm text-muted-foreground">{service.customerPhone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{service.deviceType}</div>
                    <div className="text-sm text-muted-foreground">{service.deviceModel}</div>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs truncate" title={service.issue}>
                  {service.issue}
                </TableCell>
                <TableCell>
                  <Badge variant={getPriorityColor(service.priority)}>
                    {service.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(service.status)}
                    <Badge variant={getStatusColor(service.status)}>
                      {service.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>{service.assignedTechnician || 'Unassigned'}</TableCell>
                <TableCell>${service.estimatedCost}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditService(service)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};