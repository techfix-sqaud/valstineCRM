
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Edit, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WorkflowConfig } from "@/types/customization";
import { useCustomization } from "@/hooks/useCustomization";
import { useToast } from "@/hooks/use-toast";

export const WorkflowManager = () => {
  const { config, addWorkflow, updateWorkflow, deleteWorkflow } = useCustomization();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<WorkflowConfig | null>(null);
  const [newWorkflow, setNewWorkflow] = useState<Partial<WorkflowConfig>>({
    name: "",
    entityType: "client",
    trigger: "create",
    conditions: [],
    actions: [],
    active: true,
  });

  const handleSaveWorkflow = () => {
    if (!newWorkflow.name || !newWorkflow.entityType) {
      toast({
        title: "Error",
        description: "Name and entity type are required",
        variant: "destructive",
      });
      return;
    }

    const workflowData: WorkflowConfig = {
      id: editingWorkflow?.id || `workflow_${Date.now()}`,
      name: newWorkflow.name!,
      entityType: newWorkflow.entityType as any,
      trigger: newWorkflow.trigger!,
      conditions: newWorkflow.conditions || [],
      actions: newWorkflow.actions || [],
      active: newWorkflow.active !== false,
    };

    if (editingWorkflow) {
      updateWorkflow(editingWorkflow.id, workflowData);
      toast({
        title: "Workflow updated",
        description: `${workflowData.name} has been updated`,
      });
    } else {
      addWorkflow(workflowData);
      toast({
        title: "Workflow created",
        description: `${workflowData.name} has been created`,
      });
    }

    setIsDialogOpen(false);
    setEditingWorkflow(null);
    setNewWorkflow({
      name: "",
      entityType: "client",
      trigger: "create",
      conditions: [],
      actions: [],
      active: true,
    });
  };

  const handleEditWorkflow = (workflow: WorkflowConfig) => {
    setEditingWorkflow(workflow);
    setNewWorkflow(workflow);
    setIsDialogOpen(true);
  };

  const handleDeleteWorkflow = (workflowId: string) => {
    const workflow = config.workflows.find(w => w.id === workflowId);
    deleteWorkflow(workflowId);
    toast({
      title: "Workflow deleted",
      description: `${workflow?.name} has been removed`,
    });
  };

  const handleToggleWorkflow = (workflowId: string, active: boolean) => {
    updateWorkflow(workflowId, { active });
    toast({
      title: `Workflow ${active ? 'activated' : 'deactivated'}`,
      description: `Workflow has been ${active ? 'enabled' : 'disabled'}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Workflow Automation</CardTitle>
            <CardDescription>
              Create automated workflows to streamline your business processes
            </CardDescription>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Workflow
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {config.workflows.map((workflow) => (
            <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <Zap className={`h-5 w-5 ${workflow.active ? 'text-green-500' : 'text-gray-400'}`} />
                  <div>
                    <p className="font-medium">{workflow.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {workflow.entityType} • {workflow.trigger} • {workflow.actions.length} actions
                      {!workflow.active && " • Inactive"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={workflow.active}
                  onCheckedChange={(active) => handleToggleWorkflow(workflow.id, active)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditWorkflow(workflow)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteWorkflow(workflow.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {config.workflows.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No workflows defined. Create your first workflow to automate business processes.
            </p>
          )}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingWorkflow ? "Edit Workflow" : "Create Workflow"}
            </DialogTitle>
            <DialogDescription>
              Configure automated workflow rules
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="workflowName" className="text-right">Name</Label>
              <Input
                id="workflowName"
                value={newWorkflow.name || ""}
                onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                className="col-span-3"
                placeholder="Workflow Name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="entityType" className="text-right">Entity</Label>
              <Select
                value={newWorkflow.entityType}
                onValueChange={(value) => setNewWorkflow({ ...newWorkflow, entityType: value as any })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Clients</SelectItem>
                  <SelectItem value="invoice">Invoices</SelectItem>
                  <SelectItem value="inventory">Inventory</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="trigger" className="text-right">Trigger</Label>
              <Select
                value={newWorkflow.trigger}
                onValueChange={(value) => setNewWorkflow({ ...newWorkflow, trigger: value as any })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="create">On Create</SelectItem>
                  <SelectItem value="update">On Update</SelectItem>
                  <SelectItem value="delete">On Delete</SelectItem>
                  <SelectItem value="status_change">On Status Change</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Active</Label>
              <Switch
                checked={newWorkflow.active !== false}
                onCheckedChange={(active) => setNewWorkflow({ ...newWorkflow, active })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveWorkflow}>
              {editingWorkflow ? "Update" : "Create"} Workflow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
