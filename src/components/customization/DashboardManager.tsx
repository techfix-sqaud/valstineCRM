
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Edit, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DashboardWidget } from "@/types/customization";
import { useCustomization } from "@/hooks/useCustomization";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

const widgetTypes = [
  { value: 'stat', label: 'Statistic Card' },
  { value: 'chart', label: 'Chart' },
  { value: 'activity', label: 'Activity Feed' },
  { value: 'tasks', label: 'Task List' },
  { value: 'custom', label: 'Custom Widget' }
];

const widgetSizes = [
  { value: 'small', label: 'Small (1x1)' },
  { value: 'medium', label: 'Medium (2x1)' },
  { value: 'large', label: 'Large (2x2)' }
];

export const DashboardManager = () => {
  const { config, addWidget, updateWidget, deleteWidget } = useCustomization();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWidget, setEditingWidget] = useState<DashboardWidget | null>(null);
  const [newWidget, setNewWidget] = useState<Partial<DashboardWidget>>({
    title: "",
    type: "stat",
    size: "small",
    visible: true,
    config: {},
  });

  const handleSaveWidget = () => {
    if (!newWidget.title || !newWidget.type) {
      toast({
        title: "Error",
        description: "Title and type are required",
        variant: "destructive",
      });
      return;
    }

    const widgetData: DashboardWidget = {
      id: editingWidget?.id || `widget_${Date.now()}`,
      title: newWidget.title!,
      type: newWidget.type as any,
      size: newWidget.size as any || "small",
      position: editingWidget?.position || { x: 0, y: 0 },
      visible: newWidget.visible ?? true,
      config: newWidget.config || {},
    };

    if (editingWidget) {
      updateWidget(editingWidget.id, widgetData);
      toast({
        title: "Widget updated",
        description: `${widgetData.title} has been updated`,
      });
    } else {
      addWidget(widgetData);
      toast({
        title: "Widget created",
        description: `${widgetData.title} has been added`,
      });
    }

    setIsDialogOpen(false);
    setEditingWidget(null);
    setNewWidget({
      title: "",
      type: "stat",
      size: "small",
      visible: true,
      config: {},
    });
  };

  const handleEditWidget = (widget: DashboardWidget) => {
    setEditingWidget(widget);
    setNewWidget(widget);
    setIsDialogOpen(true);
  };

  const handleDeleteWidget = (widgetId: string) => {
    const widget = config.dashboardWidgets.find(w => w.id === widgetId);
    deleteWidget(widgetId);
    toast({
      title: "Widget deleted",
      description: `${widget?.title} has been removed`,
    });
  };

  const handleToggleVisibility = (widgetId: string) => {
    const widget = config.dashboardWidgets.find(w => w.id === widgetId);
    if (widget) {
      updateWidget(widgetId, { visible: !widget.visible });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t('dashboard-widgets')}</CardTitle>
            <CardDescription>
              Manage dashboard widgets and their visibility
            </CardDescription>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('add-widget')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {config.dashboardWidgets.map((widget) => (
            <div key={widget.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{widget.title}</h4>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleVisibility(widget.id)}
                  >
                    {widget.visible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditWidget(widget)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteWidget(widget.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Type: {widget.type}</p>
                <p>Size: {widget.size}</p>
                <p>Position: {widget.position.x}, {widget.position.y}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingWidget ? t('edit-widget') : t('add-widget')}
            </DialogTitle>
            <DialogDescription>
              Configure the widget properties
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">{t('widget-title')}</Label>
              <Input
                id="title"
                value={newWidget.title || ""}
                onChange={(e) => setNewWidget({ ...newWidget, title: e.target.value })}
                className="col-span-3"
                placeholder="Widget Title"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">{t('widget-type')}</Label>
              <Select
                value={newWidget.type}
                onValueChange={(value) => setNewWidget({ ...newWidget, type: value as any })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {widgetTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="size" className="text-right">{t('widget-size')}</Label>
              <Select
                value={newWidget.size}
                onValueChange={(value) => setNewWidget({ ...newWidget, size: value as any })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {widgetSizes.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {t(size.value)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="visible" className="text-right">{t('widget-visible')}</Label>
              <Switch
                id="visible"
                checked={newWidget.visible ?? true}
                onCheckedChange={(visible) => setNewWidget({ ...newWidget, visible })}
              />
            </div>
            
            {/* Additional configuration based on widget type */}
            {newWidget.type === 'stat' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="value" className="text-right">Value</Label>
                  <Input
                    id="value"
                    value={newWidget.config?.value || ""}
                    onChange={(e) => setNewWidget({ 
                      ...newWidget, 
                      config: { ...newWidget.config, value: e.target.value }
                    })}
                    className="col-span-3"
                    placeholder="e.g., 145"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="icon" className="text-right">Icon</Label>
                  <Input
                    id="icon"
                    value={newWidget.config?.icon || ""}
                    onChange={(e) => setNewWidget({ 
                      ...newWidget, 
                      config: { ...newWidget.config, icon: e.target.value }
                    })}
                    className="col-span-3"
                    placeholder="e.g., Users"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSaveWidget}>
              {editingWidget ? t('update') : t('create')} Widget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
