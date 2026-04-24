import React, { useState } from 'react';
import { Save, Globe, Shield, Bell, Database } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { toast } from '../components/Toaster';

const AdminSettings = () => {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'Diva Haus',
    siteDescription: 'Luxury Boutique E-Commerce',
    adminEmail: 'admin@divahaus.com',
    supportEmail: 'support@divahaus.com',
    enableRegistration: true,
    maintenanceMode: false,
    currency: 'USD',
    aiProvider: 'Kolors (Hugging Face)'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('Settings updated successfully');
      setSaving(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-serif font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground italic">Configure your luxury ecosystem and AI integrations</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-gold" />
              <CardTitle>General Configuration</CardTitle>
            </div>
            <CardDescription>Basic information about your store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Site Name</label>
                <Input 
                  name="siteName" 
                  value={settings.siteName} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Currency</label>
                <Input 
                  name="currency" 
                  value={settings.currency} 
                  onChange={handleChange} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Site Description</label>
              <Textarea 
                name="siteDescription" 
                value={settings.siteDescription} 
                onChange={handleChange} 
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* AI & Integration */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-gold" />
              <CardTitle>AI Integration</CardTitle>
            </div>
            <CardDescription>Virtual Try-On API and provider settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">AI Provider</label>
              <Input 
                name="aiProvider" 
                value={settings.aiProvider} 
                onChange={handleChange} 
                disabled
              />
              <p className="text-xs text-muted-foreground">Currently managed via environment variables.</p>
            </div>
          </CardContent>
        </Card>

        {/* Security & Access */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-gold" />
              <CardTitle>Security & Access</CardTitle>
            </div>
            <CardDescription>Manage user registration and maintenance mode</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-glass-border/20">
                <div>
                  <p className="text-sm font-medium">Enable User Registration</p>
                  <p className="text-xs text-muted-foreground">Allow new customers to create accounts</p>
                </div>
                <div className="w-12 h-6 bg-gold rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full" />
                </div>
             </div>
             <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-glass-border/20">
                <div>
                  <p className="text-sm font-medium">Maintenance Mode</p>
                  <p className="text-xs text-muted-foreground">Disable public access to the storefront</p>
                </div>
                <div className="w-12 h-6 bg-white/10 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-muted-foreground rounded-full" />
                </div>
             </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={saving}
            className="min-w-[180px] bg-gold text-black hover:bg-gold/90 h-12"
          >
            {saving ? 'Saving Changes...' : (
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save All Settings
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
