import { useState } from 'react';
import Layout from '@/components/layout';
import { useLanguage } from '@/hooks/useLanguage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AIChat } from '@/components/ai/AIChat';
import { LeadScoring } from '@/components/ai/LeadScoring';
import { AIReports } from '@/components/ai/AIReports';
import { TextGeneration } from '@/components/ai/TextGeneration';
import { DocumentAnalysis } from '@/components/ai/DocumentAnalysis';
import { PredictiveAnalytics } from '@/components/ai/PredictiveAnalytics';
import { VoiceTranscription } from '@/components/ai/VoiceTranscription';
import { 
  Bot, 
  TrendingUp, 
  FileText, 
  Type, 
  ScanText, 
  BarChart3, 
  Mic 
} from 'lucide-react';

const AITools = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('chat');

  const tools = [
    {
      id: 'chat',
      title: 'AI Assistant',
      description: 'Get help with CRM tasks and questions',
      icon: Bot,
      component: AIChat
    },
    {
      id: 'scoring',
      title: 'Lead Scoring',
      description: 'AI-powered lead qualification',
      icon: TrendingUp,
      component: LeadScoring
    },
    {
      id: 'reports',
      title: 'Auto Reports',
      description: 'Generate insights from your data',
      icon: FileText,
      component: AIReports
    },
    {
      id: 'text',
      title: 'Text Generation',
      description: 'Auto-complete emails and notes',
      icon: Type,
      component: TextGeneration
    },
    {
      id: 'documents',
      title: 'Document Analysis',
      description: 'Extract info from uploads',
      icon: ScanText,
      component: DocumentAnalysis
    },
    {
      id: 'analytics',
      title: 'Predictive Analytics',
      description: 'Sales forecasting & trends',
      icon: BarChart3,
      component: PredictiveAnalytics
    },
    {
      id: 'voice',
      title: 'Voice Transcription',
      description: 'Convert voice notes to text',
      icon: Mic,
      component: VoiceTranscription
    }
  ];

  return (
    <Layout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Tools</h1>
            <p className="text-muted-foreground">
              Enhance your CRM with artificial intelligence
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:grid-cols-7">
            {tools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <TabsTrigger
                  key={tool.id}
                  value={tool.id}
                  className="flex items-center gap-2 p-3"
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden sm:inline">{tool.title}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {tools.map((tool) => {
            const Component = tool.component;
            return (
              <TabsContent key={tool.id} value={tool.id} className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <tool.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{tool.title}</CardTitle>
                        <CardDescription>{tool.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Component />
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </Layout>
  );
};

export default AITools;