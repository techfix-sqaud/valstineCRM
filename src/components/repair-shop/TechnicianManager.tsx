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
import { Plus, Edit, Trash2, User, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experienceYears: number;
  hourlyRate: number;
  status: 'active' | 'inactive' | 'busy';
  skills: string[];
  notes: string;
  completedJobs: number;
  averageRating: number;
  joinedDate: Date;
}

const mockTechnicians: Technician[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@repair.com',
    phone: '+1-555-0101',
    specialization: 'Mobile Devices',
    experienceYears: 5,
    hourlyRate: 25,
    status: 'active',
    skills: ['iPhone Repair', 'Android Repair', 'Screen Replacement', 'Battery Replacement'],
    notes: 'Expert in mobile device repairs, very reliable',
    completedJobs: 127,
    averageRating: 4.8,
    joinedDate: new Date('2022-03-15')
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@repair.com',
    phone: '+1-555-0102',
    specialization: 'Laptops & Computers',
    experienceYears: 7,
    hourlyRate: 30,
    status: 'busy',
    skills: ['MacBook Repair', 'Windows Laptops', 'Hardware Diagnostics', 'Data Recovery'],
    notes: 'Specializes in complex laptop repairs and data recovery',
    completedJobs: 89,
    averageRating: 4.9,
    joinedDate: new Date('2021-08-20')
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@repair.com',
    phone: '+1-555-0103',
    specialization: 'Gaming Consoles',
    experienceYears: 4,
    hourlyRate: 22,
    status: 'active',
    skills: ['PlayStation Repair', 'Xbox Repair', 'Nintendo Switch', 'Controller Repair'],
    notes: 'Gaming console specialist, quick turnaround times',
    completedJobs: 64,
    averageRating: 4.6,
    joinedDate: new Date('2022-11-10')
  }
];

export const TechnicianManager = () => {
  const [technicians, setTechnicians] = useState<Technician[]>(mockTechnicians);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTechnician, setEditingTechnician] = useState<Technician | null>(null);
  const [newTechnician, setNewTechnician] = useState<Partial<Technician>>({
    status: 'active',
    experienceYears: 0,
    hourlyRate: 20,
    skills: [],
    completedJobs: 0,
    averageRating: 0
  });
  const { toast } = useToast();

  const handleSaveTechnician = () => {
    if (!newTechnician.name || !newTechnician.email || !newTechnician.specialization) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const technicianData: Technician = {
      id: editingTechnician?.id || Date.now().toString(),
      name: newTechnician.name!,
      email: newTechnician.email!,
      phone: newTechnician.phone || '',
      specialization: newTechnician.specialization!,
      experienceYears: newTechnician.experienceYears || 0,
      hourlyRate: newTechnician.hourlyRate || 20,
      status: newTechnician.status as any || 'active',
      skills: newTechnician.skills || [],
      notes: newTechnician.notes || '',
      completedJobs: editingTechnician?.completedJobs || 0,
      averageRating: editingTechnician?.averageRating || 0,
      joinedDate: editingTechnician?.joinedDate || new Date()
    };

    if (editingTechnician) {
      setTechnicians(technicians.map(t => t.id === editingTechnician.id ? technicianData : t));
      toast({ title: "Technician updated successfully" });
    } else {
      setTechnicians([...technicians, technicianData]);
      toast({ title: "Technician added successfully" });
    }

    setIsDialogOpen(false);
    setEditingTechnician(null);
    setNewTechnician({ 
      status: 'active', 
      experienceYears: 0, 
      hourlyRate: 20, 
      skills: [], 
      completedJobs: 0, 
      averageRating: 0 
    });
  };

  const handleEditTechnician = (technician: Technician) => {
    setEditingTechnician(technician);
    setNewTechnician(technician);
    setIsDialogOpen(true);
  };

  const handleDeleteTechnician = (technicianId: string) => {
    setTechnicians(technicians.filter(t => t.id !== technicianId));
    toast({ title: "Technician removed successfully" });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'busy':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'inactive':
        return <User className="h-4 w-4 text-gray-500" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'busy':
        return 'secondary';
      case 'inactive':
        return 'outline';
      default:
        return 'default';
    }
  };

  const handleSkillsChange = (value: string) => {
    const skills = value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setNewTechnician({...newTechnician, skills});
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Technician Management</CardTitle>
            <CardDescription>
              Manage your repair technicians, their skills, and assignments
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingTechnician(null);
                setNewTechnician({ 
                  status: 'active', 
                  experienceYears: 0, 
                  hourlyRate: 20, 
                  skills: [], 
                  completedJobs: 0, 
                  averageRating: 0 
                });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Technician
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTechnician ? 'Edit Technician' : 'Add New Technician'}
                </DialogTitle>
                <DialogDescription>
                  Fill in the technician's information and specialization details
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={newTechnician.name || ''}
                    onChange={(e) => setNewTechnician({...newTechnician, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newTechnician.email || ''}
                    onChange={(e) => setNewTechnician({...newTechnician, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newTechnician.phone || ''}
                    onChange={(e) => setNewTechnician({...newTechnician, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization *</Label>
                  <Input
                    id="specialization"
                    placeholder="e.g., Mobile Devices, Laptops, Gaming Consoles"
                    value={newTechnician.specialization || ''}
                    onChange={(e) => setNewTechnician({...newTechnician, specialization: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experienceYears">Experience (Years)</Label>
                  <Input
                    id="experienceYears"
                    type="number"
                    value={newTechnician.experienceYears || ''}
                    onChange={(e) => setNewTechnician({...newTechnician, experienceYears: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={newTechnician.hourlyRate || ''}
                    onChange={(e) => setNewTechnician({...newTechnician, hourlyRate: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={newTechnician.status} onValueChange={(value) => setNewTechnician({...newTechnician, status: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="busy">Busy</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma separated)</Label>
                  <Input
                    id="skills"
                    placeholder="e.g., iPhone Repair, Screen Replacement, Data Recovery"
                    value={newTechnician.skills?.join(', ') || ''}
                    onChange={(e) => handleSkillsChange(e.target.value)}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes about the technician"
                    value={newTechnician.notes || ''}
                    onChange={(e) => setNewTechnician({...newTechnician, notes: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveTechnician}>
                  {editingTechnician ? 'Update Technician' : 'Add Technician'}
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
              <TableHead>Name</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Completed Jobs</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {technicians.map((technician) => (
              <TableRow key={technician.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{technician.name}</div>
                    <div className="text-sm text-muted-foreground">{technician.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{technician.specialization}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {technician.skills.slice(0, 2).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {technician.skills.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{technician.skills.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{technician.experienceYears} years</TableCell>
                <TableCell>${technician.hourlyRate}/hr</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(technician.status)}
                    <Badge variant={getStatusColor(technician.status)}>
                      {technician.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>{technician.completedJobs}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span>{technician.averageRating.toFixed(1)}</span>
                    <span className="text-yellow-500">★</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTechnician(technician)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTechnician(technician.id)}
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