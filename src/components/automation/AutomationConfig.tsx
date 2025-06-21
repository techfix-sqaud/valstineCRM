
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";

interface AutomationConfigProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (config: any) => void;
}

export const AutomationConfig = ({ open, onOpenChange, onSave }: AutomationConfigProps) => {
  const { t } = useLanguage();
  const [config, setConfig] = useState({
    followUpFrequency: 'weekly',
    emailTemplate: 'Hello {clientName}, we wanted to follow up on your recent inquiry...',
    enableNotifications: true,
    emailSubject: 'Follow-up from {companyName}',
    includeAttachments: false
  });

  const handleSave = () => {
    onSave(config);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('configure-automation')}</DialogTitle>
          <DialogDescription>
            Customize your automation settings for client follow-ups
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('email-settings')}</CardTitle>
              <CardDescription>Configure email automation settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="frequency" className="text-right">{t('follow-up-frequency')}</Label>
                <Select
                  value={config.followUpFrequency}
                  onValueChange={(value) => setConfig({ ...config, followUpFrequency: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">{t('daily')}</SelectItem>
                    <SelectItem value="weekly">{t('weekly')}</SelectItem>
                    <SelectItem value="monthly">{t('monthly')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">Email Subject</Label>
                <Input
                  id="subject"
                  value={config.emailSubject}
                  onChange={(e) => setConfig({ ...config, emailSubject: e.target.value })}
                  className="col-span-3"
                  placeholder="Follow-up email subject"
                />
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="template" className="text-right pt-2">{t('email-template')}</Label>
                <Textarea
                  id="template"
                  value={config.emailTemplate}
                  onChange={(e) => setConfig({ ...config, emailTemplate: e.target.value })}
                  className="col-span-3"
                  rows={4}
                  placeholder="Enter your email template..."
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('notification-settings')}</CardTitle>
              <CardDescription>Configure notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">{t('enable-notifications')}</Label>
                <Switch
                  id="notifications"
                  checked={config.enableNotifications}
                  onCheckedChange={(checked) => setConfig({ ...config, enableNotifications: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="attachments">Include Attachments</Label>
                <Switch
                  id="attachments"
                  checked={config.includeAttachments}
                  onCheckedChange={(checked) => setConfig({ ...config, includeAttachments: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSave}>
            {t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
