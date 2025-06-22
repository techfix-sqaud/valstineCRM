
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import Layout from "@/components/layout";
import { useCustomization } from "@/hooks/useCustomization";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { CustomEntity, CustomField } from "@/types/customization";

interface EntityRecord {
  id: string;
  [key: string]: any;
}

export default function EntityPage() {
  const { entityName } = useParams<{ entityName: string }>();
  const { config } = useCustomization();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [entity, setEntity] = useState<CustomEntity | null>(null);
  const [records, setRecords] = useState<EntityRecord[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<EntityRecord | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (entityName && config.customEntities) {
      const foundEntity = config.customEntities.find(e => e.name === entityName);
      setEntity(foundEntity || null);
      
      // Load records from localStorage
      const savedRecords = localStorage.getItem(`entity_${entityName}_records`);
      if (savedRecords) {
        try {
          setRecords(JSON.parse(savedRecords));
        } catch (error) {
          console.error('Failed to load entity records:', error);
        }
      }
    }
  }, [entityName, config.customEntities]);

  const saveRecords = (newRecords: EntityRecord[]) => {
    setRecords(newRecords);
    localStorage.setItem(`entity_${entityName}_records`, JSON.stringify(newRecords));
  };

  const handleSaveRecord = () => {
    if (!entity) return;

    const recordData: EntityRecord = {
      id: editingRecord?.id || `record_${Date.now()}`,
      ...formData
    };

    let updatedRecords;
    if (editingRecord) {
      updatedRecords = records.map(r => r.id === editingRecord.id ? recordData : r);
      toast({
        title: "Record updated",
        description: `${entity.label} record has been updated`,
      });
    } else {
      updatedRecords = [...records, recordData];
      toast({
        title: "Record created",
        description: `New ${entity.label} record has been created`,
      });
    }

    saveRecords(updatedRecords);
    setIsDialogOpen(false);
    setEditingRecord(null);
    setFormData({});
  };

  const handleEditRecord = (record: EntityRecord) => {
    setEditingRecord(record);
    setFormData(record);
    setIsDialogOpen(true);
  };

  const handleDeleteRecord = (recordId: string) => {
    const updatedRecords = records.filter(r => r.id !== recordId);
    saveRecords(updatedRecords);
    toast({
      title: "Record deleted",
      description: `${entity?.label} record has been removed`,
    });
  };

  const renderField = (field: CustomField) => {
    const value = formData[field.name] || '';

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
            placeholder={field.label}
          />
        );
      case 'select':
        return (
          <Select
            value={value}
            onValueChange={(newValue) => setFormData({ ...formData, [field.name]: newValue })}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {(field.options || []).map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'boolean':
        return (
          <Checkbox
            checked={!!value}
            onCheckedChange={(checked) => setFormData({ ...formData, [field.name]: checked })}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
            placeholder={field.label}
          />
        );
      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
          />
        );
      default:
        return (
          <Input
            type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
            value={value}
            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
            placeholder={field.label}
          />
        );
    }
  };

  if (!entity) {
    return (
      <Layout
        header={
          <div>
            <h1 className="text-xl font-bold">Entity Not Found</h1>
            <p className="text-sm text-muted-foreground">
              The requested entity could not be found
            </p>
          </div>
        }
      >
        <Card>
          <CardContent className="text-center py-8">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Entity "{entityName}" not found</p>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  const visibleFields = entity.fields.filter(f => f.visible);

  return (
    <Layout
      header={
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-xl font-bold">{entity.label}</h1>
            <p className="text-sm text-muted-foreground">
              Manage your {entity.label.toLowerCase()} records
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add {entity.label.slice(0, -1)}
          </Button>
        </div>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>{entity.label} Records</CardTitle>
          <CardDescription>
            View and manage all {entity.label.toLowerCase()} in your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {records.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleFields.map((field) => (
                    <TableHead key={field.id}>{field.label}</TableHead>
                  ))}
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    {visibleFields.map((field) => (
                      <TableCell key={field.id}>
                        {field.type === 'boolean' 
                          ? (record[field.name] ? 'Yes' : 'No')
                          : record[field.name] || '-'
                        }
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditRecord(record)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRecord(record.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No {entity.label.toLowerCase()} found</p>
              <p className="text-sm text-muted-foreground">
                Create your first {entity.label.slice(0, -1).toLowerCase()} to get started
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Record Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRecord ? 'Edit' : 'Add'} {entity.label.slice(0, -1)}
            </DialogTitle>
            <DialogDescription>
              {editingRecord ? 'Update' : 'Create'} a {entity.label.slice(0, -1).toLowerCase()} record
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {entity.fields.map((field) => (
              <div key={field.id} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field.name} className="text-right">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <div className="col-span-3">
                  {renderField(field)}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('cancel') || 'Cancel'}
            </Button>
            <Button onClick={handleSaveRecord}>
              {editingRecord ? t('update') || 'Update' : t('create') || 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
