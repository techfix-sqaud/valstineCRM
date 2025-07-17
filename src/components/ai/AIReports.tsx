import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  TrendingUp, 
  Download, 
  Calendar,
  DollarSign,
  Users,
  Package,
  BarChart3,
  Zap,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Report {
  id: string;
  title: string;
  description: string;
  type: 'sales' | 'clients' | 'inventory' | 'financial';
  generatedAt: Date;
  status: 'completed' | 'generating' | 'failed';
  insights: Array<{
    title: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
    description: string;
  }>;
  recommendations: string[];
}

const sampleReports: Report[] = [
  {
    id: '1',
    title: 'Monthly Sales Performance',
    description: 'Comprehensive analysis of sales metrics for the current month',
    type: 'sales',
    generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'completed',
    insights: [
      {
        title: 'Total Revenue',
        value: '$147,500',
        trend: 'up',
        description: '23% increase from last month'
      },
      {
        title: 'Conversion Rate',
        value: '18.5%',
        trend: 'up',
        description: '3.2% improvement'
      },
      {
        title: 'Average Deal Size',
        value: '$4,200',
        trend: 'down',
        description: '5% decrease'
      }
    ],
    recommendations: [
      'Focus on upselling to increase average deal size',
      'Implement targeted campaigns for high-value prospects',
      'Review pricing strategy for premium services'
    ]
  },
  {
    id: '2',
    title: 'Client Engagement Analysis',
    description: 'Analysis of client interactions and satisfaction metrics',
    type: 'clients',
    generatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    status: 'completed',
    insights: [
      {
        title: 'Active Clients',
        value: '342',
        trend: 'up',
        description: '12 new clients this month'
      },
      {
        title: 'Satisfaction Score',
        value: '4.7/5',
        trend: 'stable',
        description: 'Consistent with last quarter'
      },
      {
        title: 'Churn Rate',
        value: '2.1%',
        trend: 'down',
        description: '0.8% improvement'
      }
    ],
    recommendations: [
      'Launch loyalty program for long-term clients',
      'Implement proactive support for at-risk accounts',
      'Expand successful onboarding process'
    ]
  },
  {
    id: '3',
    title: 'Inventory Optimization',
    description: 'Stock levels and demand forecasting analysis',
    type: 'inventory',
    generatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'completed',
    insights: [
      {
        title: 'Stock Turnover',
        value: '6.2x',
        trend: 'up',
        description: 'Improved by 0.8x'
      },
      {
        title: 'Low Stock Items',
        value: '23 items',
        trend: 'stable',
        description: 'Within acceptable range'
      },
      {
        title: 'Waste Reduction',
        value: '15%',
        trend: 'up',
        description: 'Better than target'
      }
    ],
    recommendations: [
      'Increase stock for high-demand seasonal items',
      'Implement automated reorder points',
      'Consider bundling slow-moving inventory'
    ]
  }
];

const reportTemplates = [
  { id: 'sales-monthly', name: 'Monthly Sales Report', type: 'sales' },
  { id: 'client-satisfaction', name: 'Client Satisfaction Analysis', type: 'clients' },
  { id: 'inventory-forecast', name: 'Inventory Forecast', type: 'inventory' },
  { id: 'financial-summary', name: 'Financial Summary', type: 'financial' },
  { id: 'performance-kpis', name: 'Performance KPIs', type: 'sales' },
  { id: 'market-analysis', name: 'Market Analysis', type: 'sales' },
];

export const AIReports = () => {
  const [reports, setReports] = useState<Report[]>(sampleReports);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sales': return <DollarSign className="h-4 w-4" />;
      case 'clients': return <Users className="h-4 w-4" />;
      case 'inventory': return <Package className="h-4 w-4" />;
      case 'financial': return <BarChart3 className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sales': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'clients': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'inventory': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'financial': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
      default: return <div className="h-3 w-3 rounded-full bg-gray-400" />;
    }
  };

  const generateReport = () => {
    if (!selectedTemplate) {
      toast({
        title: "Error",
        description: "Please select a report template.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    const template = reportTemplates.find(t => t.id === selectedTemplate);
    
    // Simulate AI report generation
    setTimeout(() => {
      const newReport: Report = {
        id: Date.now().toString(),
        title: template?.name || 'Custom Report',
        description: `AI-generated analysis for ${template?.name.toLowerCase()}`,
        type: template?.type as any || 'sales',
        generatedAt: new Date(),
        status: 'completed',
        insights: [
          {
            title: 'Key Metric 1',
            value: '$' + (Math.random() * 100000).toFixed(0),
            trend: Math.random() > 0.5 ? 'up' : 'down',
            description: `${(Math.random() * 20 + 5).toFixed(1)}% change from last period`
          },
          {
            title: 'Key Metric 2',
            value: (Math.random() * 100).toFixed(1) + '%',
            trend: Math.random() > 0.5 ? 'up' : 'down',
            description: `${(Math.random() * 10 + 2).toFixed(1)}% improvement`
          }
        ],
        recommendations: [
          'AI-generated recommendation based on data analysis',
          'Strategic suggestion for improvement',
          'Action item for optimization'
        ]
      };

      setReports(prev => [newReport, ...prev]);
      setIsGenerating(false);
      setSelectedTemplate('');
      
      toast({
        title: "Report Generated",
        description: `${template?.name} has been generated successfully.`,
      });
    }, 3000);
  };

  const downloadReport = (reportId: string) => {
    toast({
      title: "Download Started",
      description: "Report is being prepared for download.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Generate New Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a report template" />
                </SelectTrigger>
                <SelectContent>
                  {reportTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(template.type)}
                        {template.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generateReport} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Reports ({reports.length})</TabsTrigger>
          <TabsTrigger value="sales">Sales ({reports.filter(r => r.type === 'sales').length})</TabsTrigger>
          <TabsTrigger value="clients">Clients ({reports.filter(r => r.type === 'clients').length})</TabsTrigger>
          <TabsTrigger value="inventory">Inventory ({reports.filter(r => r.type === 'inventory').length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-md ${getTypeColor(report.type)}`}>
                          {getTypeIcon(report.type)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{report.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{report.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {report.generatedAt.toLocaleDateString()}
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => downloadReport(report.id)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Key Insights */}
                      <div>
                        <h4 className="font-medium mb-3">Key Insights</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {report.insights.map((insight, index) => (
                            <div key={index} className="bg-muted/30 p-3 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">{insight.title}</span>
                                {getTrendIcon(insight.trend)}
                              </div>
                              <p className="text-xl font-bold">{insight.value}</p>
                              <p className="text-xs text-muted-foreground">{insight.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* AI Recommendations */}
                      <div>
                        <h4 className="font-medium mb-3">AI Recommendations</h4>
                        <ul className="space-y-2">
                          {report.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        {['sales', 'clients', 'inventory'].map(type => (
          <TabsContent key={type} value={type}>
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {reports
                  .filter(report => report.type === type)
                  .map((report) => (
                    <Card key={report.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{report.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">{report.description}</p>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => downloadReport(report.id)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};