import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, Edit, Package, GripVertical, Eye, EyeOff, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CustomEntity, NavigationItem, CustomField } from "@/types/customization";
import { useCustomization } from "@/hooks/useCustomization";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const commonIcons = [
  'Package', 'Users', 'FileText', 'BarChart3', 'Calendar', 'Mail', 
  'Phone', 'MapPin', 'Search', 'Star', 'Heart', 'Bookmark', 'Tag', 'Folder',
  'ShoppingCart', 'Truck', 'Warehouse', 'Building', 'Store'
];

const fieldTypes = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'select', label: 'Select' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'textarea', label: 'Textarea' }
];

export const EntityManager = () => {
  const { config, saveConfig, updateNavigation, addView } = useCustomization();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFieldDialogOpen, setIsFieldDialogOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<CustomEntity | null>(null);
  const [editingEntityForFields, setEditingEntityForFields] = useState<CustomEntity | null>(null);
  const [newEntity, setNewEntity] = useState<Partial<CustomEntity>>({
    name: "",
    label: "",
    fields: [],
    showInNavigation: true,
    navigationIcon: "Package",
    visible: true,
  });
  const [newField, setNewField] = useState<Partial<CustomField>>({
    name: "",
    label: "",
    type: "text",
    required: false,
    visible: true,
    order: 1
  });

  const handleSaveEntity = () => {
    if (!newEntity.name || !newEntity.label) {
      toast({
        title: t('error') || "Error",
        description: "Name and label are required",
        variant: "destructive",
      });
      return;
    }

    const entityData: CustomEntity = {
      id: editingEntity?.id || `entity_${Date.now()}`,
      name: newEntity.name!,
      label: newEntity.label!,
      fields: newEntity.fields || [],
      showInNavigation: newEntity.showInNavigation ?? true,
      navigationIcon: newEntity.navigationIcon || "Package",
      navigationOrder: newEntity.navigationOrder,
      visible: newEntity.visible ?? true,
    };

    const newConfig = { ...config };
    
    if (!newConfig.customEntities) {
      newConfig.customEntities = [];
    }

    const isNewEntity = !editingEntity;

    if (editingEntity) {
      const entityIndex = newConfig.customEntities.findIndex(e => e.id === editingEntity.id);
      if (entityIndex >= 0) {
        newConfig.customEntities[entityIndex] = entityData;
      }
      toast({
        title: "Entity updated",
        description: `${entityData.label} has been updated`,
      });
    } else {
      newConfig.customEntities.push(entityData);
      
      // Add to navigation if requested
      if (entityData.showInNavigation) {
        const navItem: NavigationItem = {
          id: `entity-${entityData.id}`,
          title: entityData.label,
          path: `/entity/${entityData.name}`,
          icon: entityData.navigationIcon || "Package",
          order: entityData.navigationOrder || newConfig.navigation.length + 1,
          visible: true,
          isCustom: true,
          entityType: entityData.name
        };
        newConfig.navigation.push(navItem);
      }

      // Create a default view for the entity
      const defaultView = {
        id: `view_${entityData.name}_default`,
        name: `All ${entityData.label}`,
        entityType: entityData.name as any,
        columns: entityData.fields.filter(f => f.visible).map(f => f.name),
        filters: [],
        isDefault: true,
        showInNavigation: false
      };
      newConfig.views.push(defaultView);

      // Add custom fields for this entity
      newConfig.customFields[entityData.name] = entityData.fields;
      
      toast({
        title: "Entity created",
        description: `${entityData.label} has been created`,
      });
    }

    saveConfig(newConfig);
    setIsDialogOpen(false);
    setEditingEntity(null);
    setNewEntity({
      name: "",
      label: "",
      fields: [],
      showInNavigation: true,
      navigationIcon: "Package",
      visible: true,
    });

    // Refresh page if new entity with navigation was created
    if (isNewEntity && entityData.showInNavigation) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleEditEntity = (entity: CustomEntity) => {
    setEditingEntity(entity);
    setNewEntity(entity);
    setIsDialogOpen(true);
  };

  const handleEditEntityFields = (entity: CustomEntity) => {
    setEditingEntityForFields(entity);
    setIsFieldDialogOpen(true);
  };

  const handleDeleteEntity = (entityId: string) => {
    const entity = config.customEntities?.find(e => e.id === entityId);
    const newConfig = { ...config };
    
    // Remove entity
    newConfig.customEntities = newConfig.customEntities?.filter(e => e.id !== entityId) || [];
    
    // Remove from navigation
    newConfig.navigation = newConfig.navigation.filter(n => n.entityType !== entity?.name);
    
    // Remove custom fields
    if (entity?.name && newConfig.customFields[entity.name]) {
      delete newConfig.customFields[entity.name];
    }

    // Remove views
    newConfig.views = newConfig.views.filter(v => v.entityType !== entity?.name);
    
    saveConfig(newConfig);
    toast({
      title: "Entity deleted",
      description: `${entity?.label} has been removed`,
    });
  };

  const handleToggleVisibility = (entityId: string) => {
    const newConfig = { ...config };
    const entityIndex = newConfig.customEntities?.findIndex(e => e.id === entityId) ?? -1;
    
    if (entityIndex >= 0 && newConfig.customEntities) {
      newConfig.customEntities[entityIndex].visible = !newConfig.customEntities[entityIndex].visible;
      saveConfig(newConfig);
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newConfig = { ...config };
    const entities = Array.from(newConfig.customEntities || []);
    const [reorderedItem] = entities.splice(result.source.index, 1);
    entities.splice(result.destination.index, 0, reorderedItem);

    newConfig.customEntities = entities.map((entity, index) => ({
      ...entity,
      navigationOrder: index + 1
    }));

    saveConfig(newConfig);
  };

  const handleAddField = () => {
    if (!newField.name || !newField.label || !editingEntityForFields) return;

    const fieldData: CustomField = {
      id: `field_${Date.now()}`,
      name: newField.name!,
      label: newField.label!,
      type: newField.type as any || 'text',
      required: newField.required || false,
      options: newField.options,
      defaultValue: newField.defaultValue,
      order: (editingEntityForFields.fields?.length || 0) + 1,
      visible: newField.visible ?? true
    };

    const newConfig = { ...config };
    const entityIndex = newConfig.customEntities?.findIndex(e => e.id === editingEntityForFields.id) ?? -1;
    
    if (entityIndex >= 0 && newConfig.customEntities) {
      if (!newConfig.customEntities[entityIndex].fields) {
        newConfig.customEntities[entityIndex].fields = [];
      }
      newConfig.customEntities[entityIndex].fields.push(fieldData);

      // Update custom fields
      const entityName = newConfig.customEntities[entityIndex].name;
      if (!newConfig.customFields[entityName]) {
        newConfig.customFields[entityName] = [];
      }
      newConfig.customFields[entityName].push(fieldData);

      saveConfig(newConfig);
      setEditingEntityForFields(newConfig.customEntities[entityIndex]);
    }

    setNewField({
      name: "",
      label: "",
      type: "text",
      required: false,
      visible: true,
      order: 1
    });
  };

  const handleRemoveField = (fieldId: string) => {
    if (!editingEntityForFields) return;

    const newConfig = { ...config };
    const entityIndex = newConfig.customEntities?.findIndex(e => e.id === editingEntityForFields.id) ?? -1;
    
    if (entityIndex >= 0 && newConfig.customEntities) {
      newConfig.customEntities[entityIndex].fields = newConfig.customEntities[entityIndex].fields.filter(f => f.id !== fieldId);

      // Update custom fields
      const entityName = newConfig.customEntities[entityIndex].name;
      if (newConfig.customFields[entityName]) {
        newConfig.customFields[entityName] = newConfig.customFields[entityName].filter(f => f.id !== fieldId);
      }

      saveConfig(newConfig);
      setEditingEntityForFields(newConfig.customEntities[entityIndex]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Entity Management
            </CardTitle>
            <CardDescription>
              Create and manage custom entities like wholesalers, suppliers, etc.
            </CardDescription>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('add-entity') || 'Add Entity'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="entities">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {(config.customEntities || []).map((entity, index) => (
                  <Draggable key={entity.id} draggableId={entity.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex items-center justify-between p-4 border rounded-lg bg-background hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab hover:text-foreground" />
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{entity.navigationIcon}</span>
                            <div>
                              <p className="font-medium">{entity.label}</p>
                              <p className="text-sm text-muted-foreground">
                                {entity.name} • {entity.fields?.length || 0} fields
                                {entity.showInNavigation && " • In Navigation"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditEntityFields(entity)}
                            title="Manage fields"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleVisibility(entity.id)}
                            title={entity.visible ? "Hide entity" : "Show entity"}
                          >
                            {entity.visible ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditEntity(entity)}
                            title="Edit entity"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEntity(entity.id)}
                            title="Delete entity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                {(!config.customEntities || config.customEntities.length === 0) && (
                  <p className="text-center text-muted-foreground py-8">
                    No custom entities defined. Add your first entity to get started.
                  </p>
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </CardContent>

      {/* Entity Creation/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingEntity ? "Edit Entity" : "Add Custom Entity"}
            </DialogTitle>
            <DialogDescription>
              Configure the entity properties and navigation settings
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="entityName" className="text-right">Name</Label>
              <Input
                id="entityName"
                value={newEntity.name || ""}
                onChange={(e) => setNewEntity({ ...newEntity, name: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className="col-span-3"
                placeholder="wholesalers"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="entityLabel" className="text-right">Label</Label>
              <Input
                id="entityLabel"
                value={newEntity.label || ""}
                onChange={(e) => setNewEntity({ ...newEntity, label: e.target.value })}
                className="col-span-3"
                placeholder="Wholesalers"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="entityIcon" className="text-right">Icon</Label>
              <Select
                value={newEntity.navigationIcon}
                onValueChange={(value) => setNewEntity({ ...newEntity, navigationIcon: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {commonIcons.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      {icon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="showInNav" className="text-right">Show in Navigation</Label>
              <Switch
                id="showInNav"
                checked={newEntity.showInNavigation ?? true}
                onCheckedChange={(showInNavigation) => setNewEntity({ ...newEntity, showInNavigation })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="visible" className="text-right">Visible</Label>
              <Switch
                id="visible"
                checked={newEntity.visible ?? true}
                onCheckedChange={(visible) => setNewEntity({ ...newEntity, visible })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('cancel') || 'Cancel'}
            </Button>
            <Button onClick={handleSaveEntity}>
              {editingEntity ? t('update') || 'Update' : t('create') || 'Create'} Entity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Field Management Dialog */}
      <Dialog open={isFieldDialogOpen} onOpenChange={setIsFieldDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Manage Fields - {editingEntityForFields?.label}
            </DialogTitle>
            <DialogDescription>
              Add and configure fields for your custom entity
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Existing Fields */}
            <div>
              <h3 className="text-lg font-medium mb-4">Current Fields</h3>
              <div className="space-y-2">
                {(editingEntityForFields?.fields || []).map((field) => (
                  <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{field.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {field.name} • {field.type} • {field.required ? 'Required' : 'Optional'}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveField(field.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {(!editingEntityForFields?.fields || editingEntityForFields.fields.length === 0) && (
                  <p className="text-center text-muted-foreground py-4">
                    No fields configured yet
                  </p>
                )}
              </div>
            </div>

            {/* Add New Field */}
            <div>
              <h3 className="text-lg font-medium mb-4">Add New Field</h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fieldName">Field Name</Label>
                    <Input
                      id="fieldName"
                      value={newField.name || ""}
                      onChange={(e) => setNewField({ ...newField, name: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                      placeholder="field_name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fieldLabel">Field Label</Label>
                    <Input
                      id="fieldLabel"
                      value={newField.label || ""}
                      onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                      placeholder="Field Label"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fieldType">Field Type</Label>
                    <Select
                      value={newField.type}
                      onValueChange={(value) => setNewField({ ...newField, type: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="fieldRequired"
                        checked={newField.required || false}
                        onCheckedChange={(required) => setNewField({ ...newField, required: !!required })}
                      />
                      <Label htmlFor="fieldRequired">Required</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="fieldVisible"
                        checked={newField.visible ?? true}
                        onCheckedChange={(visible) => setNewField({ ...newField, visible: !!visible })}
                      />
                      <Label htmlFor="fieldVisible">Visible</Label>
                    </div>
                  </div>
                </div>
                <Button onClick={handleAddField} className="w-fit">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Field
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsFieldDialogOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
