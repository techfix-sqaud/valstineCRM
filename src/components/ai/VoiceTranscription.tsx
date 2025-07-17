import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mic, 
  MicOff, 
  Play,
  Pause,
  Square,
  Save,
  Download,
  Trash2,
  Upload,
  Copy,
  FileAudio,
  Clock,
  Volume2,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Recording {
  id: string;
  name: string;
  duration: number;
  createdAt: Date;
  status: 'transcribing' | 'completed' | 'failed';
  transcription?: string;
  summary?: string;
  actionItems?: string[];
  tags?: string[];
}

const sampleRecordings: Recording[] = [
  {
    id: '1',
    name: 'Client Meeting - TechCorp',
    duration: 1847, // 30:47
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'completed',
    transcription: `Good morning, Sarah. Thank you for taking the time to meet with us today. I wanted to discuss the potential partnership between TechCorp and our company.

We've been looking at your expansion plans, and I believe our solutions could provide significant value. Specifically, our automation platform could help reduce your operational costs by approximately 25%.

Sarah mentioned that timing is crucial for them, as they're planning to implement new systems by Q4. She also expressed interest in our 24/7 support package.

The key points we need to address are integration with their existing CRM system and training for their team of 50 users.`,
    summary: 'Meeting with TechCorp about potential partnership. Discussed automation platform benefits, Q4 implementation timeline, and support requirements.',
    actionItems: [
      'Prepare detailed integration proposal by Friday',
      'Schedule follow-up call for next Tuesday',
      'Send pricing information for 50-user license',
      'Arrange technical demo for their IT team'
    ],
    tags: ['client-meeting', 'techcorp', 'partnership', 'automation']
  },
  {
    id: '2',
    name: 'Team Standup - March 15',
    duration: 892, // 14:52
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'completed',
    transcription: `Team standup for March 15th. John reported that the new feature development is on track, expected completion by end of week.

Sarah mentioned some challenges with the API integration, may need additional 2 days. Mike completed the security audit and found no critical issues.

Lisa presented the Q1 marketing results - 15% increase in leads compared to last quarter. The social media campaign performed particularly well.

Next week's priorities: complete the API integration, launch the beta testing program, and prepare for the client presentation on Thursday.`,
    summary: 'Daily team standup covering development progress, marketing results, and next week priorities.',
    actionItems: [
      'Complete API integration by Wednesday (Sarah)',
      'Launch beta testing program (Mike)',
      'Prepare client presentation materials (Lisa)',
      'Schedule code review session (John)'
    ],
    tags: ['team-standup', 'development', 'marketing', 'planning']
  }
];

export const VoiceTranscription = () => {
  const [recordings, setRecordings] = useState<Recording[]>(sampleRecordings);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [currentRecording, setCurrentRecording] = useState<string>('');
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [editingTranscription, setEditingTranscription] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'zh', name: 'Chinese' },
  ];

  // Simulate recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = () => {
    // In a real implementation, this would start actual audio recording
    setIsRecording(true);
    setRecordingDuration(0);
    toast({
      title: "Recording Started",
      description: "Voice recording has begun. Speak clearly for best results.",
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    
    if (recordingDuration > 0) {
      const newRecording: Recording = {
        id: Date.now().toString(),
        name: `Voice Note - ${new Date().toLocaleDateString()}`,
        duration: recordingDuration,
        createdAt: new Date(),
        status: 'transcribing'
      };

      setRecordings(prev => [newRecording, ...prev]);
      
      // Simulate transcription process
      setTimeout(() => {
        setRecordings(prev => prev.map(rec => 
          rec.id === newRecording.id 
            ? {
                ...rec,
                status: 'completed',
                transcription: 'This is a sample transcription of your voice recording. In a real implementation, this would contain the actual speech-to-text conversion of your audio.',
                summary: 'Sample summary of the voice note content.',
                actionItems: ['Sample action item from the recording'],
                tags: ['voice-note', 'sample']
              }
            : rec
        ));
        
        toast({
          title: "Transcription Complete",
          description: "Your voice recording has been transcribed successfully.",
        });
      }, 3000);
    }
    
    setRecordingDuration(0);
  };

  const handleFileUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Invalid File",
          description: "Please select audio files only.",
          variant: "destructive",
        });
        return;
      }

      const newRecording: Recording = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        duration: 0, // Would be determined from audio file
        createdAt: new Date(),
        status: 'transcribing'
      };

      setRecordings(prev => [newRecording, ...prev]);
      
      // Simulate transcription
      setTimeout(() => {
        setRecordings(prev => prev.map(rec => 
          rec.id === newRecording.id 
            ? {
                ...rec,
                status: 'completed',
                transcription: 'Transcription of uploaded audio file...',
                summary: 'AI-generated summary of the uploaded audio.',
                actionItems: ['Action items extracted from audio'],
                tags: ['uploaded', 'audio-file']
              }
            : rec
        ));
      }, 4000);
    });
  };

  const togglePlayback = (id: string) => {
    if (isPlaying === id) {
      setIsPlaying(null);
    } else {
      setIsPlaying(id);
      // In a real implementation, this would play the actual audio
      setTimeout(() => setIsPlaying(null), 2000); // Simulate playback
    }
  };

  const saveRecording = (id: string) => {
    toast({
      title: "Recording Saved",
      description: "Recording has been saved to your library.",
    });
  };

  const deleteRecording = (id: string) => {
    setRecordings(prev => prev.filter(rec => rec.id !== id));
    toast({
      title: "Recording Deleted",
      description: "Recording has been removed.",
    });
  };

  const downloadTranscription = (recording: Recording) => {
    const content = `${recording.name}\nDate: ${recording.createdAt.toLocaleDateString()}\nDuration: ${formatDuration(recording.duration)}\n\nTranscription:\n${recording.transcription}\n\nSummary:\n${recording.summary}\n\nAction Items:\n${recording.actionItems?.map(item => `• ${item}`).join('\n')}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recording.name}-transcription.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyTranscription = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Transcription copied to clipboard.",
    });
  };

  const startEditing = (id: string, text: string) => {
    setEditingTranscription(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editingTranscription) {
      setRecordings(prev => prev.map(rec => 
        rec.id === editingTranscription 
          ? { ...rec, transcription: editText }
          : rec
      ));
      setEditingTranscription(null);
      setEditText('');
      toast({
        title: "Transcription Updated",
        description: "Your edits have been saved.",
      });
    }
  };

  const cancelEdit = () => {
    setEditingTranscription(null);
    setEditText('');
  };

  return (
    <div className="space-y-6">
      {/* Recording Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Voice Recording & Transcription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Language Selection */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Language:</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Recording Interface */}
            <div className="flex items-center justify-center p-8 bg-muted/30 rounded-lg">
              <div className="text-center space-y-4">
                {isRecording && (
                  <div className="text-2xl font-mono text-red-500">
                    {formatDuration(recordingDuration)}
                  </div>
                )}
                
                <div className="flex items-center gap-4">
                  {!isRecording ? (
                    <Button 
                      onClick={startRecording}
                      size="lg"
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Mic className="h-5 w-5 mr-2" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button 
                      onClick={stopRecording}
                      size="lg"
                      variant="destructive"
                    >
                      <Square className="h-5 w-5 mr-2" />
                      Stop Recording
                    </Button>
                  )}
                  
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    size="lg"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Audio
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {isRecording 
                    ? 'Recording in progress... Speak clearly into your microphone'
                    : 'Click to start recording or upload an audio file'
                  }
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              multiple
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recordings List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Recordings ({recordings.length})</TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({recordings.filter(r => r.status === 'completed').length})
          </TabsTrigger>
          <TabsTrigger value="transcribing">
            Processing ({recordings.filter(r => r.status === 'transcribing').length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {recordings.map((recording) => (
                <Card key={recording.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileAudio className="h-5 w-5 text-blue-500" />
                        <div>
                          <CardTitle className="text-lg">{recording.name}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDuration(recording.duration)}
                            </div>
                            <span>•</span>
                            <span>{recording.createdAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {recording.status === 'transcribing' && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Transcribing
                          </Badge>
                        )}
                        {recording.status === 'completed' && (
                          <Badge variant="default" className="bg-green-600">
                            Completed
                          </Badge>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => togglePlayback(recording.id)}
                        >
                          {isPlaying === recording.id ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => saveRecording(recording.id)}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteRecording(recording.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {recording.status === 'completed' && recording.transcription && (
                    <CardContent>
                      <div className="space-y-4">
                        {/* Tags */}
                        {recording.tags && (
                          <div className="flex flex-wrap gap-2">
                            {recording.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Transcription */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Transcription</h4>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEditing(recording.id, recording.transcription!)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyTranscription(recording.transcription!)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {editingTranscription === recording.id ? (
                            <div className="space-y-2">
                              <Textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                rows={6}
                                className="resize-none"
                              />
                              <div className="flex gap-2">
                                <Button size="sm" onClick={saveEdit}>
                                  Save
                                </Button>
                                <Button size="sm" variant="outline" onClick={cancelEdit}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-muted/30 p-4 rounded-lg">
                              <p className="text-sm whitespace-pre-wrap">
                                {recording.transcription}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Summary */}
                        {recording.summary && (
                          <div>
                            <h4 className="font-medium mb-2">AI Summary</h4>
                            <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                              <p className="text-sm">{recording.summary}</p>
                            </div>
                          </div>
                        )}

                        {/* Action Items */}
                        {recording.actionItems && recording.actionItems.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Action Items</h4>
                            <ul className="space-y-1">
                              {recording.actionItems.map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-2 border-t">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => downloadTranscription(recording)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => copyTranscription(recording.transcription!)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Text
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        {['completed', 'transcribing'].map(status => (
          <TabsContent key={status} value={status}>
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {recordings
                  .filter(recording => recording.status === status)
                  .map((recording) => (
                    <Card key={recording.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileAudio className="h-5 w-5 text-blue-500" />
                            <div>
                              <CardTitle className="text-lg">{recording.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {formatDuration(recording.duration)} • {recording.createdAt.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => togglePlayback(recording.id)}
                          >
                            {isPlaying === recording.id ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
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