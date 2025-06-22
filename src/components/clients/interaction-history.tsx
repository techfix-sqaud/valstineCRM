
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail, MessageSquare, Calendar, Plus, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Interaction {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  title: string;
  description: string;
  date: string;
  duration?: string;
  outcome?: string;
  nextAction?: string;
}

export const InteractionHistory = ({ clientId }: { clientId: string }) => {
  const { toast } = useToast();
  const [interactions, setInteractions] = useState<Interaction[]>([
    {
      id: '1',
      type: 'call',
      title: 'Initial consultation call',
      description: 'Discussed project requirements and timeline',
      date: '2024-01-10T10:00:00',
      duration: '45 minutes',
      outcome: 'Positive - interested in services',
      nextAction: 'Send proposal by Friday'
    },
    {
      id: '2',
      type: 'email',
      title: 'Proposal sent',
      description: 'Sent detailed proposal with pricing and timeline',
      date: '2024-01-12T14:30:00',
      outcome: 'Awaiting response'
    }
  ]);

  const [newInteraction, setNewInteraction] = useState({
    type: 'note' as const,
    title: '',
    description: '',
    duration: '',
    outcome: '',
    nextAction: ''
  });

  const addInteraction = () => {
    if (!newInteraction.title.trim()) {
      toast({
        title: "Error",
        description: "Interaction title is required",
        variant: "destructive"
      });
      return;
    }

    const interaction: Interaction = {
      id: Date.now().toString(),
      ...newInteraction,
      date: new Date().toISOString()
    };

    setInteractions([interaction, ...interactions]);
    setNewInteraction({
      type: 'note',
      title: '',
      description: '',
      duration: '',
      outcome: '',
      nextAction: ''
    });

    toast({
      title: "Interaction logged",
      description: "New interaction has been recorded"
    });
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      case 'note': return <MessageSquare className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getInteractionColor = (type: string) => {
    switch (type) {
      case 'call': return 'bg-blue-100 text-blue-800';
      case 'email': return 'bg-green-100 text-green-800';
      case 'meeting': return 'bg-purple-100 text-purple-800';
      case 'note': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Interaction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Log New Interaction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={newInteraction.type} onValueChange={(value: any) => setNewInteraction({ ...newInteraction, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="call">Phone Call</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="note">Note</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Interaction title"
              value={newInteraction.title}
              onChange={(e) => setNewInteraction({ ...newInteraction, title: e.target.value })}
            />
          </div>
          <Textarea
            placeholder="Description"
            value={newInteraction.description}
            onChange={(e) => setNewInteraction({ ...newInteraction, description: e.target.value })}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Duration (e.g., 30 minutes)"
              value={newInteraction.duration}
              onChange={(e) => setNewInteraction({ ...newInteraction, duration: e.target.value })}
            />
            <Input
              placeholder="Outcome"
              value={newInteraction.outcome}
              onChange={(e) => setNewInteraction({ ...newInteraction, outcome: e.target.value })}
            />
            <Input
              placeholder="Next action"
              value={newInteraction.nextAction}
              onChange={(e) => setNewInteraction({ ...newInteraction, nextAction: e.target.value })}
            />
          </div>
          <Button onClick={addInteraction}>Log Interaction</Button>
        </CardContent>
      </Card>

      {/* Interaction Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Interaction Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {interactions.map((interaction, index) => (
              <div key={interaction.id} className="relative flex items-start space-x-4">
                {/* Timeline line */}
                {index < interactions.length - 1 && (
                  <div className="absolute left-4 top-8 w-0.5 h-full bg-border" />
                )}
                
                {/* Icon */}
                <div className={`rounded-full p-2 ${getInteractionColor(interaction.type)}`}>
                  {getInteractionIcon(interaction.type)}
                </div>
                
                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{interaction.title}</h4>
                    <Badge variant="outline" className="capitalize">
                      {interaction.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{interaction.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {interaction.duration && (
                      <div>
                        <span className="font-medium">Duration: </span>
                        {interaction.duration}
                      </div>
                    )}
                    {interaction.outcome && (
                      <div>
                        <span className="font-medium">Outcome: </span>
                        {interaction.outcome}
                      </div>
                    )}
                    {interaction.nextAction && (
                      <div>
                        <span className="font-medium">Next Action: </span>
                        {interaction.nextAction}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    {new Date(interaction.date).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
