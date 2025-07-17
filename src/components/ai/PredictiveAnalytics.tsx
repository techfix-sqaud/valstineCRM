import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Target,
  Brain,
  Calendar,
  DollarSign,
  Users,
  AlertTriangle,
  Zap,
  BarChart3,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Prediction {
  id: string;
  type: 'sales' | 'churn' | 'revenue' | 'demand';
  title: string;
  description: string;
  confidence: number;
  period: string;
  predictions: Array<{
    metric: string;
    current: number;
    predicted: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  insights: string[];
  recommendations: string[];
  generatedAt: Date;
}

const samplePredictions: Prediction[] = [
  {
    id: '1',
    type: 'sales',
    title: 'Q4 Sales Forecast',
    description: 'Predicted sales performance for the next quarter',
    confidence: 87,
    period: 'Q4 2024',
    predictions: [
      {
        metric: 'Revenue',
        current: 485000,
        predicted: 632000,
        change: 30.3,
        trend: 'up'
      },
      {
        metric: 'New Clients',
        current: 45,
        predicted: 67,
        change: 48.9,
        trend: 'up'
      },
      {
        metric: 'Deal Closure Rate',
        current: 18.5,
        predicted: 22.1,
        change: 19.5,
        trend: 'up'
      }
    ],
    insights: [
      'Holiday season expected to drive 35% increase in enterprise deals',
      'New product launch will likely boost conversion rates',
      'Market conditions favoring B2B sales growth'
    ],
    recommendations: [
      'Increase sales team capacity by 20% for Q4',
      'Focus on enterprise clients for higher deal values',
      'Prepare inventory for expected demand surge'
    ],
    generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '2',
    type: 'churn',
    title: 'Client Churn Risk Analysis',
    description: 'Identification of clients at risk of churning',
    confidence: 92,
    period: 'Next 90 days',
    predictions: [
      {
        metric: 'High Risk Clients',
        current: 23,
        predicted: 31,
        change: 34.8,
        trend: 'up'
      },
      {
        metric: 'Expected Churn Rate',
        current: 3.2,
        predicted: 4.1,
        change: 28.1,
        trend: 'up'
      },
      {
        metric: 'Revenue at Risk',
        current: 125000,
        predicted: 167000,
        change: 33.6,
        trend: 'up'
      }
    ],
    insights: [
      '12 clients showing decreased engagement patterns',
      'Support ticket volume increased for at-risk accounts',
      'Contract renewal dates clustering in next quarter'
    ],
    recommendations: [
      'Implement proactive outreach for high-risk clients',
      'Schedule retention calls before renewal periods',
      'Offer loyalty incentives to at-risk segments'
    ],
    generatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
  },
  {
    id: '3',
    type: 'demand',
    title: 'Product Demand Forecast',
    description: 'Predicted demand for inventory planning',
    confidence: 79,
    period: 'Next 6 months',
    predictions: [
      {
        metric: 'Total Units',
        current: 8500,
        predicted: 12300,
        change: 44.7,
        trend: 'up'
      },
      {
        metric: 'Premium Products',
        current: 2100,
        predicted: 3800,
        change: 81.0,
        trend: 'up'
      },
      {
        metric: 'Seasonal Items',
        current: 1200,
        predicted: 750,
        change: -37.5,
        trend: 'down'
      }
    ],
    insights: [
      'Premium product segment showing strong growth trajectory',
      'Seasonal items demand shifting to off-peak periods',
      'New market segments driving overall demand increase'
    ],
    recommendations: [
      'Increase premium product inventory by 60%',
      'Adjust seasonal product stocking strategy',
      'Explore new supplier relationships for scaling'
    ],
    generatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
  }
];

const predictionTypes = [
  { id: 'sales', name: 'Sales Forecast', icon: DollarSign },
  { id: 'churn', name: 'Churn Analysis', icon: AlertTriangle },
  { id: 'revenue', name: 'Revenue Prediction', icon: TrendingUp },
  { id: 'demand', name: 'Demand Forecast', icon: BarChart3 },
];

export const PredictiveAnalytics = () => {
  const [predictions, setPredictions] = useState<Prediction[]>(samplePredictions);
  const [selectedType, setSelectedType] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sales': return <DollarSign className="h-4 w-4" />;
      case 'churn': return <AlertTriangle className="h-4 w-4" />;
      case 'revenue': return <TrendingUp className="h-4 w-4" />;
      case 'demand': return <BarChart3 className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sales': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'churn': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'revenue': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'demand': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <div className="h-4 w-4 rounded-full bg-gray-400" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 dark:text-green-400';
    if (confidence >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const formatValue = (metric: string, value: number) => {
    if (metric.toLowerCase().includes('revenue') || metric.toLowerCase().includes('risk')) {
      return `$${value.toLocaleString()}`;
    }
    if (metric.toLowerCase().includes('rate') || metric.toLowerCase().includes('%')) {
      return `${value}%`;
    }
    return value.toLocaleString();
  };

  const generatePrediction = () => {
    if (!selectedType) {
      toast({
        title: "Error",
        description: "Please select a prediction type.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    const typeData = predictionTypes.find(t => t.id === selectedType);
    
    // Simulate AI prediction generation
    setTimeout(() => {
      const newPrediction: Prediction = {
        id: Date.now().toString(),
        type: selectedType as any,
        title: `${typeData?.name} - ${new Date().toLocaleDateString()}`,
        description: `AI-generated ${typeData?.name.toLowerCase()} analysis`,
        confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
        period: 'Next quarter',
        predictions: [
          {
            metric: 'Key Metric 1',
            current: Math.floor(Math.random() * 100000),
            predicted: Math.floor(Math.random() * 150000),
            change: Math.floor(Math.random() * 50) - 10, // -10% to +40%
            trend: Math.random() > 0.3 ? 'up' : 'down'
          },
          {
            metric: 'Key Metric 2', 
            current: Math.floor(Math.random() * 1000),
            predicted: Math.floor(Math.random() * 1500),
            change: Math.floor(Math.random() * 40) - 5, // -5% to +35%
            trend: Math.random() > 0.4 ? 'up' : 'down'
          }
        ],
        insights: [
          'AI-identified trend in historical data',
          'Market condition analysis suggests growth',
          'Seasonal patterns indicate opportunity'
        ],
        recommendations: [
          'Strategic recommendation based on predictions',
          'Tactical action for optimization',
          'Risk mitigation suggestion'
        ],
        generatedAt: new Date()
      };

      setPredictions(prev => [newPrediction, ...prev]);
      setIsGenerating(false);
      setSelectedType('');
      
      toast({
        title: "Prediction Generated",
        description: `${typeData?.name} analysis has been completed.`,
      });
    }, 3000);
  };

  const refreshPrediction = (id: string) => {
    toast({
      title: "Refreshing Prediction",
      description: "Updating analysis with latest data.",
    });
    // In a real implementation, this would refresh the specific prediction
  };

  // Calculate summary stats
  const totalPredictions = predictions.length;
  const averageConfidence = Math.round(
    predictions.reduce((sum, pred) => sum + pred.confidence, 0) / totalPredictions
  );
  const highConfidencePredictions = predictions.filter(pred => pred.confidence >= 80).length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Predictions</p>
                <p className="text-2xl font-bold">{totalPredictions}</p>
              </div>
              <Brain className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Confidence</p>
                <p className={`text-2xl font-bold ${getConfidenceColor(averageConfidence)}`}>
                  {averageConfidence}%
                </p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Confidence</p>
                <p className="text-2xl font-bold text-green-600">{highConfidencePredictions}</p>
              </div>
              <Zap className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generate New Prediction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Generate New Prediction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select prediction type" />
                </SelectTrigger>
                <SelectContent>
                  {predictionTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          {type.name}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generatePrediction} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Generate Prediction
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Predictions List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Predictions ({totalPredictions})</TabsTrigger>
          <TabsTrigger value="sales">Sales ({predictions.filter(p => p.type === 'sales').length})</TabsTrigger>
          <TabsTrigger value="churn">Churn ({predictions.filter(p => p.type === 'churn').length})</TabsTrigger>
          <TabsTrigger value="demand">Demand ({predictions.filter(p => p.type === 'demand').length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="space-y-4">
            {predictions.map((prediction) => (
              <Card key={prediction.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-md ${getTypeColor(prediction.type)}`}>
                        {getTypeIcon(prediction.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{prediction.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{prediction.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className={getTypeColor(prediction.type)}>
                          {prediction.period}
                        </Badge>
                        <p className={`text-sm font-medium ${getConfidenceColor(prediction.confidence)}`}>
                          {prediction.confidence}% confidence
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => refreshPrediction(prediction.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Confidence Score */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Prediction Confidence</span>
                        <span>{prediction.confidence}%</span>
                      </div>
                      <Progress value={prediction.confidence} className="h-2" />
                    </div>

                    {/* Predictions */}
                    <div>
                      <h4 className="font-medium mb-3">Key Predictions</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {prediction.predictions.map((pred, index) => (
                          <div key={index} className="bg-muted/30 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">{pred.metric}</span>
                              {getTrendIcon(pred.trend)}
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Current</span>
                                <span>{formatValue(pred.metric, pred.current)}</span>
                              </div>
                              <div className="flex justify-between text-sm font-medium">
                                <span>Predicted</span>
                                <span>{formatValue(pred.metric, pred.predicted)}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span>Change</span>
                                <span className={pred.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  {pred.change >= 0 ? '+' : ''}{pred.change.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Insights and Recommendations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Key Insights</h4>
                        <ul className="space-y-2">
                          {prediction.insights.map((insight, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">Recommendations</h4>
                        <ul className="space-y-2">
                          {prediction.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Generated {prediction.generatedAt.toLocaleDateString()} at {prediction.generatedAt.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {['sales', 'churn', 'demand'].map(type => (
          <TabsContent key={type} value={type}>
            <div className="space-y-4">
              {predictions
                .filter(prediction => prediction.type === type)
                .map((prediction) => (
                  <Card key={prediction.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{prediction.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{prediction.description}</p>
                        </div>
                        <Badge className={getTypeColor(prediction.type)}>
                          {prediction.confidence}% confidence
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};