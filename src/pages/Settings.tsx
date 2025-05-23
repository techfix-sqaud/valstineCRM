
import { useState } from "react";
import Layout from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [companyInfo, setCompanyInfo] = useState({
    name: "My Business",
    address: "123 Business St, Business City",
    phone: "(555) 123-4567",
    email: "contact@mybusiness.com",
    website: "www.mybusiness.com",
    taxId: "12-3456789",
  });

  const [userSettings, setUserSettings] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "********",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    invoiceReminders: true,
    newClientNotifications: true,
    inventoryAlerts: true,
  });

  const [automationSettings, setAutomationSettings] = useState({
    clientFollowUps: true,
    invoiceReminders: true,
    inventoryAlerts: false,
    reportGeneration: true,
  });

  const handleCompanyInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationToggle = (value: boolean, key: string) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleAutomationToggle = (value: boolean, key: string) => {
    setAutomationSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    });
  };

  return (
    <Layout
      header={
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Settings</h1>
          <Button onClick={handleSaveSettings}>Save Changes</Button>
        </div>
      }
    >
      <Tabs defaultValue="company">
        <TabsList className="mb-6">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="user">User</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Update your company details and business information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={companyInfo.name}
                    onChange={handleCompanyInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID / EIN</Label>
                  <Input
                    id="taxId"
                    name="taxId"
                    value={companyInfo.taxId}
                    onChange={handleCompanyInfoChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={companyInfo.address}
                  onChange={handleCompanyInfoChange}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={companyInfo.phone}
                    onChange={handleCompanyInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={companyInfo.email}
                    onChange={handleCompanyInfoChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={companyInfo.website}
                  onChange={handleCompanyInfoChange}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user">
          <Card>
            <CardHeader>
              <CardTitle>User Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={userSettings.firstName}
                    onChange={handleUserSettingsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={userSettings.lastName}
                    onChange={handleUserSettingsChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userEmail">Email</Label>
                <Input
                  id="userEmail"
                  name="email"
                  value={userSettings.email}
                  onChange={handleUserSettingsChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="flex gap-2">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={userSettings.password}
                    onChange={handleUserSettingsChange}
                    readOnly
                  />
                  <Button variant="outline">Change</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications about important updates
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(value) =>
                      handleNotificationToggle(value, "emailNotifications")
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Invoice Reminders</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when invoices are due or overdue
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.invoiceReminders}
                    onCheckedChange={(value) =>
                      handleNotificationToggle(value, "invoiceReminders")
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Client Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts when new clients are added
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.newClientNotifications}
                    onCheckedChange={(value) =>
                      handleNotificationToggle(value, "newClientNotifications")
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Inventory Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when inventory items are low or out of stock
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.inventoryAlerts}
                    onCheckedChange={(value) =>
                      handleNotificationToggle(value, "inventoryAlerts")
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation">
          <Card>
            <CardHeader>
              <CardTitle>Automation Settings</CardTitle>
              <CardDescription>
                Configure automated tasks and workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Client Follow-ups</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically send follow-up emails to clients
                    </p>
                  </div>
                  <Switch
                    checked={automationSettings.clientFollowUps}
                    onCheckedChange={(value) =>
                      handleAutomationToggle(value, "clientFollowUps")
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Invoice Reminders</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically send invoice reminders before due dates
                    </p>
                  </div>
                  <Switch
                    checked={automationSettings.invoiceReminders}
                    onCheckedChange={(value) =>
                      handleAutomationToggle(value, "invoiceReminders")
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Inventory Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically notify when inventory is running low
                    </p>
                  </div>
                  <Switch
                    checked={automationSettings.inventoryAlerts}
                    onCheckedChange={(value) =>
                      handleAutomationToggle(value, "inventoryAlerts")
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Report Generation</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically generate and send weekly/monthly reports
                    </p>
                  </div>
                  <Switch
                    checked={automationSettings.reportGeneration}
                    onCheckedChange={(value) =>
                      handleAutomationToggle(value, "reportGeneration")
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Settings;
