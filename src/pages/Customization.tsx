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
import Layout from "@/components/layout";
import { useCustomization } from "@/hooks/useCustomization";

export default function Customization() {
  const { config, updateConfig } = useCustomization();

  const handleLayoutChange = (navbarPosition: 'sidebar' | 'top') => {
    updateConfig({
      ...config,
      layout: {
        ...config.layout,
        navbarPosition,
      },
    });
  };

  return (
    <Layout
      header={
        <div>
          <h1 className="text-xl font-bold">System Customization</h1>
          <p className="text-sm text-muted-foreground">
            Customize your CRM system to fit your business needs
          </p>
        </div>
      }
    >
      <div className="space-y-6">
        <Tabs defaultValue="fields" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="fields">Custom Fields</TabsTrigger>
            <TabsTrigger value="views">Views</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
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
            <Card>
              <CardHeader>
                <CardTitle>Workflows</CardTitle>
                <CardDescription>
                  Automate tasks and processes with custom workflows
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  {/* Example Workflow */}
                  <Label htmlFor="newClientWorkflow">New Client Workflow</Label>
                  <Input id="newClientWorkflow" defaultValue="Send Welcome Email" className="mt-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="navigation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Navigation</CardTitle>
                <CardDescription>
                  Customize the navigation menu for your CRM
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  {/* Example Navigation Item */}
                  <Label htmlFor="dashboardLink">Dashboard Link</Label>
                  <Input id="dashboardLink" defaultValue="Dashboard" className="mt-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard</CardTitle>
                <CardDescription>
                  Customize the widgets and layout of your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  {/* Example Dashboard Widget */}
                  <Label htmlFor="salesWidget">Sales Widget</Label>
                  <Input id="salesWidget" defaultValue="Sales Chart" className="mt-2" />
                </div>
              </CardContent>
            </Card>
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
                  <h3 className="text-lg font-medium">Navigation Position</h3>
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
                        <h4 className="font-medium">Sidebar Navigation</h4>
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
                        <h4 className="font-medium">Top Navigation</h4>
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
    </Layout>
  );
}
