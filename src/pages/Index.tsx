
import { useState } from "react";
import Layout from "@/components/layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentActivities } from "@/components/dashboard/recent-activities";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks";
import { Users, FileText, Package, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
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
        title: "Task completed",
        description: `"${task.title}" marked as complete`,
      });
    }
  };

  const handleRunAutomation = () => {
    toast({
      title: "Automation running",
      description: "Client follow-up emails are being sent",
    });
  };

  return (
    <Layout
      header={
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, here's an overview of your business
            </p>
          </div>
          <Button onClick={handleRunAutomation}>Run Automation</Button>
        </div>
      }
    >
      <div className="grid gap-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Clients"
            value="145"
            icon={<Users className="h-5 w-5" />}
            change={{ value: "12%", positive: true }}
          />
          <StatCard
            title="Invoices Pending"
            value="23"
            icon={<FileText className="h-5 w-5" />}
            change={{ value: "5%", positive: false }}
          />
          <StatCard
            title="Inventory Items"
            value="738"
            icon={<Package className="h-5 w-5" />}
            change={{ value: "8%", positive: true }}
          />
          <StatCard
            title="Total Revenue"
            value="$38,500"
            icon={<Wallet className="h-5 w-5" />}
            change={{ value: "15%", positive: true }}
          />
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="col-span-2">
            <SalesChart />
          </div>
          <div>
            <RecentActivities activities={recentActivities} />
          </div>
        </div>
        
        <div>
          <UpcomingTasks tasks={tasks} onTaskComplete={handleTaskComplete} />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
