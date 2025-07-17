import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  FileText, 
  Image, 
  File,
  ScanText,
  Download,
  Eye,
  Trash2,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalyzedDocument {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'text';
  size: number;
  uploadedAt: Date;
  status: 'analyzing' | 'completed' | 'failed';
  progress: number;
  analysis: {
    text: string;
    entities: Array<{
      type: 'person' | 'organization' | 'date' | 'amount' | 'email' | 'phone';
      value: string;
      confidence: number;
    }>;
    summary: string;
    insights: string[];
  } | null;
}

const sampleDocuments: AnalyzedDocument[] = [
  {
    id: '1',
    name: 'TechCorp_Contract.pdf',
    type: 'pdf',
    size: 2457600,
    uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'completed',
    progress: 100,
    analysis: {
      text: 'Service Agreement between TechCorp Inc. and Business Solutions LLC...',
      entities: [
        { type: 'organization', value: 'TechCorp Inc.', confidence: 95 },
        { type: 'organization', value: 'Business Solutions LLC', confidence: 92 },
        { type: 'date', value: '2024-03-15', confidence: 98 },
        { type: 'amount', value: '$50,000', confidence: 89 },
        { type: 'email', value: 'legal@techcorp.com', confidence: 97 }
      ],
      summary: 'This is a service agreement for software development services with a total value of $50,000, effective March 15, 2024.',
      insights: [
        'Contract includes quarterly review clauses',
        'Payment terms: Net 30 days',
        'Automatic renewal clause present',
        'IP ownership clearly defined'
      ]
    }
  },
  {
    id: '2',
    name: 'BusinessCard_Scan.jpg',
    type: 'image',
    size: 1234567,
    uploadedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'completed',
    progress: 100,
    analysis: {
      text: 'John Smith\nSenior Sales Manager\nTech Solutions Inc.\n+1 (555) 123-4567\njohn.smith@techsolutions.com',
      entities: [
        { type: 'person', value: 'John Smith', confidence: 96 },
        { type: 'organization', value: 'Tech Solutions Inc.', confidence: 91 },
        { type: 'phone', value: '+1 (555) 123-4567', confidence: 94 },
        { type: 'email', value: 'john.smith@techsolutions.com', confidence: 98 }
      ],
      summary: 'Business card for John Smith, Senior Sales Manager at Tech Solutions Inc.',
      insights: [
        'Contact information extracted successfully',
        'Company appears to be in technology sector',
        'Professional contact with sales focus'
      ]
    }
  }
];

export const DocumentAnalysis = () => {
  const [documents, setDocuments] = useState<AnalyzedDocument[]>(sampleDocuments);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select files under 10MB.",
          variant: "destructive",
        });
        return;
      }

      const newDocument: AnalyzedDocument = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: file.type.includes('image') ? 'image' : file.type.includes('pdf') ? 'pdf' : 'text',
        size: file.size,
        uploadedAt: new Date(),
        status: 'analyzing',
        progress: 0,
        analysis: null
      };

      setDocuments(prev => [newDocument, ...prev]);

      // Simulate analysis progress
      const interval = setInterval(() => {
        setDocuments(prev => prev.map(doc => {
          if (doc.id === newDocument.id) {
            const newProgress = Math.min(doc.progress + Math.random() * 20, 100);
            return {
              ...doc,
              progress: newProgress,
              status: newProgress === 100 ? 'completed' : 'analyzing',
              analysis: newProgress === 100 ? {
                text: 'Sample extracted text from the document...',
                entities: [
                  { type: 'person', value: 'Sample Person', confidence: 85 },
                  { type: 'date', value: new Date().toISOString().split('T')[0], confidence: 90 }
                ],
                summary: 'AI-generated summary of the document content.',
                insights: [
                  'Key insight extracted from document',
                  'Important information identified',
                  'Action items discovered'
                ]
              } : null
            };
          }
          return doc;
        }));

        // Clear interval when analysis is complete
        const currentDoc = documents.find(d => d.id === newDocument.id);
        if (currentDoc && currentDoc.progress >= 100) {
          clearInterval(interval);
          toast({
            title: "Analysis Complete",
            description: `${file.name} has been analyzed successfully.`,
          });
        }
      }, 300);
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-6 w-6 text-red-500" />;
      case 'image': return <Image className="h-6 w-6 text-blue-500" />;
      default: return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const getEntityColor = (type: string) => {
    switch (type) {
      case 'person': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'organization': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'date': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'amount': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'email': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      case 'phone': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    toast({
      title: "Document Deleted",
      description: "Document has been removed from analysis.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScanText className="h-5 w-5" />
            Document Upload & Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Upload Documents for AI Analysis</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop files here, or click to select
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Supports PDF, Images (JPG, PNG), and Text files up to 10MB
            </p>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              <Upload className="h-4 w-4 mr-2" />
              Select Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.txt,.doc,.docx"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Documents ({documents.length})</TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({documents.filter(d => d.status === 'completed').length})
          </TabsTrigger>
          <TabsTrigger value="analyzing">
            Analyzing ({documents.filter(d => d.status === 'analyzing').length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {documents.map((doc) => (
                <Card key={doc.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getFileIcon(doc.type)}
                        <div>
                          <CardTitle className="text-lg">{doc.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(doc.size)} • Uploaded {doc.uploadedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.status === 'analyzing' && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Analyzing
                          </Badge>
                        )}
                        {doc.status === 'completed' && (
                          <Badge variant="default" className="flex items-center gap-1 bg-green-600">
                            <CheckCircle className="h-3 w-3" />
                            Completed
                          </Badge>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => deleteDocument(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {doc.status === 'analyzing' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Analysis Progress</span>
                          <span>{Math.round(doc.progress)}%</span>
                        </div>
                        <Progress value={doc.progress} className="h-2" />
                      </div>
                    )}
                    
                    {doc.status === 'completed' && doc.analysis && (
                      <div className="space-y-4">
                        {/* Extracted Entities */}
                        <div>
                          <h4 className="font-medium mb-2">Extracted Information</h4>
                          <div className="flex flex-wrap gap-2">
                            {doc.analysis.entities.map((entity, index) => (
                              <Badge key={index} className={getEntityColor(entity.type)}>
                                {entity.type}: {entity.value} ({entity.confidence}%)
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Summary */}
                        <div>
                          <h4 className="font-medium mb-2">AI Summary</h4>
                          <p className="text-sm bg-muted/30 p-3 rounded-lg">
                            {doc.analysis.summary}
                          </p>
                        </div>

                        {/* Key Insights */}
                        <div>
                          <h4 className="font-medium mb-2">Key Insights</h4>
                          <ul className="space-y-1">
                            {doc.analysis.insights.map((insight, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                {insight}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export Analysis
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4 mr-2" />
                            View Full Text
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        {['completed', 'analyzing'].map(status => (
          <TabsContent key={status} value={status}>
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {documents
                  .filter(doc => doc.status === status)
                  .map((doc) => (
                    <Card key={doc.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getFileIcon(doc.type)}
                            <div>
                              <CardTitle className="text-lg">{doc.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {formatFileSize(doc.size)}
                              </p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
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