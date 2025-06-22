
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Layout from "@/components/layout";
import { useCustomization } from "@/hooks/useCustomization";
import { WorkflowManager } from "@/components/customization/WorkflowManager";
import { DashboardManager } from "@/components/customization/DashboardManager";
import { NavigationManager } from "@/components/customization/NavigationManager";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { EntityManager } from "@/components/customization/EntityManager";

export default function Customization() {
  const { config, saveConfig } = useCustomization();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [pendingNavbarPosition, setPendingNavbarPosition] = useState<'sidebar' | 'top' | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleLayoutChange = (navbarPosition: 'sidebar' | 'top') => {
    if (config.layout.navbarPosition !== navbarPosition) {
      setPendingNavbarPosition(navbarPosition);
      setSaveDialogOpen(true);
    }
  };

  const confirmLayoutChange = async () => {
    if (!pendingNavbarPosition) return;
    
    setIsSaving(true);
    
    const newConfig = {
      ...config,
      layout: {
        ...config.layout,
        navbarPosition: pendingNavbarPosition,
      },
    };
    
    saveConfig(newConfig);
    
    // Simulate saving delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    setSaveDialogOpen(false);
    setPendingNavbarPosition(null);
    
    toast({
      title: t('layout-updated'),
      description: t('changes-saved'),
    });
    
    // Refresh the page to apply layout changes
    window.location.reload();
  };

  return (
    <Layout
      header={
        <div>
          <h1 className="text-xl font-bold">{t('customization')}</h1>
          <p className="text-sm text-muted-foreground">
            Customize your CRM system to fit your business needs
          </p>
        </div>
      }
    >
      <div className="space-y-6">
        <Tabs defaultValue="fields" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="fields">{t('custom-fields')}</TabsTrigger>
            <TabsTrigger value="views">{t('views')}</TabsTrigger>
            <TabsTrigger value="workflows">{t('workflows')}</TabsTrigger>
            <TabsTrigger value="navigation">{t('navigation')}</TabsTrigger>
            <TabsTrigger value="entities">{t('entities') || 'Entities'}</TabsTrigger>
            <TabsTrigger value="dashboard">{t('dashboard')}</TabsTrigger>
            <TabsTrigger value="layout">{t('layout')}</TabsTrigger>
          </TabsList>

          <TabsContent value="fields" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Custom Fields</CardTitle>
                <CardDescription>
                  Manage custom fields for different entities in your CRM
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  {/* Example Custom Field */}
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" defaultValue="Acme Inc." className="mt-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="views" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Views</CardTitle>
                <CardDescription>
                  Customize the views for different entities in your CRM
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  {/* Example View */}
                  <Label htmlFor="defaultView">Default View</Label>
                  <Select>
                    <SelectTrigger className="mt-2 w-full">
                      <SelectValue placeholder="Clients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clients">Clients</SelectItem>
                      <SelectItem value="invoices">Invoices</SelectItem>
                      <SelectItem value="inventory">Inventory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflows" className="space-y-6">
            <WorkflowManager />
          </TabsContent>

          <TabsContent value="navigation" className="space-y-6">
            <NavigationManager />
          </TabsContent>

          <TabsContent value="entities" className="space-y-6">
            <EntityManager />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardManager />
          </TabsContent>

          <TabsContent value="layout" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Layout Configuration</CardTitle>
                <CardDescription>
                  Configure the overall layout and navigation style of your CRM
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('navigation-position')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        config.layout.navbarPosition === 'sidebar'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleLayoutChange('sidebar')}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-4 h-4 rounded-full border-2 border-primary">
                          {config.layout.navbarPosition === 'sidebar' && (
                            <div className="w-2 h-2 rounded-full bg-primary m-0.5" />
                          )}
                        </div>
                        <h4 className="font-medium">{t('sidebar-navigation')}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Traditional sidebar layout with collapsible navigation
                      </p>
                      <div className="mt-3 border rounded p-2 bg-muted/30">
                        <div className="flex">
                          <div className="w-12 bg-primary/20 h-8 rounded-sm mr-2"></div>
                          <div className="flex-1 bg-muted h-8 rounded-sm"></div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        config.layout.navbarPosition === 'top'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleLayoutChange('top')}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-4 h-4 rounded-full border-2 border-primary">
                          {config.layout.navbarPosition === 'top' && (
                            <div className="w-2 h-2 rounded-full bg-primary m-0.5" />
                          )}
                        </div>
                        <h4 className="font-medium">{t('top-navigation')}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Modern top navigation bar with dropdown menus
                      </p>
                      <div className="mt-3 border rounded p-2 bg-muted/30">
                        <div className="bg-primary/20 h-3 rounded-sm mb-2"></div>
                        <div className="bg-muted h-8 rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Save Confirmation Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('layout-updated')}</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the navigation layout? This will refresh the page to apply changes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)} disabled={isSaving}>
              {t('cancel')}
            </Button>
            <Button onClick={confirmLayoutChange} disabled={isSaving}>
              {isSaving ? t('saving') : t('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
