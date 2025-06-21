
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Edit, GripVertical, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NavigationItem } from "@/types/customization";
import { useCustomization } from "@/hooks/useCustomization";
import { useToast } from "@/hooks/use-toast";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const commonIcons = [
  'Home', 'Users', 'FileText', 'Package', 'BarChart3', 'Settings', 'CreditCard',
  'Calendar', 'Mail', 'Phone', 'MapPin', 'Search', 'Plus', 'Minus', 'Edit',
  'Trash2', 'Eye', 'Heart', 'Star', 'Bookmark', 'Tag', 'Folder', 'File'
];

export const NavigationManager = () => {
  const { config, updateNavigation } = useCustomization();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<NavigationItem>>({
    title: "",
    path: "",
    icon: "Circle",
    visible: true,
  });

  const handleSaveItem = () => {
    if (!newItem.title || !newItem.path) {
      toast({
        title: "Error",
        description: "Title and path are required",
        variant: "destructive",
      });
      return;
    }

    const itemData: NavigationItem = {
      id: editingItem?.id || `nav_${Date.now()}`,
      title: newItem.title!,
      path: newItem.path!,
      icon: newItem.icon || "Circle",
      order: editingItem?.order || config.navigation.length + 1,
      visible: newItem.visible ?? true,
      isCustom: true,
    };

    let updatedNavigation;
    if (editingItem) {
      updatedNavigation = config.navigation.map(item => 
        item.id === editingItem.id ? itemData : item
      );
      toast({
        title: "Navigation updated",
        description: `${itemData.title} has been updated`,
      });
    } else {
      updatedNavigation = [...config.navigation, itemData];
      toast({
        title: "Navigation item created",
        description: `${itemData.title} has been added`,
      });
    }

    updateNavigation(updatedNavigation);
    setIsDialogOpen(false);
    setEditingItem(null);
    setNewItem({
      title: "",
      path: "",
      icon: "Circle",
      visible: true,
    });
  };

  const handleEditItem = (item: NavigationItem) => {
    setEditingItem(item);
    setNewItem(item);
    setIsDialogOpen(true);
  };

  const handleDeleteItem = (itemId: string) => {
    const item = config.navigation.find(n => n.id === itemId);
    if (item && !item.isCustom) {
      toast({
        title: "Cannot delete",
        description: "Default navigation items cannot be deleted",
        variant: "destructive",
      });
      return;
    }

    const updatedNavigation = config.navigation.filter(n => n.id !== itemId);
    updateNavigation(updatedNavigation);
    toast({
      title: "Navigation item deleted",
      description: `${item?.title} has been removed`,
    });
  };

  const handleToggleVisibility = (itemId: string) => {
    const updatedNavigation = config.navigation.map(item =>
      item.id === itemId ? { ...item, visible: !item.visible } : item
    );
    updateNavigation(updatedNavigation);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(config.navigation);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order numbers
    const updatedNavigation = items.map((item, index) => ({
      ...item,
      order: index + 1
    }));

    updateNavigation(updatedNavigation);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Navigation Management</CardTitle>
            <CardDescription>
              Customize the navigation menu items and their order
            </CardDescription>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="navigation">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {config.navigation
                  .sort((a, b) => a.order - b.order)
                  .map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center justify-between p-4 border rounded-lg bg-background"
                        >
                          <div className="flex items-center gap-4">
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{item.icon}</span>
                              <div>
                                <p className="font-medium">{item.title}</p>
                                <p className="text-sm text-muted-foreground">{item.path}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleVisibility(item.id)}
                            >
                              {item.visible ? (
                                <Eye className="h-4 w-4" />
                              ) : (
                                <EyeOff className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditItem(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteItem(item.id)}
                              disabled={!item.isCustom}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Navigation Item" : "Add Navigation Item"}
            </DialogTitle>
            <DialogDescription>
              Configure the navigation item properties
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input
                id="title"
                value={newItem.title || ""}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                className="col-span-3"
                placeholder="Navigation Title"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="path" className="text-right">Path</Label>
              <Input
                id="path"
                value={newItem.path || ""}
                onChange={(e) => setNewItem({ ...newItem, path: e.target.value })}
                className="col-span-3"
                placeholder="/path"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="icon" className="text-right">Icon</Label>
              <Select
                value={newItem.icon}
                onValueChange={(value) => setNewItem({ ...newItem, icon: value })}
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
              <Label htmlFor="visible" className="text-right">Visible</Label>
              <Switch
                id="visible"
                checked={newItem.visible ?? true}
                onCheckedChange={(visible) => setNewItem({ ...newItem, visible })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveItem}>
              {editingItem ? "Update" : "Create"} Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
