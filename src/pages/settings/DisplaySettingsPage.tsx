
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useDisplaySettings } from '@/contexts/DisplaySettingsContext';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';


const DisplaySettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { settings, setSettings } = useDisplaySettings();

  const handleShowAvatarsChange = (checked: boolean) => {
    setSettings(prev => ({ ...prev, showAvatars: checked }));
  };

  const handleShowAgentPerformanceChange = (checked: boolean) => {
    setSettings(prev => ({ ...prev, showAgentPerformance: checked }));
  };

  const handleShowCampaignPerformanceChange = (checked: boolean) => {
    setSettings(prev => ({ ...prev, showCampaignPerformance: checked }));
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex justify-center items-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Display Settings</CardTitle>
            <Link to="/settings">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <CardDescription>
            Customize the appearance of the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Theme</h3>
            <p className="text-sm text-muted-foreground">
              Select the color scheme for the application.
            </p>
            <RadioGroup
              value={theme}
              onValueChange={setTheme}
              className="grid max-w-md grid-cols-1 gap-4 pt-2 md:grid-cols-3"
            >
              <div>
                <RadioGroupItem value="light" id="light" className="peer sr-only" />
                <Label
                  htmlFor="light"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Sun className="mb-3 h-6 w-6" />
                  Light
                </Label>
              </div>
              <div>
                <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                <Label
                  htmlFor="dark"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Moon className="mb-3 h-6 w-6" />
                  Dark
                </Label>
              </div>
              <div>
                <RadioGroupItem value="system" id="system" className="peer sr-only" />
                <Label
                  htmlFor="system"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Laptop className="mb-3 h-6 w-6" />
                  System
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Interface Visibility</h3>
            <p className="text-sm text-muted-foreground">
              Control which elements are visible throughout the application.
            </p>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="show-avatars" className="text-base">Show User Avatars</Label>
                <p className="text-sm text-muted-foreground">
                  Display user avatars in lists and profiles.
                </p>
              </div>
              <Switch
                id="show-avatars"
                checked={settings.showAvatars}
                onCheckedChange={handleShowAvatarsChange}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="show-agent-performance" className="text-base">Show Agent Performance</Label>
                 <p className="text-sm text-muted-foreground">
                  Display the performance stats widget on the Agent Console.
                </p>
              </div>
              <Switch
                id="show-agent-performance"
                checked={settings.showAgentPerformance}
                onCheckedChange={handleShowAgentPerformanceChange}
              />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="show-campaign-performance" className="text-base">Show Campaign Performance</Label>
                 <p className="text-sm text-muted-foreground">
                  Display campaign stats on the Supervisor Dashboard.
                </p>
              </div>
              <Switch
                id="show-campaign-performance"
                checked={settings.showCampaignPerformance}
                onCheckedChange={handleShowCampaignPerformanceChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DisplaySettingsPage;
