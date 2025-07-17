import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Type, 
  Mail, 
  FileText, 
  MessageSquare,
  Wand2,
  Copy,
  RefreshCw,
  Loader2,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GeneratedContent {
  id: string;
  type: 'email' | 'note' | 'message' | 'report';
  title: string;
  content: string;
  generatedAt: Date;
  context?: string;
}

const emailTemplates = [
  { id: 'follow-up', name: 'Follow-up Email', prompt: 'Professional follow-up after meeting' },
  { id: 'proposal', name: 'Proposal Email', prompt: 'Business proposal introduction' },
  { id: 'thank-you', name: 'Thank You Email', prompt: 'Thank you after successful deal' },
  { id: 'welcome', name: 'Welcome Email', prompt: 'Welcome new client onboarding' },
  { id: 'reminder', name: 'Reminder Email', prompt: 'Gentle payment reminder' },
];

const noteTemplates = [
  { id: 'meeting-summary', name: 'Meeting Summary', prompt: 'Summary of client meeting' },
  { id: 'call-notes', name: 'Call Notes', prompt: 'Notes from phone conversation' },
  { id: 'client-profile', name: 'Client Profile', prompt: 'Detailed client information' },
  { id: 'action-items', name: 'Action Items', prompt: 'Follow-up tasks and deadlines' },
];

const sampleGeneratedContent: GeneratedContent[] = [
  {
    id: '1',
    type: 'email',
    title: 'Follow-up Email - TechCorp Meeting',
    content: `Subject: Following up on our discussion - Next Steps

Dear Sarah,

Thank you for taking the time to meet with us yesterday. I really enjoyed our conversation about TechCorp's upcoming expansion plans and how our solutions can support your growth.

As discussed, I'm attaching the detailed proposal for our enterprise package. The key points we covered:

• 25% cost reduction through automation
• Seamless integration with your existing systems  
• 24/7 support with dedicated account manager

I'd love to schedule a follow-up call next week to address any questions you might have. Would Tuesday or Wednesday afternoon work better for you?

Looking forward to hearing from you.

Best regards,
John Smith`,
    generatedAt: new Date(Date.now() - 30 * 60 * 1000),
    context: 'Client: TechCorp, Meeting: Product Demo'
  },
  {
    id: '2',
    type: 'note',
    title: 'Meeting Notes - Q4 Strategy Discussion',
    content: `Meeting: Q4 Strategy Discussion
Date: ${new Date().toLocaleDateString()}
Attendees: Sales Team, Marketing Team

Key Discussion Points:
• Review of Q3 performance - exceeded targets by 15%
• Q4 goals: Focus on enterprise clients
• New product launch planned for November
• Marketing campaign budget approved

Action Items:
1. Update sales playbook by Oct 15 (John)
2. Prepare enterprise demo materials (Sarah)
3. Schedule client advisory board meeting (Mike)
4. Review pricing strategy for new product (Lisa)

Next Meeting: October 20th, 2:00 PM`,
    generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    context: 'Internal Team Meeting'
  }
];

export const TextGeneration = () => {
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>(sampleGeneratedContent);
  const [activeTab, setActiveTab] = useState('generate');
  const [contentType, setContentType] = useState('email');
  const [template, setTemplate] = useState('');
  const [context, setContext] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const getTemplates = () => {
    switch (contentType) {
      case 'email': return emailTemplates;
      case 'note': return noteTemplates;
      default: return [];
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'note': return <FileText className="h-4 w-4" />;
      case 'message': return <MessageSquare className="h-4 w-4" />;
      case 'report': return <FileText className="h-4 w-4" />;
      default: return <Type className="h-4 w-4" />;
    }
  };

  const generateContent = () => {
    if (!template && !customPrompt) {
      toast({
        title: "Error",
        description: "Please select a template or enter a custom prompt.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate AI content generation
    setTimeout(() => {
      const selectedTemplate = getTemplates().find(t => t.id === template);
      const prompt = selectedTemplate?.prompt || customPrompt;
      
      let generatedText = '';
      let title = '';

      // Generate different content based on type and template
      if (contentType === 'email') {
        if (template === 'follow-up') {
          title = 'Follow-up Email - ' + (context || 'Recent Meeting');
          generatedText = `Subject: Following up on our conversation

Dear [Client Name],

I hope this email finds you well. I wanted to follow up on our recent discussion about [topic].

Based on our conversation, I believe our solution can provide significant value to your organization. Here are the key benefits we discussed:

• [Benefit 1]
• [Benefit 2]  
• [Benefit 3]

I'd be happy to schedule a follow-up call to address any questions you might have. Please let me know what works best for your schedule.

Thank you for your time and consideration.

Best regards,
[Your Name]`;
        } else {
          title = selectedTemplate?.name + ' - ' + (context || 'New Client');
          generatedText = `Subject: ${selectedTemplate?.name}

Dear [Client Name],

${prompt}

[AI-generated content will appear here based on your specific context and requirements.]

Best regards,
[Your Name]`;
        }
      } else if (contentType === 'note') {
        title = selectedTemplate?.name + ' - ' + (context || new Date().toLocaleDateString());
        generatedText = `${selectedTemplate?.name}
Date: ${new Date().toLocaleDateString()}
Context: ${context || 'General notes'}

Key Points:
• [Point 1]
• [Point 2]
• [Point 3]

Details:
[AI-generated detailed notes based on your context]

Action Items:
1. [Action item 1]
2. [Action item 2]
3. [Action item 3]

Next Steps:
[Recommended follow-up actions]`;
      }

      const newContent: GeneratedContent = {
        id: Date.now().toString(),
        type: contentType as any,
        title: title,
        content: generatedText,
        generatedAt: new Date(),
        context: context || undefined
      };

      setGeneratedContent(prev => [newContent, ...prev]);
      setIsGenerating(false);
      setTemplate('');
      setContext('');
      setCustomPrompt('');
      
      toast({
        title: "Content Generated",
        description: "Your AI-generated content is ready!",
      });
    }, 2000);
  };

  const copyContent = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    
    setTimeout(() => setCopiedId(null), 2000);
    
    toast({
      title: "Copied",
      description: "Content copied to clipboard.",
    });
  };

  const regenerateContent = (id: string) => {
    toast({
      title: "Regenerating",
      description: "Creating a new version of this content.",
    });
    // In a real implementation, this would regenerate the content
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="generate">Generate Content</TabsTrigger>
          <TabsTrigger value="history">Generated Content ({generatedContent.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                AI Content Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Content Type Selection */}
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </div>
                    </SelectItem>
                    <SelectItem value="note">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Note
                      </div>
                    </SelectItem>
                    <SelectItem value="message">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Message
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Template Selection */}
              {getTemplates().length > 0 && (
                <div className="space-y-2">
                  <Label>Template</Label>
                  <Select value={template} onValueChange={setTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {getTemplates().map((temp) => (
                        <SelectItem key={temp.id} value={temp.id}>
                          {temp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Context Input */}
              <div className="space-y-2">
                <Label>Context (Optional)</Label>
                <Input
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g., Client name, meeting topic, project details..."
                />
              </div>

              {/* Custom Prompt */}
              <div className="space-y-2">
                <Label>Custom Prompt (Optional)</Label>
                <Textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Describe what you want to generate..."
                  rows={3}
                />
              </div>

              {/* Generate Button */}
              <Button onClick={generateContent} disabled={isGenerating} className="w-full">
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <div className="space-y-4">
            {generatedContent.map((content) => (
              <Card key={content.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getContentIcon(content.type)}
                        {content.type}
                      </Badge>
                      <div>
                        <CardTitle className="text-lg">{content.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Generated {content.generatedAt.toLocaleDateString()} at{' '}
                          {content.generatedAt.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => regenerateContent(content.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyContent(content.content, content.id)}
                      >
                        {copiedId === content.id ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {content.context && (
                    <div className="mb-3">
                      <Badge variant="secondary" className="text-xs">
                        Context: {content.context}
                      </Badge>
                    </div>
                  )}
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm font-mono">
                      {content.content}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};