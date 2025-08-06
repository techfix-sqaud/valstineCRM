import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Clock, DollarSign, Users, Wrench, Star, Calendar, AlertTriangle } from 'lucide-react';

const monthlyRevenue = [
  { month: 'Jan', revenue: 4500, services: 45 },
  { month: 'Feb', revenue: 5200, services: 52 },
  { month: 'Mar', revenue: 4800, services: 48 },
  { month: 'Apr', revenue: 6100, services: 61 },
  { month: 'May', revenue: 5800, services: 58 },
  { month: 'Jun', revenue: 6500, services: 65 }
];

const serviceTypes = [
  { name: 'Screen Repair', value: 35, color: '#8884d8' },
  { name: 'Battery Replacement', value: 25, color: '#82ca9d' },
  { name: 'Water Damage', value: 20, color: '#ffc658' },
  { name: 'Software Issues', value: 15, color: '#ff7300' },
  { name: 'Other', value: 5, color: '#00ff88' }
];

const technicianPerformance = [
  { name: 'John Smith', completed: 28, rating: 4.8, efficiency: 92 },
  { name: 'Sarah Wilson', completed: 24, rating: 4.9, efficiency: 88 },
  { name: 'Mike Johnson', completed: 19, rating: 4.6, efficiency: 85 },
  { name: 'Lisa Chen', completed: 16, rating: 4.7, efficiency: 90 }
];

const averageRepairTime = [
  { device: 'iPhone', avgTime: 45, target: 40 },
  { device: 'Samsung', avgTime: 38, target: 35 },
  { device: 'MacBook', avgTime: 120, target: 100 },
  { device: 'iPad', avgTime: 55, target: 50 },
  { device: 'Gaming Console', avgTime: 90, target: 85 }
];

export const RepairAnalytics = () => {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$6,500</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.3%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services Completed</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.1%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Repair Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">52 min</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">+3.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.2</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue & Services</CardTitle>
            <CardDescription>Revenue and service count over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
                <Bar yAxisId="right" dataKey="services" fill="#82ca9d" name="Services" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Type Distribution</CardTitle>
            <CardDescription>Breakdown of repair services by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Technician Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Technician Performance</CardTitle>
          <CardDescription>Performance metrics for repair technicians</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {technicianPerformance.map((tech, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium">{tech.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {tech.completed} services completed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{tech.rating}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Rating</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{tech.efficiency}%</div>
                      <p className="text-sm text-muted-foreground">Efficiency</p>
                    </div>
                  </div>
                </div>
                <Progress value={tech.efficiency} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Repair Time Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Average Repair Time by Device</CardTitle>
          <CardDescription>Compare actual vs target repair times</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {averageRepairTime.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.device}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {item.avgTime}min / {item.target}min target
                    </span>
                    {item.avgTime > item.target && (
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Progress 
                      value={(item.avgTime / item.target) * 100} 
                      className="h-2"
                    />
                  </div>
                  <span className="text-sm font-medium w-12">
                    {Math.round((item.avgTime / item.target) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">This Week</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Services Started:</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Services Completed:</span>
              <span className="font-medium">15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Revenue:</span>
              <span className="font-medium">$1,450</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Waiting for Parts:</span>
              <Badge variant="outline">3</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">In Progress:</span>
              <Badge variant="secondary">8</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Urgent Priority:</span>
              <Badge variant="destructive">2</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">5 Star Reviews:</span>
              <span className="font-medium">42</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">4 Star Reviews:</span>
              <span className="font-medium">18</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Repeat Customers:</span>
              <span className="font-medium">67%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};