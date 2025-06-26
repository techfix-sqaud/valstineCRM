import { useState } from "react";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";

const salesData = [
  { month: "Jan", revenue: 4000, expenses: 2400 },
  { month: "Feb", revenue: 3000, expenses: 1398 },
  { month: "Mar", revenue: 9800, expenses: 2000 },
  { month: "Apr", revenue: 2780, expenses: 3908 },
  { month: "May", revenue: 1890, expenses: 4800 },
  { month: "Jun", revenue: 2390, expenses: 3800 },
];

const clientData = [
  { name: "Active", value: 65 },
  { name: "Inactive", value: 20 },
  { name: "Lead", value: 15 },
];

const inventoryData = [
  { category: "Electronics", count: 45, value: 12000 },
  { category: "Furniture", count: 20, value: 8000 },
  { category: "Accessories", count: 30, value: 3000 },
  { category: "Office Supplies", count: 60, value: 5000 },
];

const COLORS = ["#2563eb", "#4f46e5", "#7c3aed", "#db2777", "#dc2626"];

const Reports = () => {
  const { resolvedTheme } = useTheme();
  const { toast } = useToast();
  const isDark = resolvedTheme === "dark";
  
  const textColor = isDark ? "#cbd5e1" : "#64748b";
  const gridColor = isDark ? "#334155" : "#e2e8f0";
  const backgroundColor = isDark ? "#1e293b" : "#ffffff";

  const exportToCSV = (data: any[], filename: string) => {
    if (!data.length) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: `${filename} has been exported to CSV.`,
    });
  };

  const exportAllData = () => {
    // Create a comprehensive report
    const reportData = [
      { section: 'Sales Data', ...salesData[0] },
      { section: 'Client Data', ...clientData[0] },
      { section: 'Inventory Data', ...inventoryData[0] },
    ];
    exportToCSV(reportData, 'comprehensive_report');
  };

  return (
    <Layout
      header={
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Reports & Analytics</h1>
          <div className="flex gap-2">
            <Button onClick={exportAllData} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export All
            </Button>
          </div>
        </div>
      }
    >
      <Tabs defaultValue="sales">
        <TabsList className="mb-6">
          <TabsTrigger value="sales">Sales & Revenue</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <div className="flex justify-end mb-4">
            <Button 
              onClick={() => exportToCSV(salesData, 'sales_report')} 
              variant="outline" 
              size="sm" 
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export Sales Data
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={salesData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                      <XAxis dataKey="month" tick={{ fill: textColor }} />
                      <YAxis tick={{ fill: textColor }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor,
                          color: textColor,
                          border: isDark ? "1px solid #475569" : "1px solid #cbd5e1",
                        }}
                        formatter={(value) => [`$${value}`, ""]}
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill="#2563eb" name="Revenue" />
                      <Bar dataKey="expenses" fill="#dc2626" name="Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={salesData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                      <XAxis dataKey="month" tick={{ fill: textColor }} />
                      <YAxis tick={{ fill: textColor }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor,
                          color: textColor,
                          border: isDark ? "1px solid #475569" : "1px solid #cbd5e1",
                        }}
                        formatter={(value) => [`$${value}`, ""]}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#2563eb"
                        activeDot={{ r: 8 }}
                        name="Revenue"
                      />
                      <Line
                        type="monotone"
                        dataKey="expenses"
                        stroke="#dc2626"
                        name="Expenses"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Quarterly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { quarter: "Q1", revenue: 16800, target: 15000 },
                        { quarter: "Q2", revenue: 7060, target: 20000 },
                        { quarter: "Q3", revenue: 0, target: 22000 },
                        { quarter: "Q4", revenue: 0, target: 25000 },
                      ]}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                      <XAxis dataKey="quarter" tick={{ fill: textColor }} />
                      <YAxis tick={{ fill: textColor }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor,
                          color: textColor,
                          border: isDark ? "1px solid #475569" : "1px solid #cbd5e1",
                        }}
                        formatter={(value) => [`$${value}`, ""]}
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill="#2563eb" name="Actual Revenue" />
                      <Bar dataKey="target" fill="#64748b" name="Target" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients">
          <div className="flex justify-end mb-4">
            <Button 
              onClick={() => exportToCSV(clientData, 'client_report')} 
              variant="outline" 
              size="sm" 
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export Client Data
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Client Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={clientData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {clientData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value}%`, ""]}
                        contentStyle={{
                          backgroundColor,
                          color: textColor,
                          border: isDark ? "1px solid #475569" : "1px solid #cbd5e1",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client Acquisition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: "Jan", new: 5, churned: 2 },
                        { month: "Feb", new: 8, churned: 1 },
                        { month: "Mar", new: 12, churned: 3 },
                        { month: "Apr", new: 7, churned: 2 },
                        { month: "May", new: 10, churned: 4 },
                      ]}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                      <XAxis dataKey="month" tick={{ fill: textColor }} />
                      <YAxis tick={{ fill: textColor }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor,
                          color: textColor,
                          border: isDark ? "1px solid #475569" : "1px solid #cbd5e1",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="new"
                        stroke="#2563eb"
                        activeDot={{ r: 8 }}
                        name="New Clients"
                      />
                      <Line
                        type="monotone"
                        dataKey="churned"
                        stroke="#dc2626"
                        name="Churned Clients"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory">
          <div className="flex justify-end mb-4">
            <Button 
              onClick={() => exportToCSV(inventoryData, 'inventory_report')} 
              variant="outline" 
              size="sm" 
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export Inventory Data
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Inventory by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={inventoryData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                      <XAxis type="number" tick={{ fill: textColor }} />
                      <YAxis
                        dataKey="category"
                        type="category"
                        tick={{ fill: textColor }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor,
                          color: textColor,
                          border: isDark ? "1px solid #475569" : "1px solid #cbd5e1",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="count" fill="#2563eb" name="Item Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={inventoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="category"
                        label={({ name, percent }) =>
                          `${name}: $${(percent * 28000).toFixed(0)}`
                        }
                      >
                        {inventoryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`$${value}`, ""]}
                        contentStyle={{
                          backgroundColor,
                          color: textColor,
                          border: isDark ? "1px solid #475569" : "1px solid #cbd5e1",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Reports;
