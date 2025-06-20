
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CustomField, FieldType } from "@/types/customization";
import { useCustomization } from "@/hooks/useCustomization";
import { useToast } from "@/hooks/use-toast";

interface CustomFieldManagerProps {
  entityType: string;
}

export const CustomFieldManager = ({ entityType }: CustomFieldManagerProps) => {
  const { config, addCustomField, updateCustomField, deleteCustomField } = useCustomization();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const [newField, setNewField] = useState<Partial<CustomField>>({
    name: "",
    label: "",
    type: "text",
    required: false,
    visible: true,
    order: 0,
  });

  const fields = config.customFields[entityType] || [];

  const handleSaveField = () => {
    if (!newField.name || !newField.label) {
      toast({
        title: "Error",
        description: "Name and label are required",
        variant: "destructive",
      });
      return;
    }

    const fieldData: CustomField = {
      id: editingField?.id || `${entityType}_${newField.name}_${Date.now()}`,
      name: newField.name!,
      label: newField.label!,
      type: newField.type as FieldType,
      required: newField.required || false,
      visible: newField.visible !== false,
      order: newField.order || fields.length + 1,
      options: newField.options,
      defaultValue: newField.defaultValue,
    };

    if (editingField) {
      updateCustomField(entityType, editingField.id, fieldData);
      toast({
        title: "Field updated",
        description: `${fieldData.label} has been updated`,
      });
    } else {
      addCustomField(entityType, fieldData);
      toast({
        title: "Field added",
        description: `${fieldData.label} has been added`,
      });
    }

    setIsDialogOpen(false);
    setEditingField(null);
    setNewField({
      name: "",
      label: "",
      type: "text",
      required: false,
      visible: true,
      order: 0,
    });
  };

  const handleEditField = (field: CustomField) => {
    setEditingField(field);
    setNewField(field);
    setIsDialogOpen(true);
  };

  const handleDeleteField = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    deleteCustomField(entityType, fieldId);
    toast({
      title: "Field deleted",
      description: `${field?.label} has been removed`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Custom Fields - {entityType}</CardTitle>
            <CardDescription>
              Manage custom fields for {entityType} records
            </CardDescription>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Field
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">{field.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {field.name} • {field.type} {field.required && "• Required"}
                    </p>
                  </div>
                  <Switch
                    checked={field.visible}
                    onCheckedChange={(visible) =>
                      updateCustomField(entityType, field.id, { visible })
                    }
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditField(field)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteField(field.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {fields.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No custom fields defined. Add your first field to get started.
            </p>
          )}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingField ? "Edit Field" : "Add Custom Field"}
            </DialogTitle>
            <DialogDescription>
              Configure the custom field properties
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={newField.name || ""}
                onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                className="col-span-3"
                placeholder="field_name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="label" className="text-right">Label</Label>
              <Input
                id="label"
                value={newField.label || ""}
                onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                className="col-span-3"
                placeholder="Field Label"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <Select
                value={newField.type}
                onValueChange={(value) => setNewField({ ...newField, type: value as FieldType })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="select">Select</SelectItem>
                  <SelectItem value="multiselect">Multi-select</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="textarea">Textarea</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Required</Label>
              <Switch
                checked={newField.required || false}
                onCheckedChange={(required) => setNewField({ ...newField, required })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Visible</Label>
              <Switch
                checked={newField.visible !== false}
                onCheckedChange={(visible) => setNewField({ ...newField, visible })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveField}>
              {editingField ? "Update" : "Add"} Field
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
