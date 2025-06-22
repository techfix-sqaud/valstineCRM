
import { useState } from "react";
import Layout from "@/components/layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentActivities } from "@/components/dashboard/recent-activities";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks";
import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { AdvancedSearch } from "@/components/search/advanced-search";
import { TaskManager } from "@/components/tasks/task-manager";
import { AutomationConfig } from "@/components/automation/AutomationConfig";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Users, FileText, Package, Wallet, Circle, TrendingUp, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCustomization } from "@/hooks/useCustomization";
import * as icons from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const { toast } = useToast();
  const { config } = useCustomization();
  const { t } = useLanguage();
  const [automationConfigOpen, setAutomationConfigOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Follow up with Client XYZ",
      completed: false,
      priority: "high" as const,
      dueDate: "Today, 5:00 PM",
    },
    {
      id: 2,
      title: "Complete invoice #1234",
      completed: false,
      priority: "medium" as const,
      dueDate: "Tomorrow, 12:00 PM",
    },
    {
      id: 3,
      title: "Update inventory levels",
      completed: false,
      priority: "low" as const,
      dueDate: "May 25, 2023",
    },
    {
      id: 4,
      title: "Review sales targets",
      completed: false,
      priority: "medium" as const,
      dueDate: "May 26, 2023",
    },
  ]);

  const recentActivities = [
    {
      id: 1,
      user: {
        name: "John Doe",
        initials: "JD",
      },
      action: "created a new invoice for Client ABC",
      time: "10 minutes ago",
    },
    {
      id: 2,
      user: {
        name: "Jane Smith",
        initials: "JS",
      },
      action: "added 5 new inventory items",
      time: "30 minutes ago",
    },
    {
      id: 3,
      user: {
        name: "Mike Johnson",
        initials: "MJ",
      },
      action: "completed a task",
      time: "1 hour ago",
    },
    {
      id: 4,
      user: {
        name: "Lisa Brown",
        initials: "LB",
      },
      action: "updated client XYZ information",
      time: "2 hours ago",
    },
  ];

  // Sample analytics data
  const salesTrendData = [
    { month: 'Jan', revenue: 4000, clients: 12 },
    { month: 'Feb', revenue: 3000, clients: 8 },
    { month: 'Mar', revenue: 5000, clients: 15 },
    { month: 'Apr', revenue: 4500, clients: 13 },
    { month: 'May', revenue: 6000, clients: 18 },
    { month: 'Jun', revenue: 5500, clients: 16 }
  ];

  const clientEngagementData = [
    { category: 'New Clients', value: 24 },
    { category: 'Returning Clients', value: 56 },
    { category: 'Inactive Clients', value: 12 }
  ];

  const handleTaskComplete = (id: number, completed: boolean) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed } : task
      )
    );
    
    const task = tasks.find((t) => t.id === id);
    if (task && completed) {
      toast({
        title: t('task-completed'),
        description: `"${task.title}" marked as complete`,
      });
    }
  };

  const handleRunAutomation = () => {
    setAutomationConfigOpen(true);
  };

  const handleAutomationSave = (automationConfig: any) => {
    console.log('Automation config saved:', automationConfig);
    toast({
      title: t('automation-running'),
      description: t('client-followup-emails'),
    });
  };

  const handleSearch = (filters: any) => {
    setIsLoading(true);
    console.log('Searching with filters:', filters);
    
    // Simulate search delay
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Search completed",
        description: `Found results for "${filters.query || 'all items'}"`,
      });
    }, 1000);
  };

  const handleSearchReset = () => {
    toast({
      title: "Filters reset",
      description: "All search filters have been cleared",
    });
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (icons as any)[iconName];
    return IconComponent || Circle;
  };

  // Get visible widgets sorted by position
  const visibleWidgets = config.dashboardWidgets
    .filter(widget => widget.visible)
    .sort((a, b) => a.position.y - b.position.y || a.position.x - b.position.x);

  const renderWidget = (widget: any) => {
    switch (widget.type) {
      case 'stat':
        const IconComponent = getIcon(widget.config.icon || 'Circle');
        return (
          <StatCard
            key={widget.id}
            title={widget.title}
            value={widget.config.value || "0"}
            icon={<IconComponent className="h-5 w-5" />}
            change={widget.config.change}
          />
        );
      case 'chart':
        return (
          <div key={widget.id} className={widget.size === 'large' ? 'col-span-2' : ''}>
            <SalesChart />
          </div>
        );
      case 'activity':
        return (
          <div key={widget.id}>
            <RecentActivities activities={recentActivities} />
          </div>
        );
      case 'tasks':
        return (
          <div key={widget.id} className={widget.size === 'large' ? 'col-span-full' : ''}>
            <UpcomingTasks tasks={tasks} onTaskComplete={handleTaskComplete} />
          </div>
        );
      default:
        return (
          <div key={widget.id} className="p-4 border rounded-lg">
            <h3 className="font-medium">{widget.title}</h3>
            <p className="text-sm text-muted-foreground">Custom widget content</p>
          </div>
        );
    }
  };

  return (
    <Layout
      header={
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{t('dashboard')}</h1>
            <p className="text-sm text-muted-foreground">
              {t('welcome-back')}
            </p>
          </div>
          <div className="flex gap-2">
            {isLoading && <LoadingSpinner size="sm" />}
            <Button onClick={handleRunAutomation} className="hidden sm:flex">
              {t('run-automation')}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Advanced Search */}
        <AdvancedSearch 
          onSearch={handleSearch}
          onReset={handleSearchReset}
          placeholder="Search clients, invoices, inventory..."
        />

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">{t('dashboard')}</TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="tasks">Task Management</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Responsive grid for widgets */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-min">
              {visibleWidgets.map(renderWidget)}
            </div>
            
            {visibleWidgets.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {t('no-widgets-configured')}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <AnalyticsChart
                title="Revenue Trend"
                description="Monthly revenue and client acquisition"
                data={salesTrendData}
                type="line"
                dataKey="revenue"
                xAxisKey="month"
              />
              <AnalyticsChart
                title="Client Engagement"
                description="Client status distribution"
                data={clientEngagementData}
                type="bar"
                dataKey="value"
                xAxisKey="category"
              />
            </div>
            
            {/* Performance Metrics */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Growth Rate"
                value="12.5%"
                icon={<TrendingUp className="h-5 w-5" />}
                change={{ value: '2.1%', positive: true }}
              />
              <StatCard
                title="Conversion Rate"
                value="8.3%"
                icon={<BarChart3 className="h-5 w-5" />}
                change={{ value: '0.8%', positive: true }}
              />
              <StatCard
                title="Avg Deal Size"
                value="$2,450"
                icon={<Wallet className="h-5 w-5" />}
                change={{ value: '5.2%', positive: false }}
              />
              <StatCard
                title="Customer Lifetime Value"
                value="$12,300"
                icon={<Users className="h-5 w-5" />}
                change={{ value: '15.7%', positive: true }}
              />
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <TaskManager />
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <RecentActivities activities={recentActivities} />
          </TabsContent>
        </Tabs>
      </div>
      
      <AutomationConfig
        open={automationConfigOpen}
        onOpenChange={setAutomationConfigOpen}
        onSave={handleAutomationSave}
      />
    </Layout>
  );
};

export default Dashboard;
