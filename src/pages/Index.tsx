
import { useState } from "react";
import Layout from "@/components/layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentActivities } from "@/components/dashboard/recent-activities";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks";
import { AutomationConfig } from "@/components/automation/AutomationConfig";
import { Users, FileText, Package, Wallet, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCustomization } from "@/hooks/useCustomization";
import * as icons from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const Dashboard = () => {
  const { toast } = useToast();
  const { config } = useCustomization();
  const { t } = useLanguage();
  const [automationConfigOpen, setAutomationConfigOpen] = useState(false);
  
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
          <Button onClick={handleRunAutomation} className="hidden sm:flex">
            {t('run-automation')}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
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
