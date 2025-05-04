import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-hot-toast";

function AdminSettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "E-Learning Platform",
    siteDescription: "A comprehensive learning platform for students",
    contactEmail: "admin@example.com",
    maxUploadSize: 10,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newUserNotification: true,
    newCourseNotification: true,
    systemUpdates: false,
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    primaryColor: "#0066cc",
    fontSize: "medium",
    enableAnimations: true,
  });

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: value,
    });
  };

  const handleNotificationChange = (name, checked) => {
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    });
  };

  const handleAppearanceChange = (name, value) => {
    setAppearanceSettings({
      ...appearanceSettings,
      [name]: value,
    });
  };

  const saveSettings = () => {
    // Here you would typically save to your backend
    toast.success("Settings saved successfully");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">Configure your platform settings</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your platform's general settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  name="siteName"
                  value={generalSettings.siteName}
                  onChange={handleGeneralChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Input
                  id="siteDescription"
                  name="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={handleGeneralChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={generalSettings.contactEmail}
                  onChange={handleGeneralChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxUploadSize">Maximum Upload Size (MB)</Label>
                <Input
                  id="maxUploadSize"
                  name="maxUploadSize"
                  type="number"
                  value={generalSettings.maxUploadSize}
                  onChange={handleGeneralChange}
                />
              </div>

              <Separator className="my-4" />

              <Button onClick={saveSettings}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="newUserNotification">New User Registration</Label>
                  <p className="text-sm text-muted-foreground">Get notified when a new user registers</p>
                </div>
                <Switch
                  id="newUserNotification"
                  checked={notificationSettings.newUserNotification}
                  onCheckedChange={(checked) => handleNotificationChange("newUserNotification", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="newCourseNotification">New Course Creation</Label>
                  <p className="text-sm text-muted-foreground">Get notified when a new course is created</p>
                </div>
                <Switch
                  id="newCourseNotification"
                  checked={notificationSettings.newCourseNotification}
                  onCheckedChange={(checked) => handleNotificationChange("newCourseNotification", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="systemUpdates">System Updates</Label>
                  <p className="text-sm text-muted-foreground">Get notified about system updates</p>
                </div>
                <Switch
                  id="systemUpdates"
                  checked={notificationSettings.systemUpdates}
                  onCheckedChange={(checked) => handleNotificationChange("systemUpdates", checked)}
                />
              </div>

              <Separator className="my-4" />

              <Button onClick={saveSettings}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize how the platform looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={appearanceSettings.theme}
                  onValueChange={(value) => handleAppearanceChange("theme", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    name="primaryColor"
                    type="color"
                    value={appearanceSettings.primaryColor}
                    onChange={(e) => handleAppearanceChange("primaryColor", e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={appearanceSettings.primaryColor}
                    onChange={(e) => handleAppearanceChange("primaryColor", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fontSize">Font Size</Label>
                <Select
                  value={appearanceSettings.fontSize}
                  onValueChange={(value) => handleAppearanceChange("fontSize", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableAnimations">Enable Animations</Label>
                  <p className="text-sm text-muted-foreground">Toggle UI animations on or off</p>
                </div>
                <Switch
                  id="enableAnimations"
                  checked={appearanceSettings.enableAnimations}
                  onCheckedChange={(checked) => handleAppearanceChange("enableAnimations", checked)}
                />
              </div>

              <Separator className="my-4" />

              <Button onClick={saveSettings}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Require a second form of authentication when logging in</p>
                <div className="mt-2">
                  <Button variant="outline">Enable Two-Factor Authentication</Button>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label>Session Management</Label>
                <p className="text-sm text-muted-foreground">Manage your active sessions</p>
                <div className="mt-2">
                  <Button variant="outline">View Active Sessions</Button>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label>Password</Label>
                <p className="text-sm text-muted-foreground">Change your account password</p>
                <div className="mt-2">
                  <Button variant="outline">Change Password</Button>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label>API Keys</Label>
                <p className="text-sm text-muted-foreground">Manage API keys for external integrations</p>
                <div className="mt-2">
                  <Button variant="outline">Manage API Keys</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminSettingsPage;