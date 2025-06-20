
import Layout from "@/components/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomFieldManager } from "@/components/customization/CustomFieldManager";
import { ViewManager } from "@/components/customization/ViewManager";
import { WorkflowManager } from "@/components/customization/WorkflowManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCustomization } from "@/hooks/useCustomization";
import { useToast } from "@/hooks/use-toast";
import { Settings, Palette, Wand2, Eye, Zap } from "lucide-react";

const Customization = () => {
  const { config, saveConfig } = useCustomization();
  const { toast } = useToast();

  const handleBrandingUpdate = (field: string, value: string) => {
    const newConfig = {
      ...config,
      branding: {
        ...config.branding,
        [field]: value,
      },
    };
    saveConfig(newConfig);
    toast({
      title: "Branding updated",
      description: "Your branding settings have been saved",
    });
  };

  return (
    <Layout
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6" />
            <div>
              <h1 className="text-xl font-bold">System Customization</h1>
              <p className="text-sm text-muted-foreground">
                Configure your CRM to match your business needs
              </p>
            </div>
          </div>
        </div>
      }
    >
      <Tabs defaultValue="fields" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="fields" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Fields
          </TabsTrigger>
          <TabsTrigger value="views" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Views
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fields" className="space-y-6">
          <CustomFieldManager entityType="client" />
          <CustomFieldManager entityType="invoice" />
          <CustomFieldManager entityType="inventory" />
        </TabsContent>

        <TabsContent value="views">
          <ViewManager />
        </TabsContent>

        <TabsContent value="workflows">
          <WorkflowManager />
        </TabsContent>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Brand Configuration</CardTitle>
              <CardDescription>
                Customize the appearance and branding of your CRM
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={config.branding.companyName}
                    onChange={(e) => handleBrandingUpdate('companyName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={config.branding.primaryColor}
                      onChange={(e) => handleBrandingUpdate('primaryColor', e.target.value)}
                      className="w-20"
                    />
                    <Input
                      value={config.branding.primaryColor}
                      onChange={(e) => handleBrandingUpdate('primaryColor', e.target.value)}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={config.branding.secondaryColor}
                      onChange={(e) => handleBrandingUpdate('secondaryColor', e.target.value)}
                      className="w-20"
                    />
                    <Input
                      value={config.branding.secondaryColor}
                      onChange={(e) => handleBrandingUpdate('secondaryColor', e.target.value)}
                      placeholder="#64748b"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>User Permissions</CardTitle>
              <CardDescription>
                Configure user roles and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(config.permissions).map(([role, permissions]) => (
                  <div key={role} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium capitalize">{role}</p>
                      <p className="text-sm text-muted-foreground">
                        {permissions.join(', ')}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Customization;
