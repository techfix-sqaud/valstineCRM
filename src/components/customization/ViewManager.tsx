
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Edit, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ViewConfig } from "@/types/customization";
import { useCustomization } from "@/hooks/useCustomization";
import { useToast } from "@/hooks/use-toast";

const commonIcons = [
  'Eye', 'Users', 'FileText', 'Package', 'BarChart3', 'Calendar', 'Mail', 
  'Phone', 'MapPin', 'Search', 'Star', 'Heart', 'Bookmark', 'Tag', 'Folder'
];

export const ViewManager = () => {
  const { config, addView, updateView, deleteView } = useCustomization();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingView, setEditingView] = useState<ViewConfig | null>(null);
  const [newView, setNewView] = useState<Partial<ViewConfig>>({
    name: "",
    entityType: "client",
    columns: [],
    filters: [],
    isDefault: false,
    showInNavigation: false,
    navigationIcon: "Eye",
  });

  const handleSaveView = () => {
    if (!newView.name || !newView.entityType) {
      toast({
        title: "Error",
        description: "Name and entity type are required",
        variant: "destructive",
      });
      return;
    }

    const viewData: ViewConfig = {
      id: editingView?.id || `view_${Date.now()}`,
      name: newView.name!,
      entityType: newView.entityType as any,
      columns: newView.columns || [],
      filters: newView.filters || [],
      isDefault: newView.isDefault || false,
      showInNavigation: newView.showInNavigation || false,
      navigationIcon: newView.navigationIcon || "Eye",
      navigationOrder: newView.navigationOrder,
      sortBy: newView.sortBy,
      sortOrder: newView.sortOrder,
    };

    if (editingView) {
      updateView(editingView.id, viewData);
      toast({
        title: "View updated",
        description: `${viewData.name} has been updated`,
      });
    } else {
      addView(viewData);
      toast({
        title: "View created",
        description: `${viewData.name} has been created`,
      });
    }

    setIsDialogOpen(false);
    setEditingView(null);
    setNewView({
      name: "",
      entityType: "client",
      columns: [],
      filters: [],
      isDefault: false,
      showInNavigation: false,
      navigationIcon: "Eye",
    });
  };

  const handleEditView = (view: ViewConfig) => {
    setEditingView(view);
    setNewView(view);
    setIsDialogOpen(true);
  };

  const handleDeleteView = (viewId: string) => {
    const view = config.views.find(v => v.id === viewId);
    deleteView(viewId);
    toast({
      title: "View deleted",
      description: `${view?.name} has been removed`,
    });
  };

  // Get available entity types including custom entities
  const getAvailableEntityTypes = () => {
    const defaultTypes = [
      { value: 'client', label: 'Clients' },
      { value: 'invoice', label: 'Invoices' },
      { value: 'inventory', label: 'Inventory' },
      { value: 'user', label: 'Users' }
    ];
    
    const customTypes = (config.customEntities || []).map(entity => ({
      value: entity.name,
      label: entity.label
    }));
    
    return [...defaultTypes, ...customTypes];
  };

  const availableFields = newView.entityType 
    ? config.customFields[newView.entityType] || []
    : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>View Management</CardTitle>
            <CardDescription>
              Create and manage custom views for different entities
            </CardDescription>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add View
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {config.views.map((view) => (
            <div key={view.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <Eye className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{view.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {view.entityType} • {view.columns.length} columns
                      {view.isDefault && " • Default"}
                      {view.showInNavigation && " • In Navigation"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditView(view)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteView(view.id)}
                  disabled={view.isDefault}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {config.views.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No custom views defined. Add your first view to get started.
            </p>
          )}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingView ? "Edit View" : "Create Custom View"}
            </DialogTitle>
            <DialogDescription>
              Configure the view properties and columns
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="viewName" className="text-right">Name</Label>
              <Input
                id="viewName"
                value={newView.name || ""}
                onChange={(e) => setNewView({ ...newView, name: e.target.value })}
                className="col-span-3"
                placeholder="View Name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="entityType" className="text-right">Entity</Label>
              <Select
                value={newView.entityType}
                onValueChange={(value) => setNewView({ ...newView, entityType: value as any, columns: [] })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableEntityTypes().map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right">Columns</Label>
              <div className="col-span-3 space-y-2 max-h-40 overflow-y-auto border rounded p-2">
                {availableFields.map((field) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={field.id}
                      checked={newView.columns?.includes(field.name) || false}
                      onCheckedChange={(checked) => {
                        const columns = newView.columns || [];
                        if (checked) {
                          setNewView({ ...newView, columns: [...columns, field.name] });
                        } else {
                          setNewView({ ...newView, columns: columns.filter(c => c !== field.name) });
                        }
                      }}
                    />
                    <Label htmlFor={field.id} className="text-sm">{field.label}</Label>
                  </div>
                ))}
                {availableFields.length === 0 && (
                  <p className="text-sm text-muted-foreground">No fields available for this entity type</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Default View</Label>
              <Checkbox
                checked={newView.isDefault || false}
                onCheckedChange={(isDefault) => setNewView({ ...newView, isDefault: !!isDefault })}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Show in Navigation</Label>
              <Switch
                checked={newView.showInNavigation || false}
                onCheckedChange={(showInNavigation) => setNewView({ ...newView, showInNavigation })}
              />
            </div>

            {newView.showInNavigation && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="navIcon" className="text-right">Navigation Icon</Label>
                  <Select
                    value={newView.navigationIcon}
                    onValueChange={(value) => setNewView({ ...newView, navigationIcon: value })}
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
                  <Label htmlFor="navOrder" className="text-right">Navigation Order</Label>
                  <Input
                    id="navOrder"
                    type="number"
                    value={newView.navigationOrder || ""}
                    onChange={(e) => setNewView({ ...newView, navigationOrder: parseInt(e.target.value) })}
                    className="col-span-3"
                    placeholder="Order (optional)"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveView}>
              {editingView ? "Update" : "Create"} View
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
