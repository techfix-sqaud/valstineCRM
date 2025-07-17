import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Target, 
  Brain,
  Zap,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  score: number;
  status: 'hot' | 'warm' | 'cold';
  factors: Array<{
    name: string;
    value: number;
    impact: 'positive' | 'negative' | 'neutral';
  }>;
  lastActivity: string;
  predictedRevenue: number;
}

const sampleLeads: Lead[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    company: 'TechCorp Inc.',
    email: 'sarah@techcorp.com',
    score: 92,
    status: 'hot',
    factors: [
      { name: 'Company Size', value: 15, impact: 'positive' },
      { name: 'Budget Range', value: 20, impact: 'positive' },
      { name: 'Email Engagement', value: 18, impact: 'positive' },
      { name: 'Website Visits', value: 12, impact: 'positive' },
      { name: 'Decision Timeline', value: 10, impact: 'positive' },
    ],
    lastActivity: '2 hours ago',
    predictedRevenue: 25000,
  },
  {
    id: '2',
    name: 'Michael Chen',
    company: 'StartupXYZ',
    email: 'mike@startupxyz.com',
    score: 67,
    status: 'warm',
    factors: [
      { name: 'Company Size', value: 8, impact: 'neutral' },
      { name: 'Budget Range', value: 12, impact: 'positive' },
      { name: 'Email Engagement', value: 5, impact: 'negative' },
      { name: 'Website Visits', value: 15, impact: 'positive' },
      { name: 'Decision Timeline', value: 3, impact: 'negative' },
    ],
    lastActivity: '1 day ago',
    predictedRevenue: 8500,
  },
  {
    id: '3',
    name: 'Jennifer Rodriguez',
    company: 'BigCorp LLC',
    email: 'jen@bigcorp.com',
    score: 34,
    status: 'cold',
    factors: [
      { name: 'Company Size', value: 18, impact: 'positive' },
      { name: 'Budget Range', value: 2, impact: 'negative' },
      { name: 'Email Engagement', value: 1, impact: 'negative' },
      { name: 'Website Visits', value: 3, impact: 'negative' },
      { name: 'Decision Timeline', value: 0, impact: 'negative' },
    ],
    lastActivity: '1 week ago',
    predictedRevenue: 2000,
  },
];

export const LeadScoring = () => {
  const [leads, setLeads] = useState<Lead[]>(sampleLeads);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'warm': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'cold': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'negative': return <TrendingDown className="h-3 w-3 text-red-500" />;
      default: return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  const analyzeLeads = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      // Simulate AI analysis with slight score changes
      const updatedLeads = leads.map(lead => ({
        ...lead,
        score: Math.max(0, Math.min(100, lead.score + (Math.random() - 0.5) * 10)),
      }));
      
      setLeads(updatedLeads);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: "Lead scores have been updated using AI analysis.",
      });
    }, 2000);
  };

  const totalLeads = leads.length;
  const hotLeads = leads.filter(lead => lead.status === 'hot').length;
  const averageScore = Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / totalLeads);
  const totalPredictedRevenue = leads.reduce((sum, lead) => sum + lead.predictedRevenue, 0);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{totalLeads}</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hot Leads</p>
                <p className="text-2xl font-bold text-red-600">{hotLeads}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Score</p>
                <p className="text-2xl font-bold">{averageScore}</p>
              </div>
              <Brain className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Predicted Revenue</p>
                <p className="text-2xl font-bold">${totalPredictedRevenue.toLocaleString()}</p>
              </div>
              <Zap className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Lead Analysis</h3>
        <Button onClick={analyzeLeads} disabled={isAnalyzing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
        </Button>
      </div>

      {/* Leads List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Leads ({totalLeads})</TabsTrigger>
          <TabsTrigger value="hot">Hot ({hotLeads})</TabsTrigger>
          <TabsTrigger value="warm">Warm ({leads.filter(l => l.status === 'warm').length})</TabsTrigger>
          <TabsTrigger value="cold">Cold ({leads.filter(l => l.status === 'cold').length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {leads.map((lead) => (
                <Card key={lead.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{lead.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{lead.company}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>
                          {lead.score}
                        </p>
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Lead Score</span>
                        <span>{lead.score}/100</span>
                      </div>
                      <Progress value={lead.score} className="h-2" />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm font-medium mb-2">Scoring Factors</p>
                          <div className="space-y-1">
                            {lead.factors.map((factor, index) => (
                              <div key={index} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1">
                                  {getImpactIcon(factor.impact)}
                                  <span>{factor.name}</span>
                                </div>
                                <span className="font-medium">+{factor.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium mb-2">Details</p>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span>Last Activity:</span>
                              <span>{lead.lastActivity}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Predicted Revenue:</span>
                              <span className="font-medium text-green-600">
                                ${lead.predictedRevenue.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Email:</span>
                              <span>{lead.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        {['hot', 'warm', 'cold'].map(status => (
          <TabsContent key={status} value={status}>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {leads
                  .filter(lead => lead.status === status)
                  .map((lead) => (
                    <Card key={lead.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{lead.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{lead.company}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>
                              {lead.score}
                            </p>
                            <Badge className={getStatusColor(lead.status)}>
                              {lead.status.toUpperCase()}
                            </Badge>
                          </div>
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