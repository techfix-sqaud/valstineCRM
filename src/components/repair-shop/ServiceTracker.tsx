import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Clock, CheckCircle, AlertCircle, Package, Edit, MessageSquare, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ServiceUpdate {
  id: string;
  serviceId: string;
  timestamp: Date;
  status: string;
  note: string;
  updatedBy: string;
  timeSpent?: number;
  partsUsed?: string[];
  customerNotified: boolean;
}

interface TrackedService {
  id: string;
  customerName: string;
  deviceType: string;
  deviceModel: string;
  issue: string;
  status: 'pending' | 'in-progress' | 'waiting-parts' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTechnician: string;
  estimatedCost: number;
  actualCost?: number;
  createdAt: Date;
  estimatedCompletion?: Date;
  updates: ServiceUpdate[];
  progress: number;
}

const mockServices: TrackedService[] = [
  {
    id: '1',
    customerName: 'Alice Johnson',
    deviceType: 'iPhone',
    deviceModel: 'iPhone 14 Pro',
    issue: 'Cracked screen replacement',
    status: 'in-progress',
    priority: 'medium',
    assignedTechnician: 'John Smith',
    estimatedCost: 199,
    createdAt: new Date('2024-01-15'),
    estimatedCompletion: new Date('2024-01-17'),
    progress: 65,
    updates: [
      {
        id: '1',
        serviceId: '1',
        timestamp: new Date('2024-01-15T09:00:00'),
        status: 'Service received',
        note: 'Device checked in, confirmed cracked screen damage',
        updatedBy: 'John Smith',
        customerNotified: true
      },
      {
        id: '2',
        serviceId: '1',
        timestamp: new Date('2024-01-15T10:30:00'),
        status: 'Diagnosis complete',
        note: 'Screen replacement required, no other damage found',
        updatedBy: 'John Smith',
        timeSpent: 30,
        customerNotified: true
      },
      {
        id: '3',
        serviceId: '1',
        timestamp: new Date('2024-01-16T14:00:00'),
        status: 'Repair in progress',
        note: 'Started screen replacement, removing old screen',
        updatedBy: 'John Smith',
        timeSpent: 45,
        customerNotified: false
      }
    ]
  },
  {
    id: '2',
    customerName: 'Bob Martinez',
    deviceType: 'MacBook',
    deviceModel: 'MacBook Air M2',
    issue: 'Keyboard not working',
    status: 'waiting-parts',
    priority: 'high',
    assignedTechnician: 'Sarah Wilson',
    estimatedCost: 150,
    createdAt: new Date('2024-01-14'),
    estimatedCompletion: new Date('2024-01-20'),
    progress: 40,
    updates: [
      {
        id: '4',
        serviceId: '2',
        timestamp: new Date('2024-01-14T11:00:00'),
        status: 'Service received',
        note: 'MacBook checked in, keyboard not responding',
        updatedBy: 'Sarah Wilson',
        customerNotified: true
      },
      {
        id: '5',
        serviceId: '2',
        timestamp: new Date('2024-01-14T15:30:00'),
        status: 'Diagnosis complete',
        note: 'Liquid damage detected, keyboard replacement needed',
        updatedBy: 'Sarah Wilson',
        timeSpent: 60,
        customerNotified: true
      },
      {
        id: '6',
        serviceId: '2',
        timestamp: new Date('2024-01-15T09:00:00'),
        status: 'Waiting for parts',
        note: 'Keyboard ordered from supplier, ETA 3-5 business days',
        updatedBy: 'Sarah Wilson',
        customerNotified: true
      }
    ]
  }
];

export const ServiceTracker = () => {
  const [services, setServices] = useState<TrackedService[]>(mockServices);
  const [selectedService, setSelectedService] = useState<TrackedService | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [newUpdate, setNewUpdate] = useState({
    status: '',
    note: '',
    timeSpent: 0,
    partsUsed: '',
    customerNotified: false
  });
  const { toast } = useToast();

  const handleAddUpdate = () => {
    if (!selectedService || !newUpdate.status || !newUpdate.note) {
      toast({
        title: "Error",
        description: "Please fill in status and note fields",
        variant: "destructive"
      });
      return;
    }

    const update: ServiceUpdate = {
      id: Date.now().toString(),
      serviceId: selectedService.id,
      timestamp: new Date(),
      status: newUpdate.status,
      note: newUpdate.note,
      updatedBy: 'Current User', // This would be the logged-in user
      timeSpent: newUpdate.timeSpent || undefined,
      partsUsed: newUpdate.partsUsed ? newUpdate.partsUsed.split(',').map(p => p.trim()) : undefined,
      customerNotified: newUpdate.customerNotified
    };

    const updatedServices = services.map(service => {
      if (service.id === selectedService.id) {
        return {
          ...service,
          updates: [...service.updates, update],
          progress: Math.min(service.progress + 15, 100) // Increment progress
        };
      }
      return service;
    });

    setServices(updatedServices);
    setIsUpdateDialogOpen(false);
    setNewUpdate({
      status: '',
      note: '',
      timeSpent: 0,
      partsUsed: '',
      customerNotified: false
    });

    toast({ title: "Service update added successfully" });
  };

  const getStatusIcon = (status: string) => {
    if (status.toLowerCase().includes('complete') || status.toLowerCase().includes('received')) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (status.toLowerCase().includes('waiting') || status.toLowerCase().includes('parts')) {
      return <Package className="h-4 w-4 text-yellow-500" />;
    } else if (status.toLowerCase().includes('progress')) {
      return <AlertCircle className="h-4 w-4 text-blue-500" />;
    }
    return <Clock className="h-4 w-4 text-gray-500" />;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'outline';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Active Services</CardTitle>
              <CardDescription>Track ongoing repair services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                    selectedService?.id === service.id ? 'border-primary bg-accent' : ''
                  }`}
                  onClick={() => setSelectedService(service)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{service.customerName}</h3>
                    <Badge variant={getPriorityColor(service.priority)}>
                      {service.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {service.deviceType} - {service.issue}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{service.progress}%</span>
                    </div>
                    <Progress value={service.progress} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                    <span>{service.assignedTechnician}</span>
                    <span>{service.updates.length} updates</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Service Details */}
        <div className="lg:col-span-2">
          {selectedService ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedService.customerName}'s {selectedService.deviceType}</CardTitle>
                    <CardDescription>
                      {selectedService.deviceModel} - {selectedService.issue}
                    </CardDescription>
                  </div>
                  <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Edit className="h-4 w-4 mr-2" />
                        Add Update
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Service Update</DialogTitle>
                        <DialogDescription>
                          Record progress, time spent, and notify customer
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="status">Status Update *</Label>
                          <Input
                            id="status"
                            placeholder="e.g., Repair in progress, Parts installed"
                            value={newUpdate.status}
                            onChange={(e) => setNewUpdate({...newUpdate, status: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="note">Notes *</Label>
                          <Textarea
                            id="note"
                            placeholder="Detailed description of work performed"
                            value={newUpdate.note}
                            onChange={(e) => setNewUpdate({...newUpdate, note: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="timeSpent">Time Spent (minutes)</Label>
                            <Input
                              id="timeSpent"
                              type="number"
                              value={newUpdate.timeSpent}
                              onChange={(e) => setNewUpdate({...newUpdate, timeSpent: parseInt(e.target.value) || 0})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="partsUsed">Parts Used (comma separated)</Label>
                            <Input
                              id="partsUsed"
                              placeholder="e.g., Screen, Battery"
                              value={newUpdate.partsUsed}
                              onChange={(e) => setNewUpdate({...newUpdate, partsUsed: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="customerNotified"
                            checked={newUpdate.customerNotified}
                            onChange={(e) => setNewUpdate({...newUpdate, customerNotified: e.target.checked})}
                          />
                          <Label htmlFor="customerNotified">Notify customer</Label>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddUpdate}>
                          Add Update
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Service Overview */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Service Details</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge>{selectedService.status.replace('-', ' ')}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Priority:</span>
                          <Badge variant={getPriorityColor(selectedService.priority)}>
                            {selectedService.priority}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Technician:</span>
                          <span>{selectedService.assignedTechnician}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Estimated Cost:</span>
                          <span>${selectedService.estimatedCost}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Timeline</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Created:</span>
                          <span>{selectedService.createdAt.toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Est. Completion:</span>
                          <span>{selectedService.estimatedCompletion?.toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Progress:</span>
                          <span>{selectedService.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Service Updates Timeline */}
                  <div>
                    <h4 className="font-medium mb-4">Service Updates</h4>
                    <div className="space-y-4">
                      {selectedService.updates.map((update, index) => (
                        <div key={update.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            {getStatusIcon(update.status)}
                            {index < selectedService.updates.length - 1 && (
                              <div className="w-px h-8 bg-border mt-2" />
                            )}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium">{update.status}</h5>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                {update.customerNotified && (
                                  <Badge variant="outline" className="text-xs">
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                    Notified
                                  </Badge>
                                )}
                                <span>{update.timestamp.toLocaleString()}</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{update.note}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {update.updatedBy}
                              </div>
                              {update.timeSpent && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {update.timeSpent}min
                                </div>
                              )}
                              {update.partsUsed && (
                                <div className="flex items-center gap-1">
                                  <Package className="h-3 w-3" />
                                  {update.partsUsed.join(', ')}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4" />
                  <p>Select a service to view details and updates</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};